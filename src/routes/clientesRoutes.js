import { Router } from "express";

//? funciones de controlador de cliente
import { 
    getClienteController,
    getClienteActivosController,
    getClienteIdController,
    postClienteController,
    putClienteController,
} from "../controllers/clientesController.js";

const clientesRouter = Router();

// obtener todos los clientes
clientesRouter.get('/',getClienteController);

// obtener los clientes con estado 1
clientesRouter.get('/activos', getClienteActivosController);

// obtener cliente por id
clientesRouter.get('/:id', getClienteIdController);

// crear cliente
clientesRouter.post('/', postClienteController);

// actualizar cliente
clientesRouter.put('/:id', putClienteController);


export default clientesRouter;