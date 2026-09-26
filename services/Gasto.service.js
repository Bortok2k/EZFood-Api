const firebase = require('../database/connection');
const cache = require('../utils/cache');
const firestore = firebase.firestore();

const CACHE_TTL = 60 * 1000;

const CreateGasto = async (data) => {
    const { Descripcion, Costo, Fecha, Tipo, insumo_id } = data;
    const result = await firestore.collection('Gasto').add({
        Descripcion,
        Costo,
        Fecha: typeof Fecha === 'string' ? Fecha : new Date().toISOString().split('T')[0],
        Tipo: Tipo || 'otro',
        insumo_id: insumo_id || ''
    });
    cache.invalidate('gastos');
    return result;
};

const GetGasto = async () => {
    const cached = cache.get('gastos', CACHE_TTL);
    if (cached) return cached;

    const snapshot = await firestore.collection('Gasto').get();
    const data = snapshot.docs.map(doc => {
        const d = doc.data();
        let fecha = d.Fecha;
        if (fecha && typeof fecha === 'object' && fecha.seconds) {
            fecha = new Date(fecha.seconds * 1000).toISOString().split('T')[0];
        }
        return {
            gasto_id: doc.id,
            Descripcion: d.Descripcion,
            Costo: d.Costo,
            Fecha: fecha,
            Tipo: d.Tipo || 'otro',
            insumo_id: d.insumo_id || ''
        };
    });

    cache.set('gastos', data);
    return data;
};

const GastoUpdate = async (id, data) => {
    const result = await firestore.collection('Gasto').doc(id).update(data);
    cache.invalidate('gastos');
    return result;
};

const GastoDelete = async (id) => {
    const result = await firestore.collection('Gasto').doc(id).delete();
    cache.invalidate('gastos');
    return result;
};

module.exports = { CreateGasto, GetGasto, GastoUpdate, GastoDelete };