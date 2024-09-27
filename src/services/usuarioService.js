import Connection from "../config/db.js";
import bcrypt from "bcrypt";
import { ro } from "date-fns/locale";
import { fi } from "date-fns/locale/fi";
import jwt from "jsonwebtoken";


// login user
export const loginService = async (email, password) => {
    const connect = await Connection();
    try {
        // valido si existe el usuario
        const [existUser] = await connect.query('SELECT * FROM usuario WHERE email =  ?', [email]);

        if(existUser.length === 0) return { message: "Usuario no encontrado" };

        // comparto los valores 
        const resultComaprte = await bcrypt.compare(password, existUser[0].password);

        if(!resultComaprte) return { message: "Contraseña incorrecta" };

        // creo el token de sesion
        const token = jwt.sign({ id: existUser[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // guardo la sesion
        await createSesion(token, existUser[0].id, new Date(), 1);

        // devuelvo el token y el id del usuario
        return {token:token, id: existUser[0].id};

    } catch (error) {
        return {status:false, message: error.message};
    }
};

// logout controller
export const logoutService = async (idUsuario) => {
    const connect = await Connection();
    try {
        const query = `DELETE FROM sesiones where idUsuario = ?`;

        const [result] = await connect.query(query,[idUsuario]);

        if(result.affectedRows == 0) return {status:false, message:"Error al cerrar sesion"};

        return {status:true, message:"Deslogue exitoso"};
    } catch (error) {
        throw new Error(error);
    }finally{
        connect.releaseConnection();
    }
};

// guardar sesion
export const createSesion = async(token,  idUsuario, fechaCreacion, estado )=>{
    const connect = await Connection();
    try {
        // valido si el usuario ya tiene una sesion
        const [existSesion] = await connect.query('SELECT * FROM sesiones WHERE idUsuario = ?', [idUsuario]);

        // si el tiene sesion cierro la vieja sesion
        if(existSesion.length > 0){
            await deleteSesion(existSesion[0].idSesion);
        };

        // inserto nueva sesion
        const [session] = await connect.execute(`INSERT INTO sesiones (tokenSesion, idUsuario, fechaCreacion, estado ) 
                        VALUES ( ?, ?, ?, ?)`,[token, idUsuario, fechaCreacion, estado]);

        if(session.affectedRows == 0) return {satus: false, message: "Error al crear sesion" };

        return {status: true, sesion: session.insertId};
    } catch (error) {
        console.error("Error al crear sesion", error)
    } finally {
        connect.releaseConnection();
    }
}

// eliminar sesion
export const deleteSesion = async (idSesion) => {
    const connect = await Connection();
    try {
        const [result] = await connect.query('DELETE FROM sesiones WHERE idSesion = ?', [idSesion]);
        return result.affectedRows;
    } catch (error) {
        throw new Error(error);
    }
};

// create new user 
export const createUserService = async (usuario) => {
    const connect = await Connection();
    try {
        // valido si existe un usuario con ese mail
        const [existUser] = await connect.query('SELECT * FROM usuario WHERE email = ?', [usuario.email]);

        if(existUser.length > 0) return {status: false, message: "El usuario ya existe"};

        // hasheo la clave del usuario
        const hashPassword = await bcrypt.hash(usuario.password, 10);

        // inserto el nuevo usuario
        const [newUser] = await connect.execute(`INSERT INTO usuario (alias, email, telefono, idRol, estado, password)
                        VALUES (?, ?, ? ,?, ?, ?)`, [usuario.alias, usuario.email, usuario.telefono, usuario.idRol, usuario.estado, hashPassword]);

        if(newUser.affectedRows == 0) return {satus: false, message: "Error al crear usuario" };

        return {status: true, usuario: newUser.insertId};
    } catch (error) {
        throw new Error(error);
    }
};

// get all users
export const getAllUsersService = async () => {
    const connect = await Connection();
    try {
        const query = `SELECT u.id as idUser, u.alias, u.email, u.telefono,u.fecha_nacimiento, r.id as idRol, r.nombre 
                        FROM usuario u 
                        LEFT JOIN roles r
                        on u.idRol = r.id
                        where r.estado = 1`;
        const [usuarios] = await connect.query(query);

        return usuarios;
    } catch (error) {
        throw new Error(error);
    }
};

// get all user by id
export const getUserByIdService = async (id) => {
    const connect = await Connection();
    try {
        const query = `SELECT u.id as idUser, u.alias, u.email, u.telefono,u.fecha_nacimiento, r.id as idRol, r.nombre 
                        FROM usuario u 
                        LEFT JOIN roles r
                        on u.idRol = r.id
                        where r.estado = 1 and u.id = ?`;

        const [rows] = await connect.query(query, [id]);
        
        if(rows.length == 0) return {status:false, message:"No se encontro el usuario"};

        return rows;
    } catch (error) {
        throw new Error(error);
    }
};

// update user
export const updateUserService = async (id, usuario) => {
    const connect = await Connection();
    try {
        const result = await connect.query(
            'UPDATE usuario SET alias = ?, email = ?, telefono = ?, idRol = ?, estado = ?, fecha_nacimiento = ? WHERE id = ?',
            [usuario.alias, usuario.email, usuario.telefono, usuario.idRol, usuario.estado, usuario.fecha_nacimiento, id]);


        return result.affectedRows;
    } catch (error) {
        throw new Error(error);
    }
};

// modificar clave del usuario
export const updatePasswordService = async (id, password) => {
    const connect = await Connection();
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        
        const [result] = await connect.query('UPDATE usuario SET password = ? WHERE id = ?', [hashPassword, id]);
        
        return result.affectedRows;
    } catch (error) {
        throw new Error(error);
    }
};  
