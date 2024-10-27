import { previousDay } from "date-fns";
import Connection from "../config/db.js";
import { randomCodeProduct } from "../functions/generateCode.js";
import { id } from "date-fns/locale";

//* OBTENER TODOS LOS PRODUCTOS
const getProductos = async()=>{
    const connect = await Connection();
    try {
        const query = `SELECT  * FROM producto p;`
        const [result] =  await connect.query(query);

        if(result.length == 0){
            throw new Error(`No se encontraron producto`);
        }

        return result;
    } catch (error) {
        console.error("Error al obtener los productos", error);
        throw error;
    }finally{
        connect.releaseConnection();
    }
};

//* OBTENER LOS PRODUCTOS CON ESTADO 1
const getProductoActiveService = async()=>{
    const connect = await Connection();
    try {
        const query = `SELECT  * FROM producto p WHERE p.estado = 1;`
        const [result] =  await connect.query(query);

        if(result.length == 0){
            throw new Error(`No se encontraron producto`);
        }

        return result;
    } catch (error) {
        console.error("Error al obtener los productos", error);
        throw error;
    }finally{
        connect.releaseConnection();
    }
}

//* OBTENER PRODUCTO POR ID
const getProductoId = async(id)=>{
    const connect =  await Connection();
    try {
        const query = `SELECT *
            FROM 
                producto p
            WHERE 
                p.id = ?;`
        const [result] = await connect.execute(query,[id]);

        if(result.length==0) return new Error("Error al obtener producto por id");

        return result;
    } catch (error) {
        console.error("Error al obtener producto por id", error);
        throw error;
    }finally{
        connect.releaseConnection();
    }
};

//* CREAR PRODUCTO
const createProduct = async(product)=>{
    const connect = await Connection();
    try {
        // Reemplaza valores `undefined` con `null`
        const values = [
            product.nombre ?? null,
            product.descripcion ?? null,
            product.precio ?? null,
            product.estado ?? null,
        ];

        const query = `INSERT INTO producto (nombre, descripcion, precio, estado) VALUES (?,?,?,?)`;
        const [result] = await connect.execute(query, values);

        if(result.affectedRows == 0) return new Error("Error al crear producto");

        return {status:true, message:"Producto creado correctamente"};
    } catch (error) {
        console.error("Error al crear producto", error);    
    } finally {
        connect.releaseConnection();
    }
};

//* MODIFICAR PRODUCTO
const updateProduct = async(id,producto)=>{
    const connect = await Connection();
    try {
        // Validación de parámetros
        if (id === undefined || id === null) {
            throw new Error('El ID del producto es obligatorio.');
        }
        const query = `UPDATE producto SET nombre = ?, descripcion = ?, estado = ?, precio = ? WHERE id = ?;`;

        const [result] = await connect.execute(query, [
            producto.nombre, producto.descripcion, producto.estado, producto.precio, id]);

        if(result.affectedRows == 0) return new Error("Error al actualizar producto");

        return {status:true, message:"Producto modificado"};
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        throw error; // Opcional: vuelve a lanzar el error para que sea manejado en el nivel superior
    } finally {
        connect.releaseConnection();
    }
};

//* ELIMINAR PRODUCTO
const deleteProduct = async(id)=>{
    const connect = await Connection();
    try {
        const query = `DELETE FROM productos WHERE id = ?`;
        const [result] = await connect.execute(query, [id]);

        return result;
    } finally {
        connect.releaseConnection();
    }
};

//* obtener productos de una lista de precios
const getListaPrecio = async()=>{
    const connect = await Connection();
    try {
        const query = `SELECT lp.idDetalle as idDetalleLista, lp.idLista, lp.idProducto, p.nombre, lp.precioProducto, lp.estado FROM detalleListaPrecio lp
                        LEFT JOIN producto p
                            ON p.id = lp.idProducto
                        ORDER BY lp.idDetalle;`

        const [listaPrecios] = await connect.query(query);

        if(listaPrecios.length == 0) return {status:false, message:"No se encontraron productos en la lista de precios"}

        return {status:true, data:listaPrecios};
    }catch{
        console.error("Error al obtener lista de precios");
        throw new Error("Error al obtener lista de precios");
    }finally {
        connect.releaseConnection();
    } 
};

//* agregar productos a una lista de precios
const addProductsListaPrecio = async(productos)=>{
    const connect = await Connection();
    try {
        console.log("array de productos", productos.length)
        // CONSULTA PARA AGREGAR PRODUCTOS A LA LISTA DE PRECIOS
        const query = `INSERT INTO detalleListaPrecio (idLista, idProducto, precioProducto, estado) VALUES (?, ?, ?, ?);`;

        // ITERACION DE ARRAY DE PRODUCTOS
        for(let i=0; i < productos.length; i++){
            const [result] = await connect.execute(query, [1, productos[i].id, productos[i].precio, 1]);

            if(!result.insertId) return new Error("Error al agregar productos a la lista de precios");
        }

        return {status:true, message:"Productos agregados a la lista de precios"};
    } catch (error) {
        console.error("Error al agregar productos a la lista de precios");
        throw new Error("Error al agregar productos a la lista de precios");
    } finally {
        connect.releaseConnection();
    }
};

//* modificar producto de la lista de precio
const updateProductoListaPrecio = async(idDetalle, producto)=>{
    const connect = await Connection();
    try {
        const query = `UPDATE detalleListaPrecio SET precioProducto = ? WHERE idDetalle = ?;`;
        const [result] = await connect.execute(query, [producto.precioProducto, idDetalle]);

        if(result.affectedRows == 0) return new Error("Error al modificar producto de la lista de precios");

        return {status:true, message:"Producto modificado de la lista de precios"}
    }catch{
        console.error("Error al modificar producto de la lista de precios");
        throw new Error("Error al modificar producto de la lista de precios");
    } finally {
        connect.releaseConnection();
    }
};

//* eliminar producto de la lista de precio
const deleteProductoListaPrecio = async(idDetalle)=>{
    const connect = await Connection();
    try {
        const query = `DELETE FROM detalleListaPrecio WHERE idDetalle = ?`;
        const [result] = await connect.execute(query, [idDetalle]);

        return result;
    }catch{
        console.error("Error al eliminar producto de la lista de precios");
        throw new Error("Error al eliminar producto de la lista de precios");
    } finally {
        connect.releaseConnection();
    }
}

export default {
    getProductos,
    getProductoActiveService,
    getProductoId,
    createProduct,
    updateProduct,
    deleteProduct,
    getListaPrecio,
    updateProductoListaPrecio,
    addProductsListaPrecio,
    deleteProductoListaPrecio
}