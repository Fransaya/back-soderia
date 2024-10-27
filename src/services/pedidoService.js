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

        if(estado && estado != 0){
            condiciones.push("p.estado = ?");
            values.push(estado);
        };

        if(idCliente){
            condiciones.push("p.idCliente = ?");
            values.push(idCliente);
        };

        // consulta para obtener unicamente los pedidos ( informacion basica de los pedidos X sin detalles)
        let queryPedido = `select p.idPedido, c.id as idCliente, c.nombre, c.telefono, c.direccion, b.nombre as barrioCliente, u.id as idUsuario, p.total as totalPedido,
                            p.fechaRegistro, ep.idEstado as idEstado, ep.valor as estado, p.observaciones FROM pedidos p
                            LEFT JOIN  clientes c on p.idCliente = c.id
                            LEFT JOIN barrio b on c.idBarrio = b.idBarrio
                            LEFT JOIN usuario u on u.id = c.id
                            LEFT JOIN estadoPedido ep ON ep.idEstado = p.estado
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
        console.log("datos recibidos", pedido)

        // inserto en la tabla pedidos
        const queryInsert = `INSERT INTO pedidos (idCliente, idUsuario, total, fechaRegistro, estado, observaciones)
                            VALUES ( ?, ?, ? ,?, ?, ?)`;

        const [pedidoNuevo] = await connect.execute(queryInsert,[
            pedido.idCliente,
            pedido.idUsuario,
            pedido.totalPedido,
            pedido.fechaRegistro,
            1,
            pedido.observaciones | null,
        ]);


        // obtengo el id del pedido insertado
        let idPedido = pedidoNuevo.insertId;

        const queryDetalle = `INSERT INTO detallePedido (idPedido, idProducto, cantidadUnidades, total,  precio)
                            VALUES ( ?, ?, ?, ?, ?)`;

        let totalPedido = 0;

        // inserto en la tabla de detalle pedido recorriendo el array del detalle recibido
        for(let detalle of pedido.detalles){
            totalPedido+= detalle.cantidadUnidades * detalle.precio;
            await connect.execute(queryDetalle, [idPedido, detalle.id, detalle.cantidadUnidades, detalle.cantidadUnidades * detalle.precio, detalle.precio]);
        }

        const updateTotal = `UPDATE pedidos SET total = ? WHERE idPedido = ?`;

        await connect.execute(updateTotal, [totalPedido, idPedido]);

        return {status:true, message:"Pedido registrado correctamente"};
    } catch (error) {
        console.error("Error al registrar el pedido", error)
        throw new Error("Error al registrar el pedido");
    } finally {
        connect.releaseConnection();
    };
};

//* modificar pedidos/ estado de pedido
// export const updatePedidoService = async(idPedido, pedido)=>{
//     const connect = await Connection();
//     try {
//         primero verifico si el estado del pedido esta en 1 (RECIBIDO);
//         const queryEstado = `SELECT estado FROM pedidos WHERE idPedido = ?`;
        
//         const [estadoPedido] = await connect.query(queryEstado, [idPedido]);

//          devuelvo un error si el estado del producto es distinto de 1 ( SOLO SE PUEDEN ELIMINAR LOS QUE ESTEN EN ESTADO 1 => RECIBIDO )
//         if(estadoPedido[0].estado !== 1) return {status:false, message:"NO se pueden eliminar los productos del pedido ya que no esta en estado RECIBIDO"};

//         0. guardo el array del detalle de pedido
//         let detallePedido = pedido.detalles;

//         1. obtengo informacion del detalle de pedido antes de realizar las operaciones para comparar
//         const [ oldPedido ] = await connect.execute(`SELECT idDetalle, idProducto, cantidadUnidades as unidadesPedidas, precio as precioUnitario, total FROM detallePedido WHERE idPedido = ?`, [idPedido]);

//         console.log("pedido antiguo", oldPedido);
//         console.log("nuevo pedido", detallePedido)

//         2. comparacion de longitd de los arrays
//         if(oldPedido.length == detallePedido.length){ // los pedidos son iguales en longitud
//             2.1 itero sobre los arrays para comprar
//             for (let i=0; i < detallePedido.length;i++){
//                 if(oldPedido[i].idProducto != detallePedido[i].idProducto || oldPedido[i].unidadesPedidas != detallePedido[i].unidadesPedidas || oldPedido[i].precioUnitario != detallePedido[i].precioUnitario){
//                     2.2 si algun dato es distinto, modifico el detalle
//                     const queryUpdate = `UPDATE detallePedido SET idProducto = ?, cantidadUnidades = ?, precio = ?, total = ? WHERE idDetalle = ?`;

//                     await connect.execute(queryUpdate, [detallePedido[i].idProducto, detallePedido[i].unidadesPedidas, detallePedido[i].precioUnitario, detallePedido[i].unidadesPedidas * detallePedido[i].precioUnitario, oldPedido[i].idDetalle]);
//                 };
//             }
//         }else if(oldPedido.length < detallePedido.length){ 3. agrego nuevo producto al pedido
//             for(let i=0; i <= detallePedido.length;i++){
//                 if(detallePedido[i].idDetalle == 0){ 3.1. si el idDetalle = 0, es nuevo producto al pedido
//                     const queryInsert = `INSERT INTO detallePedido (idPedido, idProducto, cantidadUnidades, total, precio)
//                                         VALUES (?, ?, ?, ?, ?)`;
//                     let [pedidoconcero] = await connect.execute(queryInsert,[idPedido, detallePedido[i].idProducto, detallePedido[i].unidadesPedidas, detallePedido[i].unidadesPedidas * detallePedido[i].precioUnitario, detallePedido[i].precioUnitario]);
//                     console.log("info pedido", pedidoconcero)
//                 }else{ 4. si no tiene id de detalle, actualizo los datos del mismo
//                     console.log("ACTUALIZACION DE VALORES DE PEDIDOS", detallePedido)
//                     console.log("error al actualizar pedido con idDetalle !==0")
                    
//                     const updateQuery = `UPDATE detallePedido SET idProducto = ?, cantidadUnidades = ?, precio = ?, total = ? WHERE idDetalle = ?`;

//                     let [updatePedido] = await connect.execute(updateQuery, [detallePedido[i].idProducto, detallePedido[i].unidadesPedidas, detallePedido[i].precioUnitario, detallePedido[i].unidadesPedidas * detallePedido[i].precioUnitario, detallePedido[i].idDetalle]); 

//                     console.log("info pedido", updatePedido)
//                 }
//             }
//         }

//         return {status:true, message:"Pedido modificado correctamente"}
//     } catch (error) {
//         console.error("Error al modificar el pedido", error)
//         throw new Error("Error al modificar el pedido");
//     } finally {
//         connect.releaseConnection();
//     };
// };

//* modificar pedidos/ estado de pedido
export const updatePedidoService = async (idPedido, pedido) => {
    const connect = await Connection();
    try {
        // Obtener detalles del pedido antiguo
        const [oldPedido] = await connect.execute(`SELECT idDetalle, idProducto, cantidadUnidades as unidadesPedidas, precio as precioUnitario, total FROM detallePedido WHERE idPedido = ?`, [idPedido]);

        let detallePedido = pedido.detalles;

        // Comparación de la longitud de los arrays
        if (oldPedido.length === detallePedido.length) {
            // Iterar sobre los arrays para comparar y actualizar si es necesario
            for (let i = 0; i < detallePedido.length; i++) {
                if (oldPedido[i].idProducto !== detallePedido[i].idProducto || oldPedido[i].unidadesPedidas !== detallePedido[i].unidadesPedidas || oldPedido[i].precioUnitario !== detallePedido[i].precioUnitario) {
                    const queryUpdate = `UPDATE detallePedido SET idProducto = ?, cantidadUnidades = ?, precio = ?, total = ? WHERE idDetalle = ?`;
                    await connect.execute(queryUpdate, [
                        detallePedido[i].idProducto,
                        detallePedido[i].unidadesPedidas,
                        detallePedido[i].precioUnitario,
                        detallePedido[i].unidadesPedidas * detallePedido[i].precioUnitario,
                        oldPedido[i].idDetalle
                    ]);
                }
            }
        } else {
            // Manejo cuando hay diferencias de longitud en los detalles del pedido
            for (let i = 0; i < detallePedido.length; i++) {
                // Si idDetalle es 0, es un nuevo producto, hacer inserción
                if (detallePedido[i].idDetalle === 0) {
                    const queryInsert = `INSERT INTO detallePedido (idPedido, idProducto, cantidadUnidades, total, precio) VALUES (?, ?, ?, ?, ?)`;
                    await connect.execute(queryInsert, [
                        idPedido,
                        detallePedido[i].idProducto,
                        detallePedido[i].unidadesPedidas,
                        detallePedido[i].unidadesPedidas * detallePedido[i].precioUnitario,
                        detallePedido[i].precioUnitario
                    ]);
                } else {
                    // Si no, actualizar
                    const updateQuery = `UPDATE detallePedido SET idProducto = ?, cantidadUnidades = ?, precio = ?, total = ? WHERE idDetalle = ?`;
                    await connect.execute(updateQuery, [
                        detallePedido[i].idProducto,
                        detallePedido[i].unidadesPedidas,
                        detallePedido[i].precioUnitario,
                        detallePedido[i].unidadesPedidas * detallePedido[i].precioUnitario,
                        detallePedido[i].idDetalle
                    ]);
                }
            }
        }

        // calculo el nuevo total del pedido
        const [newTotal] = await connect.execute(`SELECT SUM(total) as newTotal FROM detallePedido WHERE idPedido = ?`, [idPedido]);

        // actualizo el nuevo total en el pedido
        const updateTotalQuery = `UPDATE pedidos SET total = ?, estado = ?, observaciones = ? WHERE idPedido = ?`;

        const [updatePedido] = await connect.execute(updateTotalQuery, [newTotal[0].newTotal, pedido.estado, pedido.observaciones || '', idPedido]);

        if(updatePedido.affectedRows === 0) return {status:false, message:"Error al actualizar el total del pedido"}

        return { status: true, message: "Pedido modificado correctamente" };
    } catch (error) {
        console.error("Error al modificar el pedido", error);
        throw new Error("Error al modificar el pedido");
    } finally {
        connect.releaseConnection();
    }
};


//* eliminar los productos de un pedido que esta en estado 1
export const deleteProductosPedidoService = async(idPedido, producto)=>{
    const connect = await Connection();
    try {
        // primero verifico si el estado del pedido esta en 1 (RECIBIDO);
        const queryEstado = `SELECT estado FROM pedidos WHERE idPedido = ?`;
        
        const [estadoPedido] = await connect.query(queryEstado, [idPedido]);

        // devuelvo un error si el estado del producto es distinto de 1 ( SOLO SE PUEDEN ELIMINAR LOS QUE ESTEN EN ESTADO 1 => RECIBIDO )
        if(estadoPedido[0].estado !== 1) return {status:false, message:"NO se pueden eliminar los productos del pedido ya que no esta en estado RECIBIDO"};

        // consulta para eliminar los productos de un pedido
        const deleteQuery = `DELETE FROM detallePedido WHERE idPedido = ? AND idProducto = ? and idDetalle = ?`;

        let montoProductosEliminados = 0;

        // acumulo el valor total de los productos a eliminar
        montoProductosEliminados += (producto.cantidadUnidades * producto.precio);

        const [deleted] = await connect.execute(deleteQuery, [idPedido, producto.idProducto, producto.idDetalle]);    

        // actualizo el total del pedido restando el monto de los productos eliminado
        const updateTotalQuery = `UPDATE pedidos SET total = total - ? WHERE idPedido = ?`;
        
        await connect.execute(updateTotalQuery, [montoProductosEliminados, idPedido]);

        return {status:true, message:"Productos eliminados correctamente del pedido"};
    } catch (error) {
        console.error("Error al eliminar los productos del pedido", error);
        throw new Error("Error al eliminar los productos del pedido");
    } finally {
        connect.releaseConnection();
    };
};

