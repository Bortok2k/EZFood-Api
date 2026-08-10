const soap = require('soap'); // npm install soap --save
const ProveedorFacturacion = require('./ProveedorFacturacion.service');

const WSDL_HABILITACION = 'https://vpfe-hab.dian.gov.co/WcfDianCustomerServices.svc?wsdl';
const WSDL_PRODUCCION   = 'https://vpfe.dian.gov.co/WcfDianCustomerServices.svc?wsdl';

class ProveedorDianReal extends ProveedorFacturacion {
    async enviar(factura) {
        // TODO (trabajo futuro): requiere
        //  1) certificado digital firmante (.p12) provisto por la DIAN
        //  2) construir el XML UBL 2.1 de la factura y firmarlo (XAdES)
        //  3) llamar SendBillSync (producción) o SendTestSetAsync (habilitación)
        //  4) consultar el resultado con GetStatus usando el TrackId devuelto
        //
        // Estructura de llamada esperada (pendiente de credenciales reales):
        const wsdl = process.env.DIAN_AMBIENTE === 'produccion'
            ? WSDL_PRODUCCION
            : WSDL_HABILITACION;

        throw new Error(
            'ProveedorDianReal no está activo: pendiente habilitación DIAN ' +
            `y certificado digital. WSDL objetivo: ${wsdl}`
        );
    }
}

module.exports = ProveedorDianReal;