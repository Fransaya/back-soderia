//* FUNCIONES DEL SERVICIO
import { getBarriosService } from "../services/barriosService.js";

export const getBarriosController = async (req, res) => {
    try {
        const localidades = await getBarriosService();
        res.status(200).json(localidades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};