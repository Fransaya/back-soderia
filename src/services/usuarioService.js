import Connection from "../config/db.js";


// login user
export const loginService = async (email, password) => {
    const connect = await Connection();
    try {
        // valido si existe el usuario
        const [existUser] = await connect.query('SELECT * FROM usuarios WHERE email =  ?', [email]);

        if(existUser.length === 0) return { message: "Usuario no encontrado" };

        // comparto los valores 

    } catch (error) {
        throw new Error(error);
    }
};

// logout controller
export const logoutService = async () => {
    const connect = await Connection();
    try {
        return { message: "Logout exitoso" };
    } catch (error) {
        throw new Error(error);
    }
};

// create new user 
export const createUserService = async (usuario) => {
    const connect = await Connection();
    try {
        const [result] = await connect.query('INSERT INTO usuarios SET ?', usuario);
        return result.insertId;
    } catch (error) {
        throw new Error(error);
    }
};

// get all users
export const getAllUsersService = async () => {
    const connect = await Connection();
    try {
        const [rows] = await connect.query('SELECT * FROM usuarios');
        return rows;
    } catch (error) {
        throw new Error(error);
    }
};

// get all user by id
export const getUserByIdService = async (id) => {
    const connect = await Connection();
    try {
        const [rows] = await connect.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        return rows;
    } catch (error) {
        throw new Error(error);
    }
};

// update user
export const updateUserService = async (id, usuario) => {
    const connect = await Connection();
    try {
        const [result] = await connect.query('UPDATE usuarios SET ? WHERE id = ?', [usuario, id]);
        return result.affectedRows;
    } catch (error) {
        throw new Error(error);
    }
};

// update status user
export const updateStatusUserService = async (id, estado) => {
    const connect = await Connection();
    try {
        const [result] = await connect.query('UPDATE usuarios SET estado = ? WHERE id = ?', [estado, id]);
        return result.affectedRows;
    } catch (error) {
        throw new Error(error);
    }
};