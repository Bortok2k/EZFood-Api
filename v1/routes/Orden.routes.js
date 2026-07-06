const express = require('express');
const router = express.Router();

const ordenController = require('../../controllers/Orden.controller');
const { requireEmployee } = require('../../middlewares/auth');

/** Create Orden
 * @openapi
 * '/Orden/ordenes':
 *   post:
 *     tags:
 *       - Orden
 *     description: Crea una nueva orden con mesa, estado y lista de platos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_estado
 *               - mesa
 *               - platos
 *             properties:
 *               id_estado:
 *                 type: number
 *                 example: 1
 *               mesa:
 *                 type: string
 *                 example: "Mesa 3"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: orden creada correctamente
 *       '401':
 *         description: No autorizado
 *       '403':
 *         description: Token inválido o no proporcionado
 *       '500':
 *         description: Error interno del servidor
 */
router.post('/ordenes', requireEmployee, ordenController.createOrden);

/** Get All Ordenes
 * @openapi
 * '/Orden/ordenes':
 *   get:
 *     tags:
 *       - Orden
 *     description: Obtiene todas las órdenes registradas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Operación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orden_id:
 *                         type: string
 *                       mesa:
 *                         type: string
 *                       id_estado:
 *                         type: number
 *                       estado_nombre:
 *                         type: string
 *                       fecha:
 *                         type: string
 *                       hora:
 *                         type: string
 *                       total:
 *                         type: number
 *                       platos:
 *                         type: array
 *                         items:
 *                           type: object
 *       '401':
 *         description: No autorizado
 *       '403':
 *         description: Token inválido o no proporcionado
 */
router.get('/ordenes', requireEmployee, ordenController.getOrdenes);

/** Update Orden
 * @openapi
 * '/Orden/ordenes/{id}':
 *   put:
 *     tags:
 *       - Orden
 *     description: Actualiza los platos y el total de una orden existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               platos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     plato_id:
 *                       type: string
 *                     Descripcion:
 *                       type: string
 *                     Precio:
 *                       type: number
 *                     cantidad:
 *                       type: number
 *                     subtotal:
 *                       type: number
 *               total:
 *                 type: number
 *                 example: 38000
 *     responses:
 *       '200':
 *         description: Orden actualizada correctamente
 *       '401':
 *         description: No autorizado
 *       '403':
 *         description: Token inválido o no proporcionado
 *       '500':
 *         description: Error interno del servidor
 */
router.put('/ordenes/:id', requireEmployee, ordenController.updateOrden);

/** Update Estado Orden
 * @openapi
 * '/Orden/ordenes/{id}/estado':
 *   patch:
 *     tags:
 *       - Orden
 *     description: Actualiza el estado de una orden (ej. de Preparacion a Pagado)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_estado
 *             properties:
 *               id_estado:
 *                 type: number
 *                 example: 4
 *     responses:
 *       '200':
 *         description: Estado actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: estado actualizado correctamente
 *       '401':
 *         description: No autorizado
 *       '403':
 *         description: Token inválido o no proporcionado
 *       '500':
 *         description: Error interno del servidor
 */
router.patch('/ordenes/:id/estado', requireEmployee, ordenController.updateEstadoOrden);

/** Delete Orden
 * @openapi
 * '/Orden/ordenes/{id}':
 *   delete:
 *     tags:
 *       - Orden
 *     description: Elimina una orden por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden a eliminar
 *     responses:
 *       '200':
 *         description: Orden eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: orden eliminada correctamente
 *       '401':
 *         description: No autorizado
 *       '403':
 *         description: Token inválido o no proporcionado
 *       '500':
 *         description: Error interno del servidor
 */
router.delete('/ordenes/:id', requireEmployee, ordenController.deleteOrden);

module.exports = {
    routes: router
};
