const ProveedorMockDian = require('./ProveedorMockDian.service');
const ProveedorDianReal = require('./ProveedorDianReal.service');

function getProveedorFacturacion() {
    const proveedor = process.env.DIAN_PROVEEDOR || 'mock';
    return proveedor === 'real'
        ? new ProveedorDianReal()
        : new ProveedorMockDian();
}

module.exports = { getProveedorFacturacion };