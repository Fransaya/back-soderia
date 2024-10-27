import Connection from "../config/db.js";
import axios from "axios";
import { format } from "date-fns";


//* OBTENER TODAS LAS VENTAS
const getVentas=async({ fechaEspecifica, fechaRango, idCliente, idUsuario } = {})=>{
    const connect = await Connection();
    try {
        // condiciones dinamicas
        const condiciones = [];
        const values = [];

        // valido las condiciones que recibi
        if(fechaEspecifica){
            condiciones.push("v.fecha = ?");
            values.push(fechaEspecifica);
        };

        if(fechaRango){
            condiciones.push("v.fecha >= ?");
            values.push(fechaRango);
        };

        if(idCliente){
            condiciones.push("v.idCliente = ?");
            values.push(idCliente);
        };

        if(idUsuario){
            condiciones.push("v.idUsuario = ?");
            values.push(idUsuario);
        }

        // consulta para obtener unicamente los pedidos ( informacion basica de los pedidos X sin detalles)
        let queryPedido = `select v.idVenta, v.idCliente, c.nombre as nombreCliente, c.telefono, c.direccion, b.nombre as barrioCliente, u.id as idUsuario, v.total as totalVenta,
                            v.fecha, ev.id as idEstado, ev.nombre as estado, v.observaciones, v.idMetodoPago, mp.nombre as metodoPago FROM ventas v
                            LEFT JOIN  clientes c on v.idCliente = c.id
                            LEFT JOIN barrio b on c.idBarrio = b.idBarrio
                            LEFT JOIN usuario u on u.id = c.id
                            LEFT JOIN estadoVenta ev ON ev.id = v.estado
                            LEFT JOIN metodoPago mp ON v.idMetodoPago = mp.id
                            WHERE 1 = 1`;

        if(condiciones.length > 0){
            queryPedido += ` AND ${condiciones.join(' AND ')}`;
        };

        // agrego filtro para ordernar por id de pedido
        queryPedido += ' ORDER BY v.idVenta;';

        const [ventas] = await connect.query(queryPedido, values);

        // consulta para obtener los detalles de los pedidos
        const queryDetalle = `SELECT dv.idDetalle, dv.idVenta, p.id as idProducto, p.nombre as nombreProd,
                                dv.cantidadUnidades as unidadesPedidas, dv.total, dv.precio as precioUnitario from detalleVenta dv
                                left join producto p on dv.idProducto = p.id;`;

        const [detalles] = await connect.query(queryDetalle);

         // Combinar los detalles con los pedidos
        const ventasConDetalle = ventas.map(venta => {
            // Filtrar los detalles que pertenecen a esta venta
            const detalleVenta = detalles.filter(detalle => detalle.idVenta === venta.idVenta);
            
            // Retornar la venta con su array de detalles
            return {
                ...venta,  // Aquí solo agregamos la venta actual
                detalles: detalleVenta
            };
        });

        return ventasConDetalle;
    } catch (error) {
        console.error("Error al obtener las ventas", error)
        throw new Error(`Error al obtener ventas`);
    }finally{
        connect.releaseConnection();
    }
};

//* REGISTRAR NUEVA VENTA
const registerVenta = async (idCliente, idUsuario, idMetodoPago, estado, fecha, total, observaciones, arrayVenta)=> {
    const connect = await Connection();
    let idVenta;
    try {
        // Inserta la venta
        const queryVenta = `INSERT INTO ventas (idCliente, idUsuario, idMetodoPago, estado, fecha, total, observaciones)
                            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [resultVenta] = await connect.execute(queryVenta, [idCliente, idUsuario, idMetodoPago, 1, fecha, total, observaciones]);

        if (resultVenta && resultVenta.insertId) {
            idVenta = resultVenta.insertId;

            // Inserta los detalles de la venta
            for (let i = 0; i < arrayVenta.length; i++) {
                // actualizar stock del producto cantidad de unidades
                console.log("producto", arrayVenta[i]);

                let id_producto = arrayVenta[i].idProducto;
                let cantidad = arrayVenta[i].cantidadUnidades;
                let precio_unitario = arrayVenta[i].precio;
                let total_producto = arrayVenta[i].cantidadUnidades * arrayVenta[i].precio;

                const queryDetalle = `INSERT INTO detalleVenta(idVenta, idProducto, cantidadUnidades, precio, total)
                                        VALUES (?, ?, ?, ?, ?)`;
                const [resultDetalle] = await connect.execute(queryDetalle, [idVenta, id_producto, cantidad, precio_unitario, total_producto,]);

                if (resultDetalle.affectedRows === 0) {
                    throw new Error("Error al registrar el producto de la venta");
                }
            }

            // await connect.commit(); // Confirma la transacción
            return { status: true, message: "Venta registrada correctamente" };
        } else {
            throw new Error("Error al registrar la venta");
        }
    } catch (error) {
        // await connect.rollback(); // Revierte la transacción en caso de error
        console.log("Error al registrar venta", error);
        return { status: false, message: error.message };
    } finally {
        connect.releaseConnection(); // Libera la conexión
    }
};

//* MODIFICAR VENTA
const updateVenta = async (idVenta, idCliente, idUsuario, idMetodoPago, estado, fecha, total, observaciones) => {
    const connect = await Connection();
    try {

        // Actualiza la venta
        const queryVenta = `UPDATE ventas
                            SET idCliente = ?, idUsuario = ?, idMetodoPago = ?, estado = ?, fecha = ?, observaciones = ?
                            WHERE idVenta = ?`;

        const [resultVenta] = await connect.execute(queryVenta, [idCliente, idUsuario, idMetodoPago, estado, fecha , idVenta])

        if(resultVenta.affectedRows == 0) return {status:false, message:"Error al actualizar la venta"};

        return { status: true, message: "Venta actualizada correctamente" };
        
    } catch (error) {
        await connect.rollback(); // Revierte la transacción en caso de error
        console.log("Error al actualizar venta", error);
        return { status: false, message: error.message };
    } finally {
        connect.release(); // Libera la conexión
    }
};


export default{
    getVentas,
    registerVenta,
    updateVenta,
}
