const MesaService = require('../services/Mesa.service');

const getMesas = async (req, res) => {
    try {
        const data = await MesaService.getMesas();
        res.status(200).json({ msg: 'OK', data });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

const createMesa = async (req, res) => {
    try {
        await MesaService.createMesa(req.body);
        res.status(200).json({ msg: 'Mesa creada correctamente' });
    } catch (e) {
        res.status(500).json({ msg: 'Internal server error' });
    }
};

const updateMesa = async (req, res) => {
    try {
        await MesaService.updateMesa(req.params.id, req.body);
        res.status(200).json({ msg: 'Mesa actualizada correctamente' });
    } catch (e) {
        res.status(500).json({ msg: 'Internal server error' });
    }
};

const deleteMesa = async (req, res) => {
    try {
        await MesaService.deleteMesa(req.params.id);
        res.status(200).json({ msg: 'Mesa eliminada correctamente' });
    } catch (e) {
        res.status(500).json({ msg: 'Internal server error' });
    }
};

module.exports = { getMesas, createMesa, updateMesa, deleteMesa };