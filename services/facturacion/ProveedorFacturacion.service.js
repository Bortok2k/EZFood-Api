/**
 * Contrato que debe cumplir cualquier proveedor de validación de facturación electrónica.
 *
 * enviar(factura) → Promise<{
 *   estado: 'ACEPTADO' | 'RECHAZADO',
 *   cufe: string,
 *   ambiente: 'HABILITACION' | 'PRODUCCION',
 *   fecha_validacion: string,
 *   mensajes: string[],
 *   proveedor: string
 * }>
 */
class ProveedorFacturacion {
    async enviar(factura) {
        throw new Error('enviar() no implementado');
    }
}

module.exports = ProveedorFacturacion;