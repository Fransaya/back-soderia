import Connection from "../config/db.js";

export const getBarriosService = async()=>{
    const connect = await Connection();
    try {
        const [rows] = await connect.query('SELECT * FROM barrio');
        return rows;
    } catch (error) {
        console.log(error);        
    } finally {
        connect.releaseConnection();
    }
}