import { Router } from "express";

import proveedorRoute from "./proveedorRoutes.js";
import productoRoute from "./productosRoutes.js";
import ventasRoute from "./ventasRoute.js";
import clientesRouter from "./clientesRoutes.js";


const indexRouter = Router();


//* RUTAS DE PRODUCTOS
indexRouter.use('/producto', productoRoute);

//* RUTA DE VENTAS
indexRouter.use('/venta',ventasRoute);

//* RUTA DE CLIENTES
indexRouter.use('/clientes', clientesRouter);

//* RUTA DE USUARIOS
indexRouter.use('/usuario')

export default indexRouter;


























