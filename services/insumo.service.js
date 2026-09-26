const firebase = require('../database/connection');
const cache = require('../utils/cache');
const firestore = firebase.firestore();

const CACHE_TTL = 60 * 1000; // 60s

const createInsumo = async (data) => {
    const {
        Descripcion,
        Cantidad,
        Medida
    } = data;

    const result = await firestore.collection('Insumo').add({
        Descripcion,
        Cantidad,
        Medida
    });

    cache.invalidate('insumos');
    return result;
};

const getInsumos = async () => {
    const cached = cache.get('insumos', CACHE_TTL);
    if (cached) return cached;

    const snapshot = await firestore.collection('Insumo').get();
    const data = snapshot.docs.map(doc => ({
        insumo_id: doc.id,
        ...doc.data()
    }));

    cache.set('insumos', data);
    return data;
};

const updateInsumo = async (id, data) => {
    const result = await firestore.collection('Insumo').doc(id).update(data);
    cache.invalidate('insumos');
    return result;
};

const deleteInsumo = async (id) => {
    const result = await firestore.collection('Insumo').doc(id).delete();
    cache.invalidate('insumos');
    return result;
};

module.exports = {
    createInsumo,
    getInsumos,
    updateInsumo,
    deleteInsumo
};