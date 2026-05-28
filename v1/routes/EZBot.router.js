const express = require('express');
const router = express.Router();
const EZBotController = require('../../controllers/EZBot.controller');

router.post('/consultar', EZBotController.consultar);

module.exports = { routes: router };