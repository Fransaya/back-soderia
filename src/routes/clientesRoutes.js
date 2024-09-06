import { Router } from "express";

//? funciones de controlador de cliente
import { 
    getClienteController,
    getClienteIdController,
    getClienteTipoController,
    postClienteController,
    putClienteController,
    putClienteEstadoController,
} from "../controllers/clientesController.js";

const clientesRouter = Router();

// obtener todos los clientes
clientesRouter.get('/',getClienteController);

// obtener cliente por id
clientesRouter.get('/:id', getClienteIdController);

// obtener clientes por tipos de cliente
clientesRouter.get('/tipo/:tipo', getClienteTipoController);

// crear cliente
clientesRouter.post('/', postClienteController);

// actualizar cliente
clientesRouter.put('/:id', putClienteController);

// actualizar estado cliente
clientesRouter.put('/estado/:id/:estado', putClienteEstadoController);

export default clientesRouter;