import Connection from "../config/db.js";
import { randomCodeProduct } from "../functions/generateCode.js";

//* OBTENER TODOS LOS PRODUCTOS
const getProductos = async()=>{
    const connect = await Connection();
    try {
        const query = `SELECT 
                p.id AS producto_id,
                p.nombre,
                p.descripcion,
                p.codigo,
                p.precioMinorista,
                p.precioMayorista,
                p.costo,
                p.tipo,
                p.fecha_registro,
                p.stock_total,
                p.xs,
                p.s,
                p.m,
                p.l,
                p.xl,
                p.xxl,
                p.xxxl,
                p.a6xl,
                p.a7xl,
                p.a8xl,
                p.a9xl,
                p.a10xl,
                p.n4,
                p.n5,
                p.n6,
                p.n7,
                p.n8,
                p.n9,
                p.n10,
                p.n11,
                p.n12,
                p.n13,
                p.n14,
                p.notaAdicional
            FROM 
                productos p;`
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

//* OBTENER PRODUCTO POR CODIGO
const getProductoCodigo = async (codigo) => {
    const connect = await Connection();
    try {
        
        const query = `
            SELECT 
                p.id AS producto_id,
                p.nombre,
                p.descripcion,
                p.codigo,
                p.precioMinorista,
                p.precioMayorista,
                p.costo,
                p.tipo,
                p.fecha_registro,
                p.stock_total,
                p.xs,
                p.s,
                p.m,
                p.l,
                p.xl,
                p.xxl,
                p.xxxl,
                p.a6xl,
                p.a7xl,
                p.a8xl,
                p.a9xl,
                p.a10xl,
                p.n4,
                p.n5,
                p.n6,
                p.n7,
                p.n8,
                p.n9,
                p.n10,
                p.n11,
                p.n12,
                p.n13,
                p.n14,
                p.notaAdicional
            FROM 
                productos p
            WHERE 
                p.codigo = ?;`;
        const [result] = await connect.execute(query, [codigo]);

        if (result.length === 0) {
            throw new Error(`No se encontró el producto con el código: ${codigo}`);
        }

        return result;
    } catch (error) {
        console.error("Error al obtener producto por código:", error);
        throw error; 
    }finally{
        connect.releaseConnection();
    }
};



//* OBTENER PRODUCTO POR ID
const getProductoId = async(id)=>{
    const connect =  await Connection();
    try {
        const query = `SELECT 
                p.id AS producto_id,
                p.nombre,
                p.descripcion,
                p.codigo,
                p.precioMinorista,
                p.precioMayorista,
                p.costo,
                p.tipo,
                p.fecha_registro,
                p.stock_total,
                p.xs,
                p.s,
                p.m,
                p.l,
                p.xl,
                p.xxl,
                p.xxxl,
                p.a6xl,
                p.a7xl,
                p.a8xl,
                p.a9xl,
                p.a10xl,
                p.n4,
                p.n5,
                p.n6,
                p.n7,
                p.n8,
                p.n9,
                p.n10,
                p.n11,
                p.n12,
                p.n13,
                p.n14,
                p.notaAdicional
            FROM 
                productos p
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
    
    const validCode = await randomCodeProduct(product.codigo);

    // Reemplaza valores `undefined` con `null`
    const values = [
        product.nombre ?? null,
        product.descripcion ?? null,
        product.codigo = validCode,
        product.precioMinorista ?? null,
        product.precioMayorista ?? null,
        product.costo ?? null,
        product.tipo ?? null,
        product.fecha_registro ?? null,
        product.stock_total ?? 0,
        product.xs ?? 0,
        product.s ?? 0,
        product.m ?? 0,
        product.l ?? 0,
        product.xl ?? 0,
        product.xxl ?? 0,
        product.xxxl ?? 0,
        product.a6xl ?? 0,
        product.a7xl ?? 0,
        product.a8xl ?? 0,
        product.a9xl ?? 0,
        product.a10xl ?? 0,
        product.n4 ?? 0,
        product.n5 ?? 0,
        product.n6 ?? 0,
        product.n7 ?? 0,
        product.n8 ?? 0,
        product.n9 ?? 0,
        product.n10 ?? 0,
        product.n11 ?? 0,
        product.n12 ?? 0,
        product.n13 ?? 0,
        product.n14 ?? 0,
        product.notaAdicional ?? null
    ];
    try{
        const query = `INSERT INTO productos 
                (nombre, descripcion, codigo, precioMinorista, precioMayorista, costo, tipo, fecha_registro, stock_total, xs, s, m, l, xl, xxl, xxxl, a6xl, a7xl, a8xl, a9xl, a10xl, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13, n14, notaAdicional)
            VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        const [result] = await connect.execute(query, values);

        return result;
    }finally{
        connect.releaseConnection();
    }
};

//* MODIFICAR PRODUCTO
const updateProduct = async(id,nombre,descripcion,codigo,precioMinorista,precioMayorista,costo,tipo,fecha_registro,stock_total,xs,s,m,l,xl,xxl,xxxl,a6, a7, a8, a9, a10, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13, n14,notaAdicional)=>{
    const connect = await Connection();
    try {
        // Validación de parámetros
        if (id === undefined || id === null) {
            throw new Error('El ID del producto es obligatorio.');
        }
        const query = `UPDATE productos 
            SET nombre = ?, descripcion = ?, codigo = ?, precioMinorista = ?, precioMayorista = ?, costo = ?, tipo = ?, fecha_registro = ?, stock_total = ?, xs = ?, s = ?, m = ?, l = ?, xl = ?, xxl = ?, xxxl = ?, a6xl = ?, a7xl = ?, a8xl = ?, a9xl = ?, a10xl = ?, n4 = ?, n5 = ?, n6 = ?, n7 = ?, n8 = ?, n9 = ?, n10 = ?, n11 = ?, n12 = ?, n13 = ?, n14 = ?, notaAdicional = ? 
            WHERE id = ?`;

        const [result] = await connect.execute(query, [
            nombre, descripcion, codigo, precioMinorista, precioMayorista, costo, tipo, 
            fecha_registro, stock_total, xs, s, m, l, xl, xxl, xxxl, a6, a7, a8, a9, a10, 
            n4, n5, n6, n7, n8, n9, n10, n11, n12, n13, n14, notaAdicional, id
        ]);

        return result;
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

export default {
    getProductos,
    getProductoCodigo,
    getProductoId,
    createProduct,
    updateProduct,
    deleteProduct
}