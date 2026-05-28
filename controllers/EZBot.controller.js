const EZBotService = require('../services/EZBot.service');

const consultar = async (req, res) => {
    try {
        const { pregunta, modo } = req.body;
        if (!pregunta) return res.status(400).json({ msg: 'La pregunta es requerida' });

        const respuesta = await EZBotService.consultarEZBot(pregunta, modo || 'general');
        res.status(200).json({ msg: 'OK', respuesta });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

module.exports = { consultar };