const express = require('express');
const router = express.Router();
const FacturaController = require('../../controllers/FacturaElectronica.controller');

router.post('/facturas', FacturaController.crearFactura);
router.get('/facturas', FacturaController.getFacturas);

module.exports = { routes: router };