import { 
    getModulosRolService,
    getModulosUsuariosService,
    createNewPermisoService,
    updatePermisoService
} from "../services/permisoService.js";

// obtener los permisos de un rol
export const getModulosRolController = async (req, res) => {
    const { id } = req.params;
    try {
        const permisos = await getModulosRolService(id);
        res.status(200).json(permisos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// obtener los permisos de un usuario
export const getPermisosUserController = async(req,res)=>{
    const { id } = req.params;
    try {
        const permisos = await getModulosUsuariosService(id);

        res.status(200).json(permisos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// crear un nuevo permiso
export const createNewPermisoController = async (req, res) => {
    const { idRol, idModulo, estado } = req.body;
    try {
        const permiso = { idRol, idModulo, estado };
        const nuevoPermiso = await createNewPermisoService(permiso);
        if (nuevoPermiso) {
            res.status(201).json({ message: "Permiso creado correctamente" });
        } else {
            res.status(400).json({ message: "Error al crear el permiso" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// modificar permisos de un rol
export const updatePermisoController = async (req, res) => {
    const { idPermiso, idRol, idModulo, estado } = req.body;
    try {
        const permiso = { idPermiso, idRol, idModulo, estado };
        const permisoActualizado = await updatePermisoService(permiso);
        if (permisoActualizado) {
            res.status(200).json({ message: "Permiso actualizado correctamente" });
        } else {
            res.status(400).json({ message: "Error al actualizar el permiso" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

