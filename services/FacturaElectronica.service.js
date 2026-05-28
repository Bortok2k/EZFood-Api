const firebase = require('../database/connection');
const firestore = firebase.firestore();

const crearFactura = async (data) => {
        const { orden_id, cliente_nit } = data;

    console.log("Iniciando creación de factura...");

    // Obtener la orden
    const ordenDoc = await firestore.collection('Orden').doc(orden_id).get();
    console.log("Orden existe:", ordenDoc.exists);
    if (!ordenDoc.exists) throw new Error('Orden no encontrada');
    const orden = ordenDoc.data();
    console.log("Orden data:", orden);

    // Obtener el cliente por NIT
    const clienteSnapshot = await firestore
        .collection('Clientes')
        .where('nit', '==', String(cliente_nit))
        .get();
    console.log("Clientes encontrados:", clienteSnapshot.size);
    if (clienteSnapshot.empty) throw new Error('Cliente no encontrado');

    const cliente = clienteSnapshot.docs[0].data();
    const cliente_id = clienteSnapshot.docs[0].id;
    console.log("Cliente:", cliente);

    const subtotal = orden.total;
    const impuesto = Math.round(subtotal * 0.08);
    const total_con_impuesto = subtotal + impuesto;

    const now = new Date();

    console.log("Guardando factura en Firestore...");
    // Crear la factura
   const factura = await firestore.collection('FacturaElectronica').add({
    orden_id,
    cliente_id,
    cliente_nit: cliente.nit || '',
    cliente_nombre: cliente.nombre || '',
    cliente_correo: cliente.correo || '',
    cliente_direccion: cliente.direccion || '',
    mesa: orden.mesa || 0,           // ← fallback si es undefined
    fecha: now.toISOString().split('T')[0],
    hora: now.toTimeString().split(' ')[0],
    platos: orden.platos || [],
    subtotal,
    impuesto_consumo: impuesto,
    total: total_con_impuesto,
    estado: 'EMITIDA'
});
console.log("Factura guardada con ID:", factura.id);
    return {
        factura_id: factura.id,
        cliente_nombre: cliente.nombre,
        cliente_nit: cliente.nit,
        cliente_correo: cliente.correo,
        cliente_direccion: cliente.direccion,
        mesa: orden.mesa,
        fecha: now.toISOString().split('T')[0],
        hora: now.toTimeString().split(' ')[0],
        platos: orden.platos,
        subtotal,
        impuesto_consumo: impuesto,
        total: total_con_impuesto,
        estado: 'EMITIDA'
    };
};

const getFacturas = async () => {
    const snapshot = await firestore.collection('FacturaElectronica').get();
    return snapshot.docs.map(doc => ({ factura_id: doc.id, ...doc.data() }));
};

module.exports = { crearFactura, getFacturas };