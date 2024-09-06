import { createConnection } from "mysql2";
import { configDotenv } from "dotenv";
import mysql from 'mysql2/promise';
import { createPool } from "mysql2/promise";

configDotenv();

const connect = createPool({
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    database:process.env.DB_DATABASE,
    user:process.env.DB_USER,
    password:process.env.DB_PASSS,
});

const Connection = async()=>{
    try{
        // console.log("DataBase connected en", process.env.DB_HOST);
        return connect;
    }catch(err){
        console.error("Error al conectar base de datos");
    }
};

export default Connection;