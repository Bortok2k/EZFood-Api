const express = require('express');
const router = express.Router();
const DianMockController = require('../../controllers/DianMock.controller');

/**
 * @openapi
 * '/dian-mock/validar':
 *   post:
 *     tags:
 *       - DianMock
 *     description: >
 *       Réplica local del contrato de validación previa de la DIAN
 *       (WcfDianCustomerServices.svc / SendTestSetAsync). No sustituye
 *       la integración real, que requiere certificado digital y
 *       habilitación previa ante la DIAN.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numeroFactura: { type: string }
 *               fecha: { type: string, example: '2026-08-04' }
 *               hora: { type: string, example: '14:30:00' }
 *               subtotal: { type: number }
 *               impuesto: { type: number }
 *               total: { type: number }
 *               nitEmisor: { type: string }
 *               documentoAdquirente: { type: string }
 *     responses:
 *       '200':
 *         description: Resultado de validación (aceptado o rechazado)
 */
router.post('/validar', DianMockController.validar);

module.exports = { routes: router };