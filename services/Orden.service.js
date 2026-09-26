const firebase = require('../database/connection');
const cache = require('../utils/cache');
const PlatoService = require('./Plato.service');
const firestore = firebase.firestore();

const CACHE_TTL = 60 * 1000; // 60s

const CreateOrden = async (data) => {
    try {
        const { id_estado, platos, mesa } = data;

        if (!id_estado) {
            throw new Error('estado_id es requerido');
        }

        if (!Array.isArray(platos)) {
            throw new Error('platos debe ser un array');
        }

        // Validar estado
        const estadoSnapshot = await firestore
            .collection('Estado')
            .where('id_estado', '==', id_estado)
            .get();

        if (estadoSnapshot.empty) {
            throw new Error('estado no válido');
        }

        const estadoData = estadoSnapshot.docs[0].data();

        // En vez de un doc.get() por cada plato del pedido, se usa
        // el catálogo cacheado de Plato.service (misma lista que /Plato/Platos)
        const catalogoPlatos = await PlatoService.getPlatos();

        let total = 0;
        let platosData = [];

        for (let item of platos) {
            const { plato_id, cantidad } = item;

            const plato = catalogoPlatos.find(p => p.plato_id === plato_id);
            if (!plato) {
                throw new Error(`plato ${plato_id} no encontrado`);
            }

            const { plato_id: _omit, ...platoData } = plato;
            const subtotal = plato.Precio * cantidad;
            total += subtotal;

            platosData.push({
                plato_id,
                ...platoData,
                cantidad,
                subtotal
            });
        }

        const now = new Date();

        const nuevaOrden = await firestore.collection('Orden').add({
            id_estado,
            estado_nombre: estadoData.estado,
            mesa: mesa || "Mesa sin asignar",
            fecha: now.toISOString().split('T')[0],
            hora: now.toTimeString().split(' ')[0],
            platos: platosData,
            total
        });

        cache.invalidatePrefix('ordenes');
        return nuevaOrden;

    } catch (error) {
        throw error;
    }
};

const getOrdenes = async () => {
    const cached = cache.get('ordenes', CACHE_TTL);
    if (cached) return cached;

    const snapshot = await firestore.collection('Orden').get();
    const data = snapshot.docs.map(doc => ({
        orden_id: doc.id,
        ...doc.data()
    }));

    cache.set('ordenes', data);
    return data;
};

// Filtra en Firestore (where), no trae la colección completa para
// luego descartar todo lo que no está en ese estado. Se cachea por
// separado de getOrdenes() porque son consultas distintas.
const getOrdenesPorEstado = async (estadoNombre) => {
    const cacheKey = `ordenes_estado_${estadoNombre}`;
    const cached = cache.get(cacheKey, CACHE_TTL);
    if (cached) return cached;

    const snapshot = await firestore
        .collection('Orden')
        .where('estado_nombre', '==', estadoNombre)
        .get();

    const data = snapshot.docs.map(doc => ({
        orden_id: doc.id,
        ...doc.data()
    }));

    cache.set(cacheKey, data);
    return data;
};

const updateOrden = async (id, data) => {
    const result = await firestore.collection('Orden').doc(id).update(data);
    cache.invalidatePrefix('ordenes');
    return result;
};

const deleteOrden = async (id) => {
    const result = await firestore.collection('Orden').doc(id).delete();
    cache.invalidatePrefix('ordenes');
    return result;
};

const updateEstadoOrden = async (orden_id, id_estado) => {
    const estadoSnapshot = await firestore
        .collection('Estado')
        .where('id_estado', '==', id_estado)
        .get();

    if (estadoSnapshot.empty) {
        throw new Error('estado no válido');
    }

    const estadoData = estadoSnapshot.docs[0].data();

    const result = await firestore.collection('Orden').doc(orden_id).update({
        id_estado,
        estado_nombre: estadoData.estado
    });

    cache.invalidatePrefix('ordenes');
    return result;
};

module.exports = {
    CreateOrden,
    getOrdenes,
    getOrdenesPorEstado,
    updateOrden,
    deleteOrden,
    updateEstadoOrden
};