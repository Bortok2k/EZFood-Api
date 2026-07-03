const express = require('express');
const router = express.Router();
const EZBotController = require('../../controllers/EZBot.controller');
const { requireAdmin, requireEmployee } = require('../../middlewares/auth.middleware');

router.post('/consultar',requireAdmin, EZBotController.consultar);

module.exports = { routes: router };