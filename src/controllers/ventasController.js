import ventaService from "../services/ventaService.js";

// Obtener todas las ventas
const obtenerTodasLasVentasController = async (req, res) => {
    const { fechaEspecifica, fechaRango, idCliente,idUsuario } = req.query;
    try {
        const result = await ventaService.getVentas({ fechaEspecifica, fechaRango, idCliente,idUsuario });
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ status: false, message: "No se encontraron ventas" });
        }
    } catch (error) {
        console.error("Error al obtener todas las ventas", error);
        res.status(500).json({ status: false, message: "Error interno del servidor" });
    }
};


// Registrar una nueva venta
const registrarVentaController = async (req, res) => {
    const { idCliente, idUsuario, idMetodoPago, estado, fecha, total, observaciones, arrayVenta } = req.body;
    console.log("datos", arrayVenta);
    try {
        const result = await ventaService.registerVenta(idCliente, idUsuario, idMetodoPago, estado, fecha, total, observaciones, arrayVenta);
        if (result.status) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error al registrar la venta", error);
        res.status(500).json({ status: false, message: "Error interno del servidor" });
    }
};

// Actualizar una venta
const actualizarVentaController = async (req, res) => {
    const { id } = req.params;
    const { idCliente, idUsuario, idMetodoPago, estado, fecha, total, observaciones } = req.body;
    try {
        const result = await ventaService.updateVenta(id, idCliente, idUsuario, idMetodoPago, estado, fecha, total, observaciones);
        if (result.status) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error al actualizar la venta", error);
        res.status(500).json({ status: false, message: "Error interno del servidor" });
    }
};


export default {
    obtenerTodasLasVentasController,
    registrarVentaController,
    actualizarVentaController,
}