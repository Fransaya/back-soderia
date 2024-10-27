import { Router } from "express";

//* FUNCIONES DEL CONTROLLADOR
import { getBarriosController } from "../controllers/barriosController.js";

const barriosRouter = Router();

//* OBTENER TODAS LAS LOCAIDADES
barriosRouter.get('/', getBarriosController);

export default barriosRouter;