const express = require('express');
const router = express.Router();
const MesaController = require('../../controllers/Mesa.controller');
const { requireAdmin, requireEmployee } = require('../../middlewares/auth.middleware');

router.get('/mesas',requireEmployee, MesaController.getMesas);
router.post('/mesas',requireAdmin, MesaController.createMesa);
router.put('/mesas/:id',requireAdmin, MesaController.updateMesa);
router.delete('/mesas/:id',requireAdmin, MesaController.deleteMesa);

module.exports = { routes: router };