import Connection from "../config/db.js";


//* obtener permisos de un rol
export const getModulosRolService = async(idRol)=>{
    const connect = await Connection();
    try {
        const query = `SELECT p.idPermiso, p.idRol as idRol, r.nombre as nombreModulo, p.idModulo as idModulo, m.nombre as nombreModulo, m.pathMenu as rutaModulo,
                            m.estado as estadoModulo, m.icono, m.color, p.estado as estadoPermiso
                        FROM permisos p
                        LEFT JOIN roles r 
                            ON r.id = p.idRol AND r.estado = 1
                        LEFT JOIN modulos m 
                            ON m.idModulo = p.idModulo AND m.estado = 1
                        WHERE p.idRol = ?`;

        const [permisos] = await connect.execute(query, [idRol]);

        if(permisos.length > 0){
            return permisos;
        }else{
            return [];
        };
    } catch (error) {
        console.error("Error al obtener los permisos: ", error);
    } finally {
        connect.releaseConnection();
    };
};

//* obtener los modulos de un usuario por id
export const getModulosUsuariosService = async(idUsusario)=>{
    const connect = await Connection();
    try {
        //* obtengo el rol del usuario
        const queryUser = `SELECT u.id, u.idRol FROM usuario u
                            WHERE u.id = ?;`;

        const [userRol] = await connect.execute(queryUser, [idUsusario]);

        //* OBTENGO los modulos que tiene disponbile el rol de se usuario
        const queryModulos = `SELECT m.pathMenu FROM modulos m
                                    LEFT JOIN permisos p
                                        ON p.idModulo = m.idModulo AND p.estado = 1
                                    WHERE p.idRol = ? AND m.estado = ? AND m.pathMenu != ''
                                GROUP BY m.idModulo;`;

        const [modulosDisponibles] = await connect.execute(queryModulos, [userRol[0].idRol, 1]);

        if(modulosDisponibles.length > 0){
            return modulosDisponibles;
        }else{
            return [];
        };
        return true;
    } catch (error) {
        console.error("Error al obtener los permisos: ", error);
    } finally {
        connect.releaseConnection();
    };
}

//* agregar permisos de un rol a un modulo
export const createNewPermisoService = async(permiso)=>{
    const connect = await Connection();
    try {
        const query = 'INSERT INTO permisos (idRol, idModulo, estado) VALUES (?,?,?)';

        const [nuevoPermiso] = await connect.execute(query, [permiso.idRol, permiso.idModulo, permiso.estado]);

        if(nuevoPermiso.affectedRows > 0){
            return true;
        }else{
            return false;
        };
    } catch (error) {
        console.error("error al crear un nuevo permiso", error);
    } finally {
        connect.releaseConnection();
    }
}

//* modificar permisos de un rol a un modulo
export const updatePermisoService = async(permiso)=>{
    const connect = await Connection();
    try {
        const query = 'UPDATE permisos SET idRol = ?, idModulo = ?, estado = ? WHERE idPermiso = ?';

        const [permisoActualizado] = await connect.execute(query, [permiso.idRol, permiso.idModulo, permiso.estado, permiso.idPermiso]);

        if(permisoActualizado.affectedRows > 0){
            return true;
        }else{
            return false;
        };
    } catch (error) {
        console.error("error al actualizar un permiso", error);
    } finally {
        connect.releaseConnection();
    }
}