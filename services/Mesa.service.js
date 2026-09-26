const firebase = require('../database/connection');
const cache = require('../utils/cache');
const firestore = firebase.firestore();

const CACHE_TTL = 5 * 60 * 1000; // 5 min — las mesas casi no cambian

const getMesas = async () => {
    const cached = cache.get('mesas', CACHE_TTL);
    if (cached) return cached;

    const snapshot = await firestore
        .collection('Mesa')
        .orderBy('numero')
        .get();

    const data = snapshot.docs.map(doc => ({
        mesa_id: doc.id,
        ...doc.data()
    }));

    cache.set('mesas', data);
    return data;
};

const createMesa = async (data) => {
    const { numero, nombre } = data;
    const result = await firestore.collection('Mesa').add({
        numero,
        nombre: nombre || `Mesa ${numero}`,
    });

    cache.invalidate('mesas');
    return result;
};

const updateMesa = async (id, data) => {
    const result = await firestore.collection('Mesa').doc(id).update(data);
    cache.invalidate('mesas');
    return result;
};

const deleteMesa = async (id) => {
    const result = await firestore.collection('Mesa').doc(id).delete();
    cache.invalidate('mesas');
    return result;
};

module.exports = { getMesas, createMesa, updateMesa, deleteMesa };