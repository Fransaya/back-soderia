//* IMPORTACION DE FUNCIONES DE SERVICIO
import { 
    getPedidosService,
    registrarPedidoService,
    updatePedidoService,
    deleteProductosPedidoService
} from "../services/pedidoService.js";

//* obtener todos los pedidos
export const getPedidosContoller =async(req,res,next)=>{
    const { fecha, estado, idCliente, fechaDesde, fechaHasta } = req.query;
    try {
        const pedidos = await getPedidosService({fecha, estado, idCliente, fechaDesde, fechaHasta});

        if(pedidos.length === 0){
            res.status(404).json({message: "No hay pedidos registrados"});
        } else {
            res.status(200).json(pedidos);
        }
    } catch (error) {
        console.error("Error al obtener los pedidos", error);
        next(error);
    };
};


//* registrar pedido
export const registerPedidoController = async(req, res, next)=>{
    const pedido  = req.body;
    try {
        const nuevoPedido = await registrarPedidoService(pedido);

        if(nuevoPedido.status == false) return res.status(400).json(nuevoPedido);

        return res.status(201).json(nuevoPedido);
    } catch (error) {
        console.error("Error al registrar el pedido", error);
        next(error);
    };
};

//* modificar pedido/estado pedido 
export const updatePedidoController = async(req, res, next)=>{
    const { id } = req.params;
    const pedido = req.body;
    try {
        const pedidoModificado = await updatePedidoService(id, pedido);


        return res.status(200).json(pedidoModificado);
    } catch (error) {
        console.error("Error al modificar el pedido", error);
        next(error);
    };
};

//* eliminar productos de un pedido en estado ( RECIBIDO )
export const deleteProductoPedidoController = async(req, res, next)=>{
    const { id } = req.params;
    const producto = req.body;
    try {
        const productosEliminados = await deleteProductosPedidoService(id, producto);

        return res.status(200).json(productosEliminados);
    } catch (error) {
        console.error("Error al eliminar el producto del pedido", error);
        next(error);
    };
};