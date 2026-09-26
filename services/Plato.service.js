const firebase = require('../database/connection');
const cache = require('../utils/cache');
const firestore = firebase.firestore();

const CACHE_TTL = 5 * 60 * 1000; // 5 min — el menú cambia con poca frecuencia

const CreatePlato = async (data) => {
    const {
        Descripcion,
        Precio
    } = data

    const result = await firestore.collection('Plato').add({
        Descripcion,
        Precio
    });

    cache.invalidate('platos');
    return result;
};

const getPlatos = async () => {
    const cached = cache.get('platos', CACHE_TTL);
    if (cached) return cached;

    const snapshot = await firestore.collection('Plato').get();
    const data = snapshot.docs.map(doc => ({
        plato_id: doc.id,
        ...doc.data()
    }));

    cache.set('platos', data);
    return data;
};

const updatePlato = async (id, data) => {
    const result = await firestore.collection('Plato').doc(id).update(data);
    cache.invalidate('platos');
    return result;
};

const DeletePlato = async (id) => {
    const result = await firestore.collection('Plato').doc(id).delete();
    cache.invalidate('platos');
    return result;
};

module.exports = {
    CreatePlato,
    getPlatos,
    updatePlato,
    DeletePlato
};