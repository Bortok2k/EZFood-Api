const firebase = require('../database/connection');
const firestore = firebase.firestore();
const { getProveedorFacturacion } = require('./facturacion');

const crearFactura = async (data) => {
    const { orden_id, cliente_nit } = data;

    const ordenDoc = await firestore.collection('Orden').doc(orden_id).get();
    if (!ordenDoc.exists) throw new Error('Orden no encontrada');
    const orden = ordenDoc.data();

    const clienteSnapshot = await firestore
        .collection('Clientes')
        .where('nit', '==', String(cliente_nit))
        .get();
    if (clienteSnapshot.empty) throw new Error('Cliente no encontrado');

    const cliente = clienteSnapshot.docs[0].data();
    const cliente_id = clienteSnapshot.docs[0].id;

    const subtotal = orden.total;
    const impuesto = Math.round(subtotal * 0.08);
    const total_con_impuesto = subtotal + impuesto;

    const now = new Date();
    const fecha = now.toISOString().split('T')[0];
    const hora = now.toTimeString().split(' ')[0];

    // ── Validación previa contra el proveedor (mock o real) ──
    const proveedor = getProveedorFacturacion();
    const validacion = await proveedor.enviar({
        numeroFactura: orden_id,
        fecha,
        hora,
        subtotal,
        impuesto,
        total: total_con_impuesto,
        nitEmisor: process.env.DIAN_NIT_EMISOR || '900000000',
        documentoAdquirente: String(cliente.nit)
    });

    const factura = await firestore.collection('FacturaElectronica').add({
        orden_id,
        cliente_id,
        cliente_nit: cliente.nit || '',
        cliente_nombre: cliente.nombre || '',
        cliente_correo: cliente.correo || '',
        cliente_direccion: cliente.direccion || '',
        mesa: orden.mesa || 0,
        fecha, hora,
        platos: orden.platos || [],
        subtotal,
        impuesto_consumo: impuesto,
        total: total_con_impuesto,
        estado: validacion.estado === 'ACEPTADO' ? 'EMITIDA' : 'RECHAZADA',
        cufe: validacion.cufe,
        ambiente_dian: validacion.ambiente,
        proveedor_dian: validacion.proveedor,
        mensajes_validacion: validacion.mensajes
    });

    return {
        factura_id: factura.id,
        cliente_nombre: cliente.nombre,
        cliente_nit: cliente.nit,
        cliente_correo: cliente.correo,
        cliente_direccion: cliente.direccion,
        mesa: orden.mesa,
        fecha, hora,
        platos: orden.platos,
        subtotal,
        impuesto_consumo: impuesto,
        total: total_con_impuesto,
        estado: validacion.estado === 'ACEPTADO' ? 'EMITIDA' : 'RECHAZADA',
        cufe: validacion.cufe,
        ambiente_dian: validacion.ambiente,
        mensajes_validacion: validacion.mensajes
    };
};
const getFacturas = async () => {
    const snapshot = await firestore.collection('FacturaElectronica').get();
    return snapshot.docs.map(doc => ({ factura_id: doc.id, ...doc.data() }));
};

module.exports = { crearFactura, getFacturas };