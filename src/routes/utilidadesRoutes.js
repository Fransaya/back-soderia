import { metodosPagosController } from "../controllers/utilidadesController.js";

import { Router } from "express";

const utilidadesRouter = Router();

utilidadesRouter.get('/metodos-pago',metodosPagosController);

export default utilidadesRouter;