import { Router } from "express";

import productoRoute from "./productosRoutes.js";
import ventasRoute from "./ventasRoute.js";
import clientesRouter from "./clientesRoutes.js";
import usuarioRoute from "./usuarioRoutes.js";
import pedidosRoute from "./pedidosRoute.js";
import barriosRouter from "./barriosRoutes.js";
import rolesRoutes from "./rolesRoutes.js";
import permisosRouter from "./permisosRoutes.js";
import utilidadesRouter from "./utilidadesRoutes.js";

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
indexRouter.use('/usuario', usuarioRoute);

//* RUTA DE ROLES
indexRouter.use('/roles', rolesRoutes);

//* RUTA DE BARRIOS
indexRouter.use('/barrios', barriosRouter);

//* RUTA PARA PERMISOS Y ROLES
indexRouter.use('/permisos', permisosRouter);

//* OBTENER METODOS DE PAGO
indexRouter.use('/utilidades',utilidadesRouter);



export default indexRouter;


























