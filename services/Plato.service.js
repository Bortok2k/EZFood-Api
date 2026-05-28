const firebase = require('../database/connection');
const firestore = firebase.firestore();

const CreatePlato = async (data) => {
    const {
        Descripcion,
        Precio
    } = data

    return await firestore.collection('Plato').add({
        Descripcion,
        Precio
    });
};

const getPlatos = async () => {
    const snapshot = await firestore.collection('Plato').get();

    return snapshot.docs.map(doc => ({
        plato_id: doc.id,
        ...doc.data()
    }));
};

const updatePlato = async (id, data) => {
    return await firestore.collection('Plato').doc(id).update(data);
};

const DeletePlato = async (id, data) => {
    return await firestore.collection('Plato').doc(id).delete(data);
};

module.exports = {
    CreatePlato,
    getPlatos,
    updatePlato,
    DeletePlato
};