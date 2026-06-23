const firebase = require('../database/connection');
const firestore = firebase.firestore();

const getMesas = async () => {
    const snapshot = await firestore
        .collection('Mesa')
        .orderBy('numero')
        .get();

    return snapshot.docs.map(doc => ({
        mesa_id: doc.id,
        ...doc.data()
    }));
};

const createMesa = async (data) => {
    const { numero, nombre } = data;
    return await firestore.collection('Mesa').add({
        numero,
        nombre: nombre || `Mesa ${numero}`,
    });
};

const updateMesa = async (id, data) => {
    return await firestore.collection('Mesa').doc(id).update(data);
};

const deleteMesa = async (id) => {
    return await firestore.collection('Mesa').doc(id).delete();
};

module.exports = { getMesas, createMesa, updateMesa, deleteMesa };