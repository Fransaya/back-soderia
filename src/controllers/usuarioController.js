import { loginService, 
    logoutService, 
    createUserService,
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    updatePasswordService
} from "../services/usuarioService.js";


// login
export const loginController = async(req,res)=>{
    const {email, password} = req.body;
    try {
        const result = await loginService(email, password);

        if(result.status == false) return res.status(400).json({message: result.message});

        return res.status(200).json({data: result});
    } catch (error) {
        console.error("Error al iniciar sesion", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
}

// logout 
export const logoutController = async(req, res)=>{
    const {id} = req.params;
    try {
        const result = await logoutService(id);

        if(result.status == false) return res.status(400).json({message: result.message});

        return res.status(200).json({status:true,message:result.message});
    } catch (error) {
        console.error("Error al cerrar sesion", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
}

// create new user
export const createUserController = async(req, res)=>{
    const usuario = req.body;
    try {
        const result = await createUserService(usuario);

        if(result.status == false) return res.status(400).json({message: result.message});

        return res.status(201).json({data: result});
    } catch (error) {
        console.error("Error al crear usuario", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
}

// get all users
export const getAllUsersController = async(req, res)=>{
    try {
        const usuarios = await getAllUsersService()

        return res.status(200).json(usuarios);
    } catch (error) {
        console.error("Error al obtener usuarios", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
}

// get user by id
export const getUserByIdController = async(req, res)=>{
    const { id } = req.params;
    try {
        const usuario = await getUserByIdService(id);

        if(usuario.status == false) return res.status(400).json({message: usuario.message});

        return res.status(200).json(usuario);
    } catch (error) {
        console.error("Error al obtener usuario", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
}

// update user
export const updateUserController = async(req, res)=>{
    const {id} = req.params;
    const usuario = req.body;
    try {
        const result = await updateUserService(id, usuario);

        if(result == 0) return res.status(400).json({message: "Usuario no encontrado"});

        return res.status(200).json({message: "Usuario actualizado correctamente"});
    } catch (error) {
        console.error("Error al actualizar usuario", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
}

// update password user
export const updatePasswordUserController = async(req, res)=>{
    const {id} = req.params;
    const {password} = req.body;
    try {
        const result = await updatePasswordService(id, password);

        if(result == 0) return res.status(400).json({message: "No se actualizo la contraseña"});

        return res.status(200).json({message: "Contraseña actualizada correctamente"});
    } catch (error) {
        console.error("Error al actualizar contraseña", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
}
