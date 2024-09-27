//* IMPORTACION DE FUNCIONES DE SERVICIO
import { 
    getPedidosService,
    registrarPedidoService,
    updatePedidoService,
    addProductoToPedidoService,
    deleteProductosPedidoService
} from "../services/pedidoService.js";

//* obtener todos los pedidos
export const getPedidosContoller =async(req,res,next)=>{
    const { fecha, estado, idCliente } = req.query;
    try {
        const pedidos = await getPedidosService({fecha, estado, idCliente});

        if(pedidos.length === 0){
            res.status(404).json({message: "No se encontraron pedidos"});
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

        if(pedidoModificado.status == false) return res.status(400).json(pedidoModificado);

        return res.status(200).json(pedidoModificado);
    } catch (error) {
        console.error("Error al modificar el pedido", error);
        next(error);
    };
};

//* modificar pedido => agregar un nuevo producto al pedido
export const addProductoPedidoController = async(req, res, next)=>{
    const { id } = req.params;
    const producto = req.body;
    try {
        const pedidoModificado = await addProductoToPedidoService(id, producto);

        if(pedidoModificado.status == false) return res.status(400).json(pedidoModificado);

        return res.status(200).json(pedidoModificado);
    } catch (error) {
        console.error("Error al modificar el pedido", error);
        next(error);
    };
};

//* eliminar productos de un pedido en estado ( RECIBIDO )
export const deleteProductoPedidoController = async(req, res, next)=>{
    const { id } = req.params;
    const productos = req.body;
    try {
        const productosEliminados = await deleteProductosPedidoService(id, productos);

        return res.status(200).json(productosEliminados);
    } catch (error) {
        console.error("Error al eliminar el producto del pedido", error);
        next(error);
    };
};