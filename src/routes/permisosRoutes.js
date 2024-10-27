import { Router } from "express";


// funciones del controllador
import { 
    getModulosRolController,
    getPermisosUserController,
    createNewPermisoController,
    updatePermisoController
} from "../controllers/permisosController.js";

const permisosRouter = Router();

// obtener todos los permisos de un rol
permisosRouter.get('/:id', getModulosRolController);

// obtener los permisos de un usuario
permisosRouter.get('/user/:id', getPermisosUserController);

// crear un nuevo permiso
permisosRouter.post('/', createNewPermisoController);

// modificar permisos de un rol
permisosRouter.put('/:id', updatePermisoController);

export default permisosRouter;

