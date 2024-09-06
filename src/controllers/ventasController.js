import ventaService from "../services/ventaService.js";

// Obtener todas las ventas
const obtenerTodasLasVentasController = async (req, res) => {
    try {
        const result = await ventaService.getVentas();
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

// Obtener una venta por ID
const obtenerVentaPorIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await ventaService.getVentaId(id);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ status: false, message: "Venta no encontrada" });
        }
    } catch (error) {
        console.error("Error al obtener la venta", error);
        res.status(500).json({ status: false, message: "Error interno del servidor" });
    }
};

// Obtener ventas por fecha
const obtenerVentasPorFechaController = async (req, res) => {
    const { fecha } = req.params;
    try {
        const result = await ventaService.getVentaFecha(fecha);
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ status: false, message: "No se encontraron ventas para la fecha proporcionada" });
        }
    } catch (error) {
        console.error("Error al obtener ventas por fecha", error);
        res.status(500).json({ status: false, message: "Error interno del servidor" });
    }
};

// Registrar una nueva venta
const registrarVentaController = async (req, res) => {
    const { fecha_venta, total_venta, cliente, metodo_pago, nota_adicional, tipo_venta, arrayVenta } = req.body;
    console.log("datos", arrayVenta);
    try {
        const result = await ventaService.registerVenta(fecha_venta, total_venta, cliente, metodo_pago, nota_adicional, tipo_venta, arrayVenta);
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
    const { fecha_venta, total_venta, cliente, metodo_pago, nota_adicional, tipo_venta, arrayVenta } = req.body;
    try {
        const result = await ventaService.updateVenta(id, fecha_venta, total_venta, cliente, metodo_pago, nota_adicional, tipo_venta, arrayVenta);
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

// Eliminar una venta
const eliminarVentaController = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await ventaService.eliminarVenta(id);
        if (result.status) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error("Error al eliminar la venta", error);
        res.status(500).json({ status: false, message: "Error interno del servidor" });
    }
};

export default {
    obtenerTodasLasVentasController,
    obtenerVentaPorIdController,
    obtenerVentasPorFechaController,
    registrarVentaController,
    actualizarVentaController,
    eliminarVentaController
}