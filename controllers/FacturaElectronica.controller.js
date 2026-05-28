const FacturaService = require('../services/FacturaElectronica.service');

const crearFactura = async (req, res) => {
    try {
        const factura = await FacturaService.crearFactura(req.body);
        res.status(200).json({ msg: 'Factura creada correctamente', data: factura });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: e.message || 'Error interno del servidor' });
    }
};

const getFacturas = async (req, res) => {
    try {
        const data = await FacturaService.getFacturas();
        res.status(200).json({ msg: 'OK', data });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

module.exports = { crearFactura, getFacturas };