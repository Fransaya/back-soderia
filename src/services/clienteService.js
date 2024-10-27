import Connection from "../config/db.js";

// obtener todos los clientes
export const getAllClientService = async () => {
    const connect = await Connection();
    try {
        const query = `SELECT c.id, c.nombre, c.email, c.telefono, c.direccion, b.idBarrio, b.nombre as barrio_nombre, c.estado, c.observaciones
                        FROM clientes c
                        LEFT JOIN  barrio b 
                            ON c.idBarrio = b.idBarrio
                        ORDER BY c.id;`;

        const [cliente] = await connect.execute(query);

        if(cliente.length === 0) return {status:false ,message: "No se encontraron clientes" }

        return cliente;
    } catch (error) {
        return  {status:false, message:"Error al obtener clientes"};
    }finally{
        connect.releaseConnection();
    }
};

// obtener clientes activos
export const getClientsActiveService = async()=>{
    const connect = await Connection();
    try {
        const query = `SELECT
                    c.id,
                    c.nombre,
                    c.email,
                    c.telefono,
                    c.direccion,
                    b.idBarrio,
                    b.nombre AS barrio_nombre,
                    c.estado,
                    c.observaciones
                FROM
                    clientes c
                LEFT JOIN
                    barrio b ON c.idBarrio = b.idBarrio
                WHERE
                    c.estado = 1;`;

        const [clientes] = await connect.execute(query);

        if(clientes.length === 0) return {status:false, message: "No se encontraron clientes" };

        return clientes
    } catch (error) {
        console.error("Error al obtener clientes activos", error)   
        throw new Error("Error al obtener clientes activos");
    } finally {
        connect.releaseConnection();
    }
}

// obtener cliente por id
export const getClientByIdService = async(id) => {
    const connect = await Connection();
    try {
        const query = `SELECT 
                    c.id, 
                    c.nombre, 
                    c.email, 
                    c.telefono, 
                    c.direccion, 
                    b.idBarrio, 
                    b.nombre AS barrio_nombre, 
                    c.estado, 
                    c.observaciones
                FROM 
                    clientes c
                LEFT JOIN 
                    barrio b ON c.idBarrio = b.idBarrio
                WHERE 
                    c.id = ?;`
        
        const [cliente] = await connect.execute(query, [id]);

        if(cliente.length === 0) return {status:false, message: "No se encontraron clientes" };

        return cliente;
    } catch (error) {
        return {status:false, message:"Error al obtener cliente por id"}
    }finally{
        connect.releaseConnection();
    }
};

// crear cliente
export const createClientService = async(cliente) => {
    const connect = await Connection();
    try {
        // valido primero si existe un cliente por ese cuit o dni
        const existCliente = `SELECT * FROM clientes where (email = ?)`;

        const [existClient] = await connect.execute(existCliente, [cliente.email]);
        // si existe devuelvo mensaje que ya existe
        if(existClient.length > 0) return {status:false, message: "El cliente ya existe" };

         // Prepara los valores, reemplaza undefined por null
        const values = [
            cliente.nombre ?? null,
            cliente.email ?? null,
            cliente.telefono ?? null,
            cliente.direccion ?? null,
            cliente.idBarrio ?? null,
            cliente.estado ?? null
        ];
        
        // Inserta un nuevo cliente
        const query = `INSERT INTO clientes (nombre, email, telefono, direccion, idBarrio, estado)
                        VALUES (?, ?, ?, ?, ?, ?)`;
        const [clienteNuevo] = await connect.execute(query, values);
        if(clienteNuevo.affectedRows == 0) return {status:false, message:"Error al guardar cliente"};

        return {status:true, message:"Cliente guardado correctamente"};
    } catch (error) {
        console.error("Error alc rear cliente", error)
        return {status:false, message:"Error al guardar cliente", error: error.message}
    }finally{
        connect.releaseConnection();
    }
};

// modificar datos cliente
export const updateClientService = async(id, cliente)=>{
    const connect = await Connection();
    try {
        // valido si existe un cliente distinto al mio pero con el cuit o dni 
        const quertExist = `SELECT * 
                            FROM clientes 
                            WHERE (email = ?) 
                            AND id != ?;`

        const [clienteExiste] = await connect.execute(quertExist, [cliente.email, id]);

        if(clienteExiste.length > 0) return {status:false, message: "Ya existe un cliente registrado con esos datos"};

         // Prepara los valores, reemplaza undefined por null
        const values = [
            cliente.nombre ?? null,
            cliente.email ?? null,
            cliente.telefono ?? null,
            cliente.direccion ?? null,
            cliente.idBarrio ?? null,
            cliente.estado ?? null,
            id 
        ];

        // actualizo los datos del cliente
        const query = `UPDATE clientes
                        SET nombre = ?, email = ?, telefono = ?, direccion = ?, idBarrio = ?, estado = ?
                        WHERE id = ?;`;

        const [clienteActualizado] = await connect.execute(query, values);

        if(clienteActualizado.affectedRows == 0) return {status:false, message:"Error al actualizar cliente"};

        return {status:true, message:"Cliente actualizado correctamente"};
    } catch (error) {
        
    } finally {
        connect.releaseConnection()
    }
};


