const express = require('express');
const router = express.Router();
const FacturaController = require('../../controllers/FacturaElectronica.controller');
const { requireAdmin, requireEmployee } = require('../../middlewares/auth.middleware');

router.post('/facturas',requireAdmin, FacturaController.crearFactura);
router.get('/facturas',requireAdmin, FacturaController.getFacturas);

module.exports = { routes: router };