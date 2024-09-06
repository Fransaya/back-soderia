
// login
export const loginController = async(req,res)=>{
    try {
        
    } catch (error) {
        console.error("Error al iniciar sesion", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
}

// logout 
export const logoutController = async(req, res)=>{
    try {
        
    } catch (error) {
        console.error("Error al cerrar sesion", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
}

// create new user
export const createUserController = async(req, res)=>{
    try {
        
    } catch (error) {
        console.error("Error al crear usuario", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
}

// get all users
export const getAllUsersController = async(req, res)=>{
    try {
        
    } catch (error) {
        console.error("Error al obtener usuarios", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
}

// get user by id
export const getUserByIdController = async(req, res)=>{
    try {
        
    } catch (error) {
        console.error("Error al obtener usuario", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
}

// update user
export const updateUserController = async(req, res)=>{
    try {
        
    } catch (error) {
        console.error("Error al actualizar usuario", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
}

// update status user
export const updateStatusUserController = async(req, res)=>{
    try {
        
    } catch (error) {
        console.error("Error al actualizar estado usuario", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
}