import { Router } from "express";

//* IMPORTACION DE FUNCIONES DE CONTROLADOR DE PEIDODS
import { 
    getPedidosContoller,
    registerPedidoController,
    updatePedidoController,
    addProductoPedidoController,
    deleteProductoPedidoController
} from "../controllers/pedidosController.js";


const pedidosRoute = Router();

//* obtener todos los pedidos
//!IMPORTANTE: en esta funcion se pueden obtener los pedidos por fecha, estado e idCliente se reciben los datos por query
pedidosRoute.get('/', getPedidosContoller);

//* registra nuevo pedido
pedidosRoute.post('/', registerPedidoController);

//* modificiar datos/estado de pedidos
pedidosRoute.put('/:id', updatePedidoController);

//* modificacion de pedido => se agrega un nuevo proucto al pedido
pedidosRoute.post('/:id', addProductoPedidoController);

//* modificacion de pedido => eliminar un producto del pedido 
pedidosRoute.delete('/:id',deleteProductoPedidoController);


export default pedidosRoute;