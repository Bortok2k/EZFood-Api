const insumoService = require('../services/insumo.service');

const createInsumo = async (req, res) => {
    try {
        console.log("Body recibido:", req.body);
        await insumoService.createInsumo(req.body);

        res.status(200).json({
            msg: 'insumo added successfully'
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

const getInsumos = async (req, res) => {
    try {
        const data = await insumoService.getInsumos();

        if (data.length === 0) {
            return res.status(404).json({
                msg: 'no data'
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

const updateInsumo = async (req, res) => {
    try {
        await insumoService.updateInsumo(req.params.id, req.body);

        res.status(200).json({
            msg: 'insumo updated successfully'
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

const deleteInsumo = async (req, res) => {
    try {
        await insumoService.deleteInsumo(req.params.id);

        res.status(200).json({
            msg: 'insumo deleted successfully'
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

module.exports = {
    createInsumo,
    getInsumos,
    updateInsumo,
    deleteInsumo
};