import productoService from "../services/productoService.js";

//* obtener todos los productos
const allProductos = async(req,res)=>{
    try {
        const productos = await productoService.getProductos();
        if(productos){
            return res.status(200).json(productos);
        }else{
            return res.status(404).json({status:false, message: "No existen proveedores productos"})
        }
    } catch (error) {
        return res.status(500).json({message:"Error al obtener todos los productos", error: error.message});
    }
};

//* obtener productos activos
const getProductosActive = async(req,res, next)=>{
    try {
        const productos = await productoService.getProductoActiveService();
        if(productos){
            return res.status(200).json(productos);
        }else{
            return res.status(404).json({status:false, message: "No existen productos productos"})
        }
    } catch (error) {
        return res.status(500).json({message:"Error al obtener todos los productos", error: error.message});
    }

}

//* obtener producto por id
const productById=async(req,res)=>{
    try {
        const id = req.params.id;

        const producto = await productoService.getProductoId(id);
        if(producto){
            return res.status(200).json(producto);
        }else{
            return res.status(404).json({status:false, message: 'Error al obtener producto'});
        }
    } catch (error) {
        return res.status(500).json({message:"Error al obtener producto por id", error: error.message});
    }
};

//* crear nuevo producto
const createNewProduct = async(req,res)=>{
    try {

        const product = req.body;

        const result = await productoService.createProduct(product);

        if(result){
            return res.status(201).json({status:true,message:'Producto creado correctamente'});
        }else{
            return res.status(404).json({status:false, message: 'No se creo el producto'});
        }
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({message:"Error al crear producto", error: error.message});
    }
};

//* actualizar datos de producto
const updateProducto = async(req,res)=>{
    try {
        const id = req.params.id;

        const product = req.body;
    
        const result = await productoService.updateProduct(id,product);
    
        if(result){
            return res.status(201).json({status:true,message:'Producto actualizado correctamente'});
        }else{
            return res.status(404).json({status:false, message: 'No se actualizo el producto'});
        };
    } catch (error) {
        return res.status(500).json({message:"Error al actualizar producto", error:error.message})
    }
};

//* eliminar producto
const deleteProducto = async(req,res)=>{
    try {
        const id = req.params.id;

        const result = await productoService.deleteProduct(id);

        if(result){
            return res.status(200).json({message:'Producto eliminado'});
        }else{
            return res.status(404).json({status:false, message:'Error al eliminar producto'});
        };
    } catch (error) {
        return res.status(500).json({message:"Error al eliminar producto", error:error.message})
    }
};

//* obtener productos de la lista de precios
const listaPrecios= async(req,res)=>{
    try {
        const productos = await productoService.getListaPrecio();

        return res.status(200).json(productos);
    } catch (error) {
        return res.status(500).json({message:"Error al obtener lista de precios", error:error.message})
    }
}

//* agregar productos a la lista de precios
const addProuctoListaPrecioController = async(req, res)=>{
    try {
        const productos = req.body.productos;

        console.log("productos", productos)

        const result = await productoService.addProductsListaPrecio(productos);

        if(result){
            return res.status(201).json({status:true, message:'Productos agregados a la lista de precios'});
        }else{
            return res.status(404).json({status:false, message:'Error al agregar productos a la lista de precios'});
        }
    } catch (error) {
        return res.status(500).json({message:"Error al agregar productos a la lista de precios", error:error.message})
    }
};

//* actualizar producto de la lista de precios
const updateProductoListaPrecioController = async(req, res)=>{
    try {
        const idDetalle = req.params.idDetalle;
        const producto = req.body;
        console.log("datos", producto, "id", idDetalle)

        const result = await productoService.updateProductoListaPrecio(idDetalle, producto);

        if(result){
            return res.status(200).json({message:'Producto actualizado de la lista de precios'});
        }else{
            return res.status(404).json({status:false, message:'Error al actualizar producto de la lista de precios'});
        }
    } catch (error) {
        return res.status(500).json({message:"Error al actualizar producto de la lista de precios", error:error.message})
    }
}

//* eliminar productos de la lista de precio
const deleteProductoListaPrecioController = async(req, res)=>{
    try {
        const idDetalle = req.params.idDetalle;

        const result = await productoService.deleteProductoListaPrecio(idDetalle);

        if(result){
            return res.status(200).json({message:'Producto eliminado de la lista de precios'});
        }else{
            return res.status(404).json({status:false, message:'Error al eliminar producto de la lista de precios'});
        }
    } catch (error) {
        return res.status(500).json({message:"Error al eliminar producto de la lista de precios", error:error.message})
    }
}

export default {
    allProductos,
    getProductosActive,
    productById,
    createNewProduct,
    updateProducto,
    deleteProducto,
    listaPrecios,
    updateProductoListaPrecioController,
    addProuctoListaPrecioController,
    deleteProductoListaPrecioController
}

