const crypto = require('crypto');

/**
 * Calcula el CUFE según el Anexo Técnico 1.9 (Resolución 000165 de 2023).
 * Concatenación: NumFac + FecFac + HorFac + ValFac + CodImp1 + ValImp1
 *                + CodImp2 + ValImp2 + CodImp3 + ValImp3 + ValTot
 *                + NitOFE + NumAdq + ClTec + TipoAmbiente
 *
 * Nota: los códigos de impuesto (01=IVA, 04=INC, 03=ICA) van con valor
 * "00.00" cuando no aplican, tal como exige el anexo. Aquí solo usamos
 * IVA (04, INC de restaurantes) para simplificar; si el proyecto factura
 * IVA general, ajusta CodImp1 a '01'.
 */
function calcularCufe({
    numeroFactura,
    fecha,           // 'YYYY-MM-DD'
    hora,             // 'HH:mm:ss'
    valorFactura,     // subtotal antes de impuestos
    valorImpuesto,    // impuesto al consumo (INC 8%)
    valorTotal,
    nitEmisor,
    documentoAdquirente,
    claveTecnica,
    tipoAmbiente      // '1' producción, '2' pruebas
}) {
    const fmt = n => Number(n).toFixed(2);

    const cadena =
        numeroFactura +
        fecha +
        hora +
        fmt(valorFactura) +
        '04' + fmt(valorImpuesto) +   // INC
        '01' + fmt(0) +               // IVA (no aplica en este caso)
        '03' + fmt(0) +               // ICA (no aplica)
        fmt(valorTotal) +
        nitEmisor +
        documentoAdquirente +
        claveTecnica +
        tipoAmbiente;

    return crypto.createHash('sha384').update(cadena).digest('hex');
}

module.exports = { calcularCufe };