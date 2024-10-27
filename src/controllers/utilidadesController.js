import { metodosPagosService } from "../services/utilidadesService.js";

export const metodosPagosController = async(req,res)=>{
    try {
        const response = await metodosPagosService();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({error:`Error al obtener los metodos de pago ${error}`});
    };
};
