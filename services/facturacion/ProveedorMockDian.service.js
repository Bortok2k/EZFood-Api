const ProveedorFacturacion = require('./ProveedorFacturacion.service');
const { calcularCufe } = require('../../helpers/cufe');

class ProveedorMockDian extends ProveedorFacturacion {
    async enviar(factura) {
        const {
            numeroFactura, fecha, hora,
            subtotal, impuesto, total,
            nitEmisor, documentoAdquirente
        } = factura;

        // Simula latencia real del webservice
        await new Promise(r => setTimeout(r, 300));

        const cufe = calcularCufe({
            numeroFactura,
            fecha,
            hora,
            valorFactura: subtotal,
            valorImpuesto: impuesto,
            valorTotal: total,
            nitEmisor,
            documentoAdquirente,
            claveTecnica: process.env.DIAN_CLAVE_TECNICA || 'clave-tecnica-mock',
            tipoAmbiente: '2' // habilitación/pruebas
        });

        // Reglas mínimas de "rechazo" simuladas, igual que validaría el WS real
        const mensajes = [];
        if (!nitEmisor) mensajes.push('NIT del emisor requerido');
        if (total <= 0) mensajes.push('El total de la factura debe ser mayor a cero');

        const estado = mensajes.length === 0 ? 'ACEPTADO' : 'RECHAZADO';

        return {
            estado,
            cufe,
            ambiente: 'HABILITACION',
            fecha_validacion: new Date().toISOString(),
            mensajes,
            proveedor: 'mock-dian-local'
        };
    }
}

module.exports = ProveedorMockDian;