const firebase = require('../database/connection');
const firestore = firebase.firestore();

const createClient = async (data) => {
    const {
        nit,
        nombre,
        correo,
        telefono,
        direccion
    } = data;

    return await firestore.collection('Clientes').add({
        nit,
        nombre,
        correo,
        telefono,
        direccion
    });
};

const getClients = async () => {
    const snapshot = await firestore.collection('Clientes').get();

    return snapshot.docs.map(doc => ({
        client_id: doc.id,
        nit: doc.data().nit,
        nombre: doc.data().nombre,
        correo: doc.data().correo,
        telefono: doc.data().telefono,
        direccion: doc.data().direccion
    }));
};

const updateClient = async (id, data) => {
    return await firestore.collection('Clientes').doc(id).update(data);
};

const deleteClient = async (id) => {
    return await firestore.collection('Clientes').doc(id).delete();
};

const getClientByNit = async (nit) => {
    const snapshot = await firestore
        .collection('Clientes')
        .where('nit', '==', String(nit))
        .get();

    if (snapshot.empty) {
        return null;
    }
    
    const doc = snapshot.docs[0];

    return {
        client_id: doc.id,
        ...doc.data()
    };
};

module.exports = {
    createClient,
    getClients,
    updateClient,
    deleteClient,
    getClientByNit
};