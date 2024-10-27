import { getRolesService } from "../services/roleService.js";

// obtener todos los roles controllers
export const getRolesControllers = async(req,res)=>{
    try {
        const roles = await getRolesService();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

