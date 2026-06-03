const firebase = require('../database/connection');
const firestore = firebase.firestore();

const CreateOrden = async (data) => {
    try {
        // ✅ AQUÍ está la solución
        const { id_estado, platos, mesa } = data;

        if (!id_estado) {
            throw new Error('estado_id es requerido');
        }

        if (!Array.isArray(platos)) {
            throw new Error('platos debe ser un array');
        }

        // 🔥 validar estado
        const estadoSnapshot = await firestore
            .collection('Estado')
            .where('id_estado', '==', id_estado)
            .get();

        if (estadoSnapshot.empty) {
            throw new Error('estado no válido');
        }

        const estadoData = estadoSnapshot.docs[0].data();

        let total = 0;
        let platosData = [];

        for (let item of platos) {
            const { plato_id, cantidad } = item;

            const doc = await firestore.collection('Plato').doc(plato_id).get();

            const plato = doc.data();
            const subtotal = plato.Precio * cantidad;

            total += subtotal;

            platosData.push({
                plato_id: doc.id,
                ...plato,
                cantidad,
                subtotal
            });
        }

        const now = new Date();

        return await firestore.collection('Orden').add({
        id_estado,
        estado_nombre: estadoData.estado,
        mesa: mesa || "Mesa sin asignar",   // ← agregar
        fecha: now.toISOString().split('T')[0],
        hora: now.toTimeString().split(' ')[0],
        platos: platosData,
        total
    });

    } catch (error) {
        throw error;
    }
};

const getOrdenes = async () => {
    const snapshot = await firestore.collection('Orden').get();

    return snapshot.docs.map(doc => ({
        orden_id: doc.id,
        ...doc.data()
    }));
};

const updateOrden = async (id, data) => {
    return await firestore.collection('Orden').doc(id).update(data);
};

const deleteOrden = async (id) => {
    return await firestore.collection('Orden').doc(id).delete();
};

const updateEstadoOrden = async (orden_id, id_estado) => {
    // 🔥 validar estado
    const estadoSnapshot = await firestore
        .collection('Estado')
        .where('id_estado', '==', id_estado)
        .get();

    if (estadoSnapshot.empty) {
        throw new Error('estado no válido');
    }

    const estadoData = estadoSnapshot.docs[0].data();

    return await firestore.collection('Orden').doc(orden_id).update({
        id_estado,
        estado_nombre: estadoData.estado
    });
};

module.exports = {
    CreateOrden,
    getOrdenes,
    updateOrden,
    deleteOrden,
    updateEstadoOrden
};