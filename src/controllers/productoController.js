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

//* obtener producto por codigo
const productByCodigo = async(req,res)=>{
    try {
        const codigo = req.params.codigo;

        const producto = await productoService.getProductoCodigo(codigo);
        if(producto){
            return res.status(200).json(producto);
        }else{
            return res.status(404).json({status:false, message: 'Error al obtener producto'});
        }
    } catch (error) {
        return res.status(500).json({message:"Error al obtener producto por codigo", error: error.message});
    }
};

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
    
        const result = await productoService.updateProduct(id,product.nombre,product.descripcion,product.codigo,product.precioMinorista,product.precioMayorista,product.costo,product.tipo,product.fecha_registro,product.stock_total,product.xs,product.s,product.m,product.l,product.xl,product.xxl,product.xxxl,product.a6xl, product.a7xl, product.a8xl, product.a9xl, product.a10xl, product.n4, product.n5, product.n6, product.n7, product.n8, product.n9, product.n10, product.n11, product.n12, product.n13, product.n14, product.notaAdicional);
    
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

export default {
    allProductos,
    productByCodigo,
    productById,
    createNewProduct,
    updateProducto,
    deleteProducto
}

