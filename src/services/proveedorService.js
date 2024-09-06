import Connection from "../config/db.js";


//* OBTENER TODOS LOS PROVEEDORES 
const obtenerAllPoveedores = async()=>{
    const connect = await Connection();

    try{
        const query = `SELECT * FROM proveedores ORDER BY nombre_prov ASC`;
        const [proveedores] = await connect.execute(query);
        return {status:true, proveedores };
    }catch(err){
        console.error("Error al obtener todos los proveedores", err);
        throw err;
    }finally{
        connect.releaseConnection();
    }
}

//* OBTENER REGISTRO DE LOS PROVEEDORES (tabla detalle_proveedor);
const gellAllRegister = async()=>{
    const connect = await Connection();

    try{
        const query = `SELECT * FROM detalle_proveedor ORDER BY nombre ASC`;
        const [registros] = await connect.execute(query);
        return {status:true, registros};
    }catch(err){
        console.error("Error al obtener registro de proveedores", err);
        throw new Error("Error al obtener registro de proveedors",err);
    }finally{
        connect.releaseConnection();
    }
}


//* CREAR NUEVO PROVEEDOR
const createProveedor = async(nombre_proveedor, celular_proveedor, email_proveedor,direccion_prov, monto_pago, deuda_proveedor, metodo_pago, ultima_entrega, estado_deuda, nota_adicional)=>{
    const connect = await Connection();

    try{
        let primerTotalDeuda= deuda_proveedor- monto_pago;
        const query = `
            INSERT INTO proveedores 
                (nombre_prov, celular_prov, email_prov, direccion_prov , monto_pago, deuda_prov, metodo_pago_prov, ultima_entrega, estado_deuda, nota_adicional,total) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
        `;
        const [result] = await connect.execute(query,[nombre_proveedor,celular_proveedor,email_proveedor,"",monto_pago,deuda_proveedor,metodo_pago,ultima_entrega,estado_deuda,nota_adicional, primerTotalDeuda]);

        let id_prov = result.insertId;
        
        await detalle_proveedor(id_prov, nombre_proveedor, monto_pago, deuda_proveedor, metodo_pago, ultima_entrega, estado_deuda, nota_adicional,primerTotalDeuda);
        
        return {status:true, message:"proveedor creado"};
    }catch(err){
        console.log("Error al crear provedor", err);
        throw err;
    }finally{
        connect.releaseConnection();
    }
};

//* MODIFICAR PROVEEDOR 
const updateProveedor = async(id_proveedor,nombre_proveedor, celular_proveedor, email_proveedor, direccion_prov, monto_pago, deuda_proveedor, metodo_pago, ultima_entrega, estado_deuda, nota_adicional, total,deuda_anterior, modificacionDeuda)=>{
    const connect = await Connection();

    try{
     
        let totalDeuda;
        // Validar que las variables sean números válidos.
            deuda_proveedor = isNaN(deuda_proveedor) || deuda_proveedor === null ? 0 : deuda_proveedor;
            total = isNaN(total) || total === null ? 0 : total;
            monto_pago = isNaN(monto_pago) || monto_pago === null ? 0 : monto_pago;

            deuda_proveedor= parseFloat(deuda_proveedor);
            total =  parseFloat(total);
            monto_pago =  parseFloat(monto_pago);
            deuda_anterior = parseFloat(deuda_anterior);
        console.log("--------------------datos recibido----------------------------")
        console.log("deuda prov", deuda_proveedor);
        console.log("total", total);
        console.log("anterior", deuda_anterior);
        console.log("monto pago", monto_pago);
        console.log("---------------------------------------------------");
        
        
        
        
        //1- validamos primero si el modificacion deuda es true
        if(modificacionDeuda){ // si es true, calculo la nueva deuda
            let deudaProvicional=deuda_proveedor;

            //1.2 valido si el total de la deuda esta en 0 (lo que debia)
            if(total !== 0 && total >0 ){
                deuda_proveedor = (deuda_anterior + deuda_proveedor) - monto_pago;

            }else if(total !== 0 && total<0){
                deuda_proveedor =  total + deuda_proveedor;
            }


            totalDeuda = (total + deudaProvicional) - monto_pago;
        }
        //2- validaciones para calcular el total de la deuda
        if(total==0 && modificacionDeuda == false){
            totalDeuda = deuda_proveedor - monto_pago;
        }else if(modificacionDeuda == false){
            if(total<0){ // si el total de la duda que reciba es menor que 0 ( tiene deuda a favor)
                // console.log("entro a deuda negativa")
                totalDeuda = (total + deuda_proveedor) - monto_pago;
            }else{ // si el total es mayor a 0 tiene deuda
                // console.log("entro de duda positiva")
                totalDeuda = total - monto_pago;
            }
        }

        //3- validaciones para modificar el estado de la deuda
        if(totalDeuda == 0){
            estado_deuda = "SALDADA";
        }else if(totalDeuda > 0){
            estado_deuda = "PENDIENTE";
        }else{
            estado_deuda = "A FAVOR";
        }
        // console.log("total", deuda_proveedor - monto_pago)
        const query = `
            UPDATE proveedores 
            SET 
                nombre_prov = ?,
                celular_prov = ?,
                email_prov = ?,
                direccion_prov = ?,
                monto_pago = ?,
                deuda_prov = ?,
                metodo_pago_prov = ?,
                ultima_entrega = ?,
                estado_deuda = ?,
                nota_adicional = ?,
                total = ?
            WHERE id_prov = ?`;

        
        const resultado = await connect.execute(query, [nombre_proveedor, celular_proveedor, email_proveedor, null, monto_pago, deuda_proveedor, metodo_pago, ultima_entrega, estado_deuda, nota_adicional,totalDeuda, id_proveedor]);
        if(resultado.affectedRows == 0 ){
            throw new Error("No se encontro proveedor con esa id");
        }else{
            // const total = totalDeuda - monto_pago;
            await detalle_proveedor(id_proveedor, nombre_proveedor, monto_pago, deuda_proveedor, metodo_pago, ultima_entrega, estado_deuda, nota_adicional,totalDeuda);
        }
        
        return resultado;
    }catch(err){
        console.error("Error al modificar proveedor",err);
        throw err;
    }finally{
        connect.releaseConnection();
    }
};

//* INSERTAR REGISTRO DE PROVEEDOR EN DETALLE_PROVEEDOR
const detalle_proveedor = async (
    id_proveedor, nombre_proveedor, monto_pago, deuda_proveedor, 
    metodo_pago, ultima_entrega, estado_deuda, nota_adicional, total
) => {
    const connect = await Connection();

    // console.log("datos", id_proveedor, nombre_proveedor, monto_pago, deuda_proveedor, metodo_pago, ultima_entrega, estado_deuda, nota_adicional, total);
    try {
        // Asegúrate de que la función Connection() esté definida y funcionando correctamente
        
        const query = `
            INSERT INTO detalle_proveedor (
                id_prov, nombre, monto_pago, deuda_prov, metodo_pago_prov, ultima_entrega, estado_deuda, nota_adicional, total
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?
            );
        `;
        
        // Ejecuta la consulta con los parámetros adecuados
        const [result] = await connect.execute(query, [
            id_proveedor, nombre_proveedor, monto_pago, deuda_proveedor, 
            metodo_pago, ultima_entrega, estado_deuda, nota_adicional, total
        ]);

        // Verifica si la inserción fue exitosa
        if (result.affectedRows === 0) {
            throw new Error("Error al guardar el registro");
        }
        
        return result;
    } catch (err) {
        console.error("Error al insertar registro de proveedor:", err.message);
        throw new Error("Error al insertar registro de proveedor");
    }finally{
        connect.releaseConnection();
    }
}


//* ELIMINAR PROVEEDOR
const delProveedor = async(id_proveedor)=>{
    const connect = await Connection();

    try{
        const query = `
            DELETE FROM proveedores WHERE id_prov = ?;
        `;

        const eliminado = await connect.execute(query,[id_proveedor]);

        if(eliminado.affectedRows == 0 ){
            throw new Error("No se encontro proveedor con esa id");
        };
        
        return eliminado;
    }catch(err){
        console.log("Error al eliminar el proveedor", err);
        throw err;
    }finally{
        connect.releaseConnection();
    }
};

//* ELIMINAR REGISTRO /DETALLE DEL PROVEEDOR
const delDetalleProveedor=async(id_detalle)=>{
    const connect = await Connection();

    try{
        const query = `DELETE FROM detalle_proveedor WHERE id_detalle = ?`;

        const eliminado = await connect.execute(query, [id_detalle]);

        if(eliminado.affectedRows == 0 ){
            throw new Error("No se encontro registro con ese id");
        };

        return eliminado;
    }catch(err){
        console.error("Error al eliminar registro de proveedor", err);
        throw err;
    }finally{
        connect.releaseConnection();
    }
}

//* OBTENER PROVEEDOR POR MONTO PAGADO
const montoPagoProveedor = async(monto_pago)=>{
    const connect = await Connection();

    try{

        const query = `
            SELECT * FROM proveedores WHERE monto_pago = ?`;
        
            const [rows] = await connect.query(query, [monto_pago]);

            const proveedorMontoPago = rows;

        if (montoPagoProveedor.length<=0){
            return {status:false, message: "No hay proveedores pagados por ese monto"}
        }

        return proveedorMontoPago;
    }catch(err){
        console.error("Error al obtener proveedor por el monto pagado",err);
        return err;
    }finally{
        connect.releaseConnection();
    }
};

//* OBTENEMOS PROVEEDORES SEGUN ESTADO DE DEUDA
const estadoDeuda = async(estado_deuda)=>{
    const connect = await Connection();

    try{

        const query = `SELECT * FROM proveedores WHERE estado_deuda = ?`;

        const [proveedoresDeudas] = await connect.query(query,[estado_deuda]);
        if(proveedoresDeudas.length==0){
            return {status:false , message: "No se encontraron con ese estado de deuda"};
        };

        return proveedoresDeudas;

    }catch(err){
        console.error("Error al obtener proveedor segun el estado de la deuda", err);
        throw err;
    }finally{
        connect.releaseConnection();
    }
};

//* OBTENEMOS REGISTRO DE PROVEEDOR SEGUN EL ESTADO DE DEUDA
const estadoDeudaRegistro = async(estado_deuda)=>{
    const connect =  await Connection();

    try{

        const query = `SELECT * FROM detalle_proveedor WHERE estado_deuda = ?`;

        const [proveedoresDeudas] = await connect.query(query,[estado_deuda]);
        if(proveedoresDeudas.length==0){
            return {status:false , message: "No se encontraron con ese estado de deuda"};
        };

        return proveedoresDeudas;

    }catch(err){
        console.error("Error al obtener proveedor segun el estado de la deuda", err);
        throw err;
    }finally{
        connect.releaseConnection();
    }
}

//* OBTIENE PROVEEDORES SEGUN EL METODO DE PAGO UTILIZADO
const proveedorsMetodoPago = async(metodo_pago)=>{
    const connect = await Connection();

    try{

        const query = `SELECT * FROM proveedores WHERE metodo_pago_prov = ?`;

        const [proveedorPorMetodoPago] = await connect.query(query,[metodo_pago]);


        if(proveedorPorMetodoPago.length==0){
            return { status:false, message: "No se encontro proveedor con ese metodo de pago"};
        }

        return proveedorPorMetodoPago;
    }catch(err){
        console.error("Error al obtener proveedor segun el metodo de pago",err);
        throw err;
    }finally{
        connect.releaseConnection();
    }
};

//* OBTENERMOS REGISTRO DE PROVEEDOR SEGUN EL METODO DE PAGO
const registroMetodoPago = async(metodo_pago)=>{
    const connect = await Connection();

    try{

        const query = `SELECT * FROM detalle_proveedor WHERE metodo_pago_prov = ?`;

        const [proveedorPorMetodoPago] = await connect.query(query,[metodo_pago]);


        if(proveedorPorMetodoPago.length==0){
            return { status:false, message: "No se encontro proveedor con ese metodo de pago"};
        }

        return proveedorPorMetodoPago;
    }catch(err){
        console.error("Error al obtener proveedor segun el metodo de pago",err);
        throw err;
    }finally{
        connect.releaseConnection();
    }
}



//* OBTENER DATOS PROVEEDOR POR ID
const proveedorPorId = async (id_proveedor) => {
    const connect = await Connection();

    try {

        const query = `SELECT * FROM proveedores WHERE id_prov = ?`;

        const [proveedorPorId] = await connect.query(query, [id_proveedor]);

        if (proveedorPorId.length === 0) {
            return { status: false, message: "No se encontró proveedor con ese ID" };
        }

        return proveedorPorId; // Devuelve el primer resultado encontrado (debería haber solo uno)
    } catch (err) {
        console.error("Error al obtener proveedor por ID", err);
        throw err;
    }finally{
        connect.releaseConnection();
    }
};

//* OBTENER REGISTRO DE PROVEEDOR POR ID
const registroById = async(id)=>{
    const connect = await Connection();

    try {

        const query = `SELECT * FROM detalle_proveedor WHERE id_prov = ?`;

        const [resultado] = await connect.query(query,[id]);

        if(resultado.length == 0 )return {status:false, message: "No se encontro registro por ese id"};

        return resultado;
    } catch (error) {
        console.error("Error al obtener registro por id", error);
        throw error;
    }finally{
        connect.releaseConnection();
    }
}

const filterEstadoMetodoEntrega = async (metodo_pago, estado, fecha_ultima_entrega) => {
    const connect = await Connection();

    try {
        const query = `SELECT * FROM proveedores WHERE metodo_pago_prov = ? AND ultima_entrega = ? AND estado_deuda = ?`;
        const [result] = await connect.execute(query, [metodo_pago, fecha_ultima_entrega, estado]);

        if (result.length > 0) {
            return { status: true, result }; // Devolver el array de resultados
        }
        return { status: false, data: [] };  // Devolver un array vacío si no hay resultados
    } catch (error) {
        console.error("Error al obtener proveedor filtrado por 3 condiciones:", error);
        throw error; // Lanzar el error para que el controlador pueda manejarlo
    }finally{
        connect.releaseConnection();
    }
};

const filterEstadoMetodoEntregaRegistro = async(metodo_pago,estado, fecha_ultima_entrega)=>{

    const connect = await Connection();

    try {
        const query = `SELECT * FROM detalle_proveedor WHERE metodo_pago_prov = ? AND ultima_entrega = ? AND estado_deuda = ?`;
        const [result] = await connect.execute(query, [metodo_pago, fecha_ultima_entrega, estado]);

        if (result.length > 0) {
            return { status: true, result }; // Devolver el array de resultados
        }
        return { status: false, data: [] }; // Devolver un array vacío si no hay resultados
    } catch (error) {
        console.error("Error al obtener proveedor filtrado por 3 condiciones:", error);
        throw error; // Lanzar el error para que el controlador pueda manejarlo
    }finally{
        connect.releaseConnection();
    }
}



export default {
    obtenerAllPoveedores,
    createProveedor,
    updateProveedor,
    delProveedor,
    delDetalleProveedor,
    montoPagoProveedor,
    estadoDeuda,
    proveedorsMetodoPago,
    proveedorPorId,
    registroById,
    filterEstadoMetodoEntrega,
    gellAllRegister,
    estadoDeudaRegistro,
    registroMetodoPago,
    filterEstadoMetodoEntregaRegistro
}

