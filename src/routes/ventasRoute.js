import { Router } from "express";
import ventasController from "../controllers/ventasController.js";

const ventasRoute = Router();

// Rutas del controlador
ventasRoute.get('/', ventasController.obtenerTodasLasVentasController); // Nueva ruta para obtener todas las ventas
ventasRoute.post('/', ventasController.registrarVentaController);
ventasRoute.put('/:id', ventasController.actualizarVentaController);

export default ventasRoute;