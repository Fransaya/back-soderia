import { es } from "date-fns/locale";
import Connection from "../config/db.js";

//* obtener todos los pedidos
export const getPedidosService = async({ fecha, estado, idCliente } = {})=>{
    const connect = await Connection();
    try {
        // condiciones dinamicas
        const condiciones = [];
        const values = [];

        // valido las condiciones que recibi
        if(fecha){
            condiciones.push("p.fechaRegistro = ?");
            values.push(fecha);
        };

        if(estado){
            condiciones.push("p.estado = ?");
            values.push(estado);
        };

        if(idCliente){
            condiciones.push("p.idCliente = ?");
            values.push(idCliente);
        };

        // consulta para obtener unicamente los pedidos ( informacion basica de los pedidos X sin detalles)
        let queryPedido = `select p.idPedido, c.id as idCliente, c.nombre, c.telefono, c.direccion, b.nombre as barrioCliente, u.id as idUsuario, p.total as totalPedido,
                            p.fechaRegistro, p.estado, p.observaciones FROM pedidos p
                            LEFT JOIN  clientes c on p.idCliente = c.id
                            LEFT JOIN barrio b on c.idBarrio = b.idBarrio
                            LEFT JOIN usuario u on u.id = c.id
                            WHERE 1 = 1`;

        if(condiciones.length > 0){
            queryPedido += ` AND ${condiciones.join(' AND ')}`;
        };

        // agrego filtro para ordernar por id de pedido
        queryPedido += ' ORDER BY p.idPedido;';

        const [pedidos] = await connect.query(queryPedido, values);

        // consulta para obtener los detalles de los pedidos
        const queryDetalle = `SELECT dp.idDetalle, dp.idPedido, p.id as idProducto, p.nombre as nombreProd,
                                dp.cantidadUnidades as unidadesPedidas, dp.total, dp.precio as precioUnitario from detallePedido dp
                                left join producto p on dp.idProducto = p.id;`;

        const [detalles] = await connect.query(queryDetalle);

         // Combinar los detalles con los pedidos
        const pedidosConDetalles = pedidos.map(pedido => {
        // Filtrar los detalles que pertenecen a este pedido
            const detallesPedido = detalles.filter(detalle => detalle.idPedido === pedido.idPedido);
        
            // Retornar el pedido con su array de detalles
            return {
                ...pedido,
                detalles: detallesPedido
            };
        });

        return pedidosConDetalles;
    } catch (error) {
        console.error("Error al obtener los pedidos", error)
        throw new Error("Error al obtener los pedidos");
    } finally {
        connect.releaseConnection();
    };
};


//* registrar pedido
export const registrarPedidoService = async(pedido)=>{
    const connect = await Connection();
    try {
        // inserto en la tabla pedidos
        const queryInsert = `INSERT INTO pedidos (idCliente, idUsuario, total, fechaRegistro, estado, observaciones)
                            VALUES ( ?, ?, ? ,?, ?, ?)`;

        const [pedidoNuevo] = await connect.execute(queryInsert,[
            pedido.idCliente,
            pedido.idUsuario,
            pedido.totalPedido,
            pedido.fechaRegistro,
            pedido.estado,
            pedido.observaciones,
        ]);

        // obtengo el id del pedido insertado
        let idPedido = pedidoNuevo.insertId;

        const queryDetalle = `INSERT INTO detallePedido (idPedido, idProducto, cantidadUnidades, total,  precio)
                            VALUES ( ?, ?, ?, ?, ?)`;

        let totalPedido = 0;

        // inserto en la tabla de detalle pedido recorriendo el array del detalle recibido
        for(let detalle of pedido.detalles){
            totalPedido+= detalle.unidadesPedidas * detalle.precioUnitario;
            await connect.execute(queryDetalle, [idPedido, detalle.idProducto, detalle.unidadesPedidas, detalle.unidadesPedidas * detalle.precioUnitario, detalle.precioUnitario]);
        }

        const updateTotal = `UPDATE pedidos SET total = ? WHERE idPedido = ?`;

        const [update] = await connect.execute(updateTotal, [totalPedido, idPedido]);

        return {status:true, message:"Pedido registrado correctamente"};
    } catch (error) {
        console.error("Error al registrar el pedido", error)
        throw new Error("Error al registrar el pedido");
    } finally {
        connect.releaseConnection();
    };
};

//* modificar pedidos/ estado de pedido
export const updatePedidoService = async(idPedido, pedido)=>{
    const connect = await Connection();
    try {
        // consulta para modificar datos principales del pedido
        const queryUpdate = `UPDATE pedidos SET idCliente = ?, idUsuario = ?, total = ?, fechaRegistro  =?, observaciones = ? WHERE idPedido  = ?`;

        const [updatedPedido] = await connect.execute(queryUpdate,[
            pedido.idCliente,
            pedido.idUsuario,
            pedido.totalPedido,
            pedido.fechaRegistro,
            pedido.observaciones,
            idPedido,
        ]);

        // valido si tambien recibo datos del detalle del pedido para modificar
        if(pedido.detalles.length > 0){
            const queryDetalle = `UPDATE detallePedido SET idProducto = ?, cantidadUnidades = ?, total = ?, precio = ? WHERE idPedido = ?`;

            for(let detalle of pedido.detalles){
                await connect.execute(queryDetalle, [ detalle.idProducto, detalle.unidadesPedidas, detalle.unidadesPedidas * detalle.precioUnitario, detalle.precioUnitario, idPedido]);
            };
        };
        return {status:true, message:"Pedido modificado correctamente"}
        
    } catch (error) {
        console.error("Error al modificar el pedido", error)
        throw new Error("Error al modificar el pedido");
    } finally {
        connect.releaseConnection();
    };
};

//* agrega producto a un pedido ya registrado
export const addProductoToPedidoService = async(idPedido, productos)=>{
    const connect = await Connection();
    try {
        // consulta para agregar un producto/s a un pedido ya existente
        const queryDetalle = `INSERT INTO detallePedido (idPedido, idProducto, cantidadUnidades, total, precio)
                            VALUES (?, ?, ?, ?, ?)`;


        if(productos.length > 0){
            for(let producto of productos){
                // ejectuo consulta para agregar nuevo producto
                const [detalleNuevo] = await connect.execute(queryDetalle,[
                    idPedido,
                    producto.idProducto,
                    producto.unidadesPedidas,
                    producto.unidadesPedidas * producto.precioUnitario,
                    producto.precioUnitario,
                ]);

                // consulta para actualizar el total del pedido
                const queryUpdate = `UPDATE pedidos SET total = total + ? WHERE idPedido = ?`;

                const [update] = await connect.execute(queryUpdate, [producto.unidadesPedidas * producto.precioUnitario, idPedido]);
            };
        };

        return {status:true, message:"Producto agregado correctamente al pedido"};
    } catch (error) {
        console.error("Error al agregar el producto al pedido", error)
        throw new Error("Error al agregar el producto al pedido");
    } finally {
        connect.releaseConnection();
    };
};

