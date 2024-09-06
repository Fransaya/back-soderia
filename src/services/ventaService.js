import Connection from "../config/db.js";
import axios from "axios";
import { format } from "date-fns";


//* OBTENER TODAS LAS VENTAS
const getVentas=async()=>{
    const connect = await Connection();
    try {
        const query = `SELECT 
                v.id_venta,
                v.fecha_venta,
                v.total_venta,
                v.cliente,
                v.metodo_pago,
                v.nota_adicional,
                d.id_detalle,
                d.cantidad,
                d.precio_unitario,
                d.total_producto,
                d.talle_venta,
                p.nombre AS nombre_producto,
                p.codigo AS codigo_producto
            FROM 
                ventas v
            JOIN 
                detalle_venta d ON v.id_venta = d.id_venta
            JOIN 
                productos p ON d.id_producto = p.id
            ORDER BY 
                v.fecha_venta DESC, v.id_venta, d.id_detalle;
            `;
        
        const [result] = await connect.query(query);

        if(result.length>0) return result;

        if(result.length==0) return {status:false,message:"no se econtraron ventas"};
    } catch (error) {
        console.error("Error al obtener las ventas", error)
        throw new Error(`Error al obtener ventas`);
    }finally{
        connect.releaseConnection();
    }
};

//* OBTENER VENTA POR ID DE VENTA
const getVentaId = async(id)=>{
    const connect = await Connection();
    try {
        const query = `SELECT 
                v.id_venta,
                v.fecha_venta,
                v.total_venta,
                v.cliente,
                v.metodo_pago,
                v.nota_adicional,
                d.id_detalle,
                d.cantidad,
                d.precio_unitario,
                d.total_producto,
                d.talle_venta,
                p.nombre AS nombre_producto,
                p.codigo AS codigo_producto
            FROM 
                ventas v
            JOIN 
                detalle_venta d ON v.id_venta = d.id_venta
            JOIN 
                productos p ON d.id_producto = p.id
            WHERE 
                v.id_venta = ?
            ORDER BY 
                d.id_detalle;`;
        
        const [result] = await connect.query(query, id);

        if(result.length==0) return {status:true, message:"Error al obtener venta por id"};

        return result;
    } catch (error) {
        console.error("Error al obtener venta por id", error)
        throw new Error(`Error al obtener venta por id ${id}`);
    }finally{
        connect.releaseConnection();
    }
}
//* OBTENER VENTA POR FECHA
const getVentaFecha =  async(fecha)=>{
    const connect = await Connection();
    // console.log("fecha", fecha)
    try {
        const query = `SELECT 
                    v.id_venta,
                    v.fecha_venta,
                    v.total_venta,
                    v.cliente,
                    v.metodo_pago,
                    v.nota_adicional,
                    d.id_detalle,
                    d.cantidad,
                    d.precio_unitario,
                    d.total_producto,
                    d.talle_venta,
                    p.nombre AS nombre_producto,
                    p.codigo AS codigo_producto
                    FROM 
                    ventas v
                    JOIN 
                    detalle_venta d ON v.id_venta = d.id_venta
                    JOIN 
                    productos p ON d.id_producto = p.id
                    WHERE
                    v.fecha_venta = ?
                    ORDER BY 
                    v.fecha_venta DESC, 
                    v.id_venta, 
                    d.id_detalle;`;

        const [result] = await connect.query(query,[fecha]);
        if(result.length==0) return {status:false, message:"Error al obtener venta por fecha"};

        return result;
    } catch (error) {
        console.error("Error al obtener venta por fecha", error);
        throw new Error(`Error al obtener venta por fecha: ${fecha}`);
    }finally{
        connect.releaseConnection();
    }
}

//* REGISTRAR NUEVA VENTA
const registerVenta = async (fecha_venta, total_venta, cliente, metodo_pago, nota_adicional, tipo_venta, arrayVenta) => {
    const connect = await Connection();
    let idVenta;
    try {
        // await connect.beginTransaction(); // Inicia una transacción

        // Inserta la venta
        const queryVenta = `INSERT INTO ventas (fecha_venta, total_venta, cliente, metodo_pago, nota_adicional, tipo_venta)
                            VALUES (?, ?, ?, ?, ?, ?)`;
        const [resultVenta] = await connect.execute(queryVenta, [fecha_venta, total_venta, cliente, metodo_pago, nota_adicional, tipo_venta]);

        if (resultVenta && resultVenta.insertId) {
            idVenta = resultVenta.insertId;

            // Inserta los detalles de la venta
            for (let i = 0; i < arrayVenta.length; i++) {
                // actualizar stock del producto cantidad de unidades
                console.log("producto", arrayVenta[i]);

                //formateo la fecha para actualizar el stock del producto
                const formattedDate = format(new Date(arrayVenta[i].fecha_registro), 'yyyy-MM-dd');
                arrayVenta[i].fecha_registro= formattedDate;
                // console.log("fecha registro",arrayVenta[i].fecha_registro)
                // realizo solicitud http para verificar actualizar el stock por cada producto
                const actualizacionStock = await axios.put(`http://localhost:3000/api/producto/actualizar/${arrayVenta[i].producto_id}`, arrayVenta[i]);
                // console.log("respuesta al actualizar", actualizacionStock);
                if(actualizacionStock.status == false) return {status:false, message:"Error al registrar la venta"};

                let id_producto = arrayVenta[i].producto_id;
                let cantidad = arrayVenta[i].cantidadSeleccionada;
                let precio_unitario = arrayVenta[i].precioUnitario;
                let total_producto = arrayVenta[i].totalVenta;
                let talle_venta = arrayVenta[i].talle;

                const queryDetalle = `INSERT INTO detalle_venta(id_venta, id_producto, cantidad, precio_unitario, total_producto, talle_venta)
                                        VALUES (?, ?, ?, ?, ?, ?)`;
                const [resultDetalle] = await connect.execute(queryDetalle, [idVenta, id_producto, cantidad, precio_unitario, total_producto, talle_venta]);

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
const updateVenta = async (idVenta, fecha_venta, total_venta, cliente, metodo_pago, nota_adicional, tipo_venta, arrayVenta) => {
    const connect = await Connection();
    try {
        await connect.beginTransaction(); // Inicia una transacción

        // Actualiza la venta
        const queryVenta = `UPDATE ventas
                            SET fecha_venta = ?, total_venta = ?, cliente = ?, metodo_pago = ?, nota_adicional = ?, tipo_venta = ?
                            WHERE id_venta = ?`;
        const [resultVenta] = await connect.execute(queryVenta, [fecha_venta, total_venta, cliente, metodo_pago, nota_adicional, tipo_venta, idVenta]);

        if (resultVenta.affectedRows > 0) {
            // Elimina los detalles antiguos
            const deleteQuery = `DELETE FROM detalle_venta WHERE id_venta = ?`;
            await connect.execute(deleteQuery, [idVenta]);

            // Inserta o actualiza los detalles de la venta
            for (let i = 0; i < arrayVenta.length; i++) {
                let id_producto = arrayVenta[i].id_producto;
                let cantidad = arrayVenta[i].cantidad;
                let precio_unitario = arrayVenta[i].precio_unitario;
                let total_producto = arrayVenta[i].total_producto;
                let talle_venta = arrayVenta[i].talle_venta;

                const queryDetalle = `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, total_producto, talle_venta)
                                        VALUES (?, ?, ?, ?, ?, ?)`;
                const [resultDetalle] = await connect.execute(queryDetalle, [idVenta, id_producto, cantidad, precio_unitario, total_producto, talle_venta]);

                if (resultDetalle.affectedRows === 0) {
                    throw new Error("Error al registrar el producto de la venta");
                }
            }

            await connect.commit(); // Confirma la transacción
            return { status: true, message: "Venta actualizada correctamente" };
        } else {
            throw new Error("Error al actualizar la venta");
        }
    } catch (error) {
        await connect.rollback(); // Revierte la transacción en caso de error
        console.log("Error al actualizar venta", error);
        return { status: false, message: error.message };
    } finally {
        connect.release(); // Libera la conexión
    }
};


//* ELIMINAR VENTA
const eliminarVenta = async (id) => {
    const connect = await Connection();
    try {
        await connect.beginTransaction(); // Inicia una transacción

        // Elimina los detalles de la venta
        const queryDetalle = `DELETE FROM detalle_venta WHERE id_venta = ?`;
        const [resultDetalle] = await connect.execute(queryDetalle, [id]);

        if (resultDetalle.affectedRows >= 0) {
            // Elimina la venta
            const queryVenta = `DELETE FROM ventas WHERE id_venta = ?`;
            const [resultVenta] = await connect.execute(queryVenta, [id]);

            if (resultVenta.affectedRows > 0) {
                await connect.commit(); // Confirma la transacción
                return { status: true, message: "Venta eliminada correctamente" };
            } else {
                throw new Error("Error al eliminar la venta");
            }
        } else {
            throw new Error("Error al eliminar los detalles de la venta");
        }
    } catch (error) {
        await connect.rollback(); // Revierte la transacción en caso de error
        console.error("Error al eliminar la venta", error);
        return { status: false, message: error.message };
    } finally {
        connect.release(); // Libera la conexión
    }
};

export default{
    getVentas,
    getVentaId,
    getVentaFecha,
    registerVenta,
    updateVenta,
    eliminarVenta
}
