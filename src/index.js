import app from './app.js';
import { configDotenv } from 'dotenv';
//* conexion con base de datos
import Connection from './config/db.js';

configDotenv();

const port = process.env.PORT || 3000;

async function main(){

    await app.listen(port);

    Connection();
    
    console.log("Server online in port", port)
}

main();
