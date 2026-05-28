const ordenService = require('../services/Orden.service');

const createOrden = async (req, res) => {
    try {
        const data = req.body;

        await ordenService.CreateOrden(data);

        res.status(200).json({
            msg: 'orden creada correctamente'
        });

    } catch (e) {
        console.error(e);

        res.status(500).json({
            msg: e.message || 'Internal server error'
        });
    }
            console.log("BODY COMPLETO:", req.body);
};

const getOrdenes = async (req, res) => {
    try {
        const data = await ordenService.getOrdenes();

        if (data.length === 0) {
            return res.status(404).json({
                msg: 'no hay ordenes'
            });
        }

        res.status(200).json({
            msg: 'OK',
            data: data
        });

    } catch (e) {
        console.error(e);

        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

const updateOrden = async (req, res) => {
    try {
        const { id } = req.params;

        await ordenService.updateOrden(id, req.body);

        res.status(200).json({
            msg: 'orden actualizada correctamente'
        });

    } catch (e) {
        console.error(e);

        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

const deleteOrden = async (req, res) => {
    try {
        const { id } = req.params;

        await ordenService.deleteOrden(id);

        res.status(200).json({
            msg: 'orden eliminada correctamente'
        });

    } catch (e) {
        console.error(e);

        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

const updateEstadoOrden = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_estado } = req.body;

        await ordenService.updateEstadoOrden(id, id_estado);

        res.status(200).json({
            msg: 'estado actualizado correctamente'
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            msg: e.message || 'Internal server error'
        });
    }
};

module.exports = {
    createOrden,
    getOrdenes,
    updateOrden,
    deleteOrden,
    updateEstadoOrden
};