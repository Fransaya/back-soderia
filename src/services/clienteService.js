import Connection from "../config/db.js";

// obtener todos los clientes
export const getAllClientService = async () => {
    const connect = await Connection();
    try {
        const query = `SELECT c.*, 
                        t.tipo AS tipoClienteDescripcion, 
                        l.nombre AS localidadNombre,
                        CASE 
                            WHEN c.estado = 1 THEN 'Activo'
                            WHEN c.estado = 0 THEN 'Inactivo'
                            ELSE 'Desconocido'
                        END AS estadoDescripcion
                    FROM clientes c
                    LEFT JOIN tipoCliente t 
                        ON c.tipoCliente = t.idTipoCliente
                    LEFT JOIN localidad l
                        ON c.idLocalidad = l.idLocalidad;`
        const [cliente] = await connect.execute(query);

        if(cliente.length === 0) return {status:false ,message: "No se encontraron clientes" }

        return cliente;
    } catch (error) {
        return  {status:false, message:"Error al obtener clientes"};
    }finally{
        connect.releaseConnection();
    }
};

// obtener cliente por id
export const getClientByIdService = async(id) => {
    const connect = await Connection();
    try {
        const query = `SELECT c.*, 
                        t.tipo AS tipoClienteDescripcion, 
                        l.nombre AS localidadNombre,
                        CASE 
                            WHEN c.estado = 1 THEN 'Activo'
                            WHEN c.estado = 0 THEN 'Inactivo'
                            ELSE 'Desconocido'
                        END AS estadoDescripcion
                    FROM clientes c
                    LEFT JOIN tipoCliente t 
                        ON c.tipoCliente = t.idTipoCliente
                    LEFT JOIN localidad l
                        ON c.idLocalidad = l.idLocalidad
                    WHERE c.idCliente = ?;`
        
        const [cliente] = await connect.execute(query, [id]);

        if(cliente.length === 0) return {status:false, message: "No se encontraron clientes" };

        return cliente;
    } catch (error) {
        return {status:false, message:"Error al obtener cliente por id"}
    }finally{
        connect.releaseConnection();
    }
};

// obtener cliente por tipo de cliente
export const getClientTypeService = async(tipo) => {
    const connect = await Connection();
    try {
        const query = `SELECT c.*, 
                        t.tipo AS tipoClienteDescripcion, 
                        l.nombre AS localidadNombre,
                        CASE 
                            WHEN c.estado = 1 THEN 'Activo'
                            WHEN c.estado = 0 THEN 'Inactivo'
                            ELSE 'Desconocido'
                        END AS estadoDescripcion
                    FROM clientes c
                    LEFT JOIN tipoCliente t 
                        ON c.tipoCliente = t.idTipoCliente
                    LEFT JOIN localidad l
                        ON c.idLocalidad = l.idLocalidad
                    WHERE t.idTipoCliente = ?;`;

        const [clientes] =  await connect.execute(query, [tipo]);

        if(clientes.length === 0) return {status:false, message: "No se encontraron clientes" };

        return clientes;
    } catch (error) {
    }finally{
        connect.releaseConnection();
    }
};

// crear cliente
export const createClientService = async(cliente) => {
    const connect = await Connection();
    try {
        console.log("cliente recibido", cliente)
        // valido primero si existe un cliente por ese cuit o dni
        const existCliente = `SELECT * FROM clientes where (cuit = ? OR dni = ?)`;

        const [existClient] = await connect.execute(existCliente, [cliente.cuit, cliente.dni]);
        // si existe devuelvo mensaje que ya existe
        if(existClient.length > 0) return {status:false, message: "El cliente ya existe" };

         // Prepara los valores, reemplaza undefined por null
        const values = [
            cliente.nombre ?? null,
            cliente.celular ?? null,
            cliente.telefono ?? null,
            cliente.cuit ?? null,
            cliente.dni ?? null,
            cliente.direccion ?? null,
            cliente.codigoPostal ?? null,
            cliente.idLocalidad ?? null,
            cliente.tipoCliente ?? null,
            cliente.estado ?? null
        ];
        
        // Inserta un nuevo cliente
        const query = `INSERT INTO clientes (nombre, celular, telefono, cuit, dni, direccion, codigoPostal, idLocalidad, tipoCliente, estado)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
                            WHERE (cuit = ? OR dni = ?) 
                            AND idCliente != ?;`

        const [clienteExiste] = await connect.execute(quertExist, [cliente.cuit, cliente.dni, id]);

        if(clienteExiste.length > 0) return {status:false, message: "Ya existe un cliente registrado con esos datos"};

         // Prepara los valores, reemplaza undefined por null
        const values = [
            cliente.nombre ?? null,
            cliente.celular ?? null,
            cliente.telefono ?? null,
            cliente.cuit ?? null,
            cliente.dni ?? null,
            cliente.direccion ?? null,
            cliente.codigoPostal ?? null,
            cliente.idLocalidad ?? null,
            cliente.tipoCliente ?? null,
            cliente.estado ?? null,
            id 
        ];

        // actualizo los datos del cliente
        const query = `UPDATE clientes
                        SET nombre = ?, celular = ?, telefono = ?, cuit = ?, dni = ?, direccion = ?, codigoPostal = ?, idLocalidad = ?, tipoCliente = ?, estado = ?
                        WHERE idCliente = ?;`;

        const [clienteActualizado] = await connect.execute(query, values);

        if(clienteActualizado.affectedRows == 0) return {status:false, message:"Error al actualizar cliente"};

        return {status:true, message:"Cliente actualizado correctamente"};
    } catch (error) {
        
    } finally {
        connect.releaseConnection()
    }
};

// modificar estado del cliente
export const updateStatusClientService = async(id, estado)=>{
    const connect = await Connection();
    try {
        const query = `UPDATE clientes
                        SET estado = ?
                        WHERE idCliente = ?;`;
        
        const [clienteActualizado] = await connect.execute(query, [estado, id]);

        if(clienteActualizado.affectedRows == 0) return {status:false, message:"Error al actualizar estado del cliente"};
        
        return {status:true, message:"Estado del cliente actualizado correctamente"};
    } catch (error) {

    } finally {
        connect.releaseConnection()
    }
};  
