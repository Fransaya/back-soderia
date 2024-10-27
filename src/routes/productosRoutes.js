import { Router } from "express";

import productoController from "../controllers/productoController.js";

const productoRouter = Router();

//* obtener todos los productos
productoRouter.get('/allProduct', productoController.allProductos);

//* obtener producto por codigo
productoRouter.get('/activo', productoController.getProductosActive);

//* obtener producto por id
productoRouter.get('/id/:id', productoController.productById);

//* crear nuevo producto
productoRouter.post('/registrar', productoController.createNewProduct);

//* actualizar producto
productoRouter.put('/actualizar/:id', productoController.updateProducto);

//* eliminar producto
productoRouter.delete('/:id', productoController.deleteProducto);

//* obtener lista de precios
productoRouter.get('/lista-precios', productoController.listaPrecios);

//* agregar productos a lista de precios
productoRouter.post('/lista-precios', productoController.addProuctoListaPrecioController);

//* actualizar producto de la lista de precio
productoRouter.put('/lista-precios/:idDetalle', productoController.updateProductoListaPrecioController);

//* eliminar productos de una lista de precios
productoRouter.delete('/lista-precios/:idDetalle', productoController.deleteProductoListaPrecioController);

export default productoRouter;