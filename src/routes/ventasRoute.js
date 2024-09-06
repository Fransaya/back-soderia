import { Router } from "express";
import ventasController from "../controllers/ventasController.js";

const ventasRoute = Router();

// Rutas del controlador
ventasRoute.get('/', ventasController.obtenerTodasLasVentasController); // Nueva ruta para obtener todas las ventas
ventasRoute.get('/:id', ventasController.obtenerVentaPorIdController);
ventasRoute.get('/fecha/:fecha', ventasController.obtenerVentasPorFechaController);
ventasRoute.post('/', ventasController.registrarVentaController);
ventasRoute.put('/:id', ventasController.actualizarVentaController);
ventasRoute.delete('/:id', ventasController.eliminarVentaController);

export default ventasRoute;