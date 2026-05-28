const clientService = require('../services/client.service');

const createClient = async (req, res) => {
    try {
        await clientService.createClient(req.body);

        res.status(200).json({
            msg: 'client added successfully'
        });
    } catch (e) {
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

const getClients = async (req, res) => {
    try {
        const data = await clientService.getClients();

        if (data.length === 0) {
            return res.status(404).json({ msg: 'no data' });
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

const updateClient = async (req, res) => {
    try {
        await clientService.updateClient(req.params.id, req.body);

        res.status(200).json({
            msg: 'client updated successfully'
        });
    } catch (e) {
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

const deleteClient = async (req, res) => {
    try {
        await clientService.deleteClient(req.params.id);

        res.status(200).json({
            msg: 'client deleted successfully'
        });
    } catch (e) {
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

const getClientByNit = async (req, res) => {
    try {
        const nit = req.params.nit;

        const client = await clientService.getClientByNit(nit);

        if (!client) {
            return res.status(404).json({
                msg: 'client not found'
            });
        }

        res.status(200).json({
            msg: 'OK',
            data: client
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

module.exports = {
    createClient,
    getClients,
    updateClient,
    deleteClient,
    getClientByNit
};