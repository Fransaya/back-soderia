import Connection from "../config/db.js";

// obtener todos los roles
export const getRolesService =async()=>{
    const connection = await Connection();
    const [rows] = await connection.query('SELECT * FROM roles');
    return rows;
}