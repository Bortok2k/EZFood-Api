const express = require('express');
const router = express.Router();

const facturaController = require('../../controllers/factura.controller');

/** Create Factura
 * @openapi
 * '/factura/facturas':
 *   post:
 *     tags:
 *       - Factura
 *     description: Create a factura linked to a client and an order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nit:
 *                 type: number
 *                 example: 123456
 *               orden_id:
 *                 type: string
 *                 example: abc123
 *     responses:
 *       '200':
 *         description: Factura creada correctamente
 */
router.post('/facturas', facturaController.createFactura);

/** Get All Facturas
 * @openapi
 * '/factura/facturas':
 *   get:
 *     tags:
 *       - Factura
 *     description: Get all facturas
 *     responses:
 *       '200':
 *         description: Successful operation
 */
router.get('/facturas', facturaController.getFacturas);

/** Get Factura by ID
 * @openapi
 * '/factura/facturas/{id}':
 *   get:
 *     tags:
 *       - Factura
 *     description: Get factura by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '404':
 *         description: Factura no encontrada
 */
router.get('/facturas/:id', facturaController.getFacturaById);

/** Delete Factura
 * @openapi
 * '/factura/facturas/{id}':
 *   delete:
 *     tags:
 *       - Factura
 *     description: Delete factura
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Factura eliminada
 */
router.delete('/facturas/:id', facturaController.deleteFactura);

module.exports = {
    routes: router
};