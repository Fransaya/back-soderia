import { Router } from "express";

import productoController from "../controllers/productoController.js";

const productoRouter = Router();

//* obtener todos los productos
productoRouter.get('/allProduct', productoController.allProductos);

//* obtener producto por codigo
productoRouter.get('/codigo/:codigo', productoController.productByCodigo);

//* obtener producto por id
productoRouter.get('/id/:id', productoController.productById);

//* crear nuevo producto
productoRouter.post('/registrar', productoController.createNewProduct);

//* actualizar producto
productoRouter.put('/actualizar/:id', productoController.updateProducto);

//* eliminar producto
productoRouter.delete('/:id', productoController.deleteProducto);

export default productoRouter;