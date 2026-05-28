const firebase = require('../database/connection');
const firestore = firebase.firestore();

const createInsumo = async (data) => {
    const {
        Descripcion,
        Cantidad,
        Medida
    } = data;

    return await firestore.collection('Insumo').add({
        Descripcion,
        Cantidad,
        Medida
    });
};

const getInsumos = async () => {
    const snapshot = await firestore.collection('Insumo').get();

    return snapshot.docs.map(doc => ({
        insumo_id: doc.id,
        ...doc.data()
    }));
};

const updateInsumo = async (id, data) => {
    return await firestore.collection('Insumo').doc(id).update(data);
};

const deleteInsumo = async (id) => {
    return await firestore.collection('Insumo').doc(id).delete();
};

module.exports = {
    createInsumo,
    getInsumos,
    updateInsumo,
    deleteInsumo
};