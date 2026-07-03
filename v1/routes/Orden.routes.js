const express = require('express');
const router = express.Router();

const ordenController = require('../../controllers/Orden.controller');
const { requireAdmin, requireEmployee } = require('../../middlewares/auth.middleware');

/** Create Orden
 * @openapi
 * '/Orden/ordenes':
 *   post:
 *     tags:
 *       - Orden
 *     description: Create a new order with multiple dishes and state
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_estado:
 *                 type: number
 *                 example: 1
 *               platos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     plato_id:
 *                       type: string
 *                       example: abc123
 *                     cantidad:
 *                       type: number
 *                       example: 2
 *     responses:
 *       '200':
 *         description: Orden creada correctamente
 */
router.post('/ordenes',requireEmployee, ordenController.createOrden);

/** Get All Ordenes
 * @openapi
 * '/Orden/ordenes':
 *   get:
 *     tags:
 *       - Orden
 *     description: Get all orders
 *     responses:
 *       '200':
 *         description: Successful operation
 */
router.get('/ordenes',requireEmployee, ordenController.getOrdenes);

/** Get Orden by ID
 * @openapi
 * '/Orden/ordenes/{id}':
 *   get:
 *     tags:
 *       - Orden
 *     description: Get order by ID
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
 *         description: Orden no encontrada
 */
router.put('/ordenes/:id',requireEmployee, ordenController.updateOrden); 

/** Update Estado Orden
 * @openapi
 * '/Orden/ordenes/{id}/estado':
 *   patch:
 *     tags:
 *       - Orden
 *     description: Update order state
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_estado:
 *                 type: number
 *                 example: 2
 *     responses:
 *       '200':
 *         description: Estado actualizado correctamente
 */
router.patch('/ordenes/:id/estado',requireEmployee, ordenController.updateEstadoOrden);

/** Delete Orden
 * @openapi
 * '/Orden/ordenes/{id}':
 *   delete:
 *     tags:
 *       - Orden
 *     description: Delete an order
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Orden eliminada
 */
router.delete('/ordenes/:id',requireEmployee, ordenController.deleteOrden);

module.exports = {
    routes: router
}
