import { Router } from "express";

import productoRoute from "./productosRoutes.js";
import ventasRoute from "./ventasRoute.js";
import clientesRouter from "./clientesRoutes.js";
import usuarioRoute from "./usuarioRoutes.js";
import pedidosRoute from "./pedidosRoute.js";

const indexRouter = Router();


//* RUTAS DE PRODUCTOS
indexRouter.use('/producto', productoRoute);

//* RUTA DE VENTAS
indexRouter.use('/venta',ventasRoute);

//* RUTA DE PEDIDOS
indexRouter.use('/pedidos', pedidosRoute);

//* RUTA DE CLIENTES
indexRouter.use('/clientes', clientesRouter);

//* RUTA DE USUARIOS
indexRouter.use('/usuario', usuarioRoute)

//* RUTA DE BARRIOS


export default indexRouter;


























