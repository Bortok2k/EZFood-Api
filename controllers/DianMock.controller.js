const ProveedorMockDian = require('../services/facturacion/ProveedorMockDian.service');

const validar = async (req, res) => {
    try {
        const proveedor = new ProveedorMockDian();
        const resultado = await proveedor.enviar(req.body);
        res.status(200).json(resultado);
    } catch (e) {
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

module.exports = { validar };