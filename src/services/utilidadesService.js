// conexion a la base de datos
import Connection from "../config/db.js";

// obtener los metodos de pago
export const metodosPagosService = async()=>{
    const connect = await Connection();
    try {
        const [rows] = await connect.query("SELECT * FROM metodoPago WHERE estado = ?",[1]);
        return rows;
    }catch(err){
        console.log("Error al obtener metodos de pago", err);
    }finally {
        connect.releaseConnection();
    };
};