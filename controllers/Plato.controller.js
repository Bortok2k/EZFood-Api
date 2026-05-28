const PlatoService = require('../services/Plato.service');

const createPlato = async (req, res) => {
    try {
        await PlatoService.CreatePlato(req.body);

        res.status(200).json({
            msg: 'Plato added successfully'
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

const getPlatos = async (req, res) => {
    try {
        const data = await PlatoService.getPlatos();

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

const updatePlato = async (req, res) => {
    try {
        await PlatoService.updatePlato(req.params.id, req.body);

        res.status(200).json({
            msg: 'Plato updated successfully'
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

const DeletePlato = async (req, res) => {
    try {
        await PlatoService.DeletePlato(req.params.id);

        res.status(200).json({
            msg: 'Plato deleted successfully'
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

module.exports = {
    createPlato,
    getPlatos,
    updatePlato,
    DeletePlato
};

