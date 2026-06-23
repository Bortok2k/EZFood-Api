const express = require('express');
const router = express.Router();
const MesaController = require('../../controllers/Mesa.controller');

router.get('/mesas', MesaController.getMesas);
router.post('/mesas', MesaController.createMesa);
router.put('/mesas/:id', MesaController.updateMesa);
router.delete('/mesas/:id', MesaController.deleteMesa);

module.exports = { routes: router };