const facturaService = require('../services/factura.service');

const createFactura = async (req, res) => {
    try {
        await facturaService.createFactura(req.body);

        res.status(200).json({
            msg: 'factura creada correctamente'
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            msg: e.message || 'Internal server error'
        });
    }
};

const getFacturas = async (req, res) => {
    try {
        const data = await facturaService.getFacturas();

        res.status(200).json({
            msg: 'OK',
            data
        });

    } catch (e) {
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

const getFacturaById = async (req, res) => {
    try {
        const data = await facturaService.getFacturaById(req.params.id);

        res.status(200).json({
            msg: 'OK',
            data
        });

    } catch (e) {
        res.status(404).json({
            msg: e.message
        });
    }
};

const deleteFactura = async (req, res) => {
    try {
        await facturaService.deleteFactura(req.params.id);

        res.status(200).json({
            msg: 'factura eliminada'
        });

    } catch (e) {
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

module.exports = {
    createFactura,
    getFacturas,
    getFacturaById,
    deleteFactura
};