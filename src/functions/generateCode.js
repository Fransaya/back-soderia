import Connection from "../config/db.js";

const randomCodeProduct = async(codigo)=>{

    try{
        // obtenemos el codigo del producto recibido
        const codeProduct = codigo;

        if(codeProduct == 0) { // si el codigo es igual a 0, hay que generar un codigo aleatorio

            // genero numero aleatorio entre 100mily 999mil, ( codigo de producto )
            const randonCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

            const resultCode = await existCode(randonCode);

            return resultCode;
        }else{ // sino se devuelve el codigo que ellos ingresaron
            const resultCode = await existCode(codeProduct);

            return resultCode;
        }
    }catch(err){
        console.error("Succedio un error al generar el codigo de un producto", err);
    }
};


const existCode = async(codigo)=>{

    const connect = await Connection();
    try {
        // ejecuto consulta para ver si este codigo ya existe
        const query = `SELECT codigo FROM productos WHERE codigo = ?`;

        // ejecuto consulta para verificar si existe el codigo;
        const [result] = await connect.query(query, codigo);

        if(result.length>0){
            // el codigo ya existe
            randomCodeProduct(codigo); // vuelv a llamar a la funcion hasta que genere un codigo que no exista
        }else{
            // el codigo no existe
            return codigo;
        }
    } catch (error) {
        console.error("Error al consultar si el codigo existe", error)
    }finally{
        connect.releaseConnection();
    }
};

export { randomCodeProduct }