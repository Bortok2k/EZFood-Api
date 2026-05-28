const firebase = require('../database/connection');
const firestore = firebase.firestore();

const CreateGasto = async (data) => {
    const { Descripcion, Costo, Fecha, Tipo, insumo_id } = data;

    return await firestore.collection('Gasto').add({
        Descripcion,
        Costo,
        Fecha: typeof Fecha === 'string' ? Fecha : new Date().toISOString().split('T')[0],
        Tipo: Tipo || 'otro',
        insumo_id: insumo_id || ''
    });
};

const GetGasto = async () => {
    const snapshot = await firestore.collection('Gasto').get();

    return snapshot.docs.map(doc => {
        const data = doc.data();

        let fecha = data.Fecha;
        if (fecha && typeof fecha === 'object' && fecha.seconds) {
            fecha = new Date(fecha.seconds * 1000).toISOString().split('T')[0];
        }

        return {
            gasto_id: doc.id,
            Descripcion: data.Descripcion,
            Costo: data.Costo,
            Fecha: fecha,
            Tipo: data.Tipo || 'otro',     
            insumo_id: data.insumo_id || '' 
        };
    });
};

const GastoUpdate = async (id, data) => {
    return await firestore.collection('Gasto').doc(id).update(data);
};

const GastoDelete = async (id) => {
    return await firestore.collection('Gasto').doc(id).delete();
};

module.exports = {
    CreateGasto,
    GetGasto,
    GastoUpdate,
    GastoDelete
};