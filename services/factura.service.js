const firebase = require('../database/connection');
const firestore = firebase.firestore();

const createFactura = async (data) => {
    try {
        const { nit, orden_id } = data;

        if (!nit || !orden_id) {
            throw new Error('nit y orden_id son requeridos');
        }

        // 🔍 validar cliente por NIT
        const clienteSnapshot = await firestore
            .collection('Clientes')
            .where('nit', '==', nit)
            .get();

        if (clienteSnapshot.empty) {
            throw new Error('cliente no existe');
        }

        const clienteData = clienteSnapshot.docs[0].data();

        // 🔍 validar orden
        const ordenDoc = await firestore
            .collection('Orden')
            .doc(orden_id)
            .get();

        if (!ordenDoc.exists) {
            throw new Error('orden no existe');
        }

        const ordenData = ordenDoc.data();

        // 💾 crear factura
        return await firestore.collection('Factura').add({
            nit,
            cliente_nombre: clienteData.nombre,
            orden_id,
            total: ordenData.total,
            fecha: new Date().toISOString()
        });

    } catch (error) {
        throw error;
    }
};

const getFacturas = async () => {
    const snapshot = await firestore.collection('Factura').get();

    return snapshot.docs.map(doc => ({
        factura_id: doc.id,
        ...doc.data()
    }));
};

const getFacturaById = async (id) => {
    const doc = await firestore.collection('Factura').doc(id).get();

    if (!doc.exists) {
        throw new Error('factura no encontrada');
    }

    return {
        factura_id: doc.id,
        ...doc.data()
    };
};

const deleteFactura = async (id) => {
    return await firestore.collection('Factura').doc(id).delete();
};

module.exports = {
    createFactura,
    getFacturas,
    getFacturaById,
    deleteFactura
};