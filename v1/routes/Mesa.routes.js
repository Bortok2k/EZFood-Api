const express = require('express');
const router = express.Router();
const MesaController = require('../../controllers/Mesa.controller');
const { requireAdmin, requireEmployee } = require('../../middlewares/auth.middleware');

/** Get All Mesas
 * @openapi
 * '/Mesa/mesas':
 *   get:
 *     tags:
 *       - Mesa
 *     description: Obtiene todas las mesas registradas
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
 *                       mesa_id:
 *                         type: string
 *                       numero:
 *                         type: number
 *                       nombre:
 *                         type: string
 *       '401':
 *         description: No autorizado
 *       '403':
 *         description: Token inválido o no proporcionado
 */
router.get('/mesas', requireEmployee, MesaController.getMesas);

/** Create Mesa
 * @openapi
 * '/Mesa/mesas':
 *   post:
 *     tags:
 *       - Mesa
 *     description: Crea una nueva mesa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numero
 *             properties:
 *               numero:
 *                 type: number
 *                 example: 12
 *               nombre:
 *                 type: string
 *                 example: Mesa 12
 *     responses:
 *       '200':
 *         description: Mesa creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Mesa creada correctamente
 *       '401':
 *         description: No autorizado
 *       '403':
 *         description: Token inválido o no proporcionado
 *       '500':
 *         description: Error interno del servidor
 */
router.post('/mesas', requireAdmin, MesaController.createMesa);

/** Update Mesa
 * @openapi
 * '/Mesa/mesas/{id}':
 *   put:
 *     tags:
 *       - Mesa
 *     description: Actualiza los datos de una mesa por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mesa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero:
 *                 type: number
 *                 example: 12
 *               nombre:
 *                 type: string
 *                 example: Mesa 12
 *     responses:
 *       '200':
 *         description: Mesa actualizada correctamente
 *       '401':
 *         description: No autorizado
 *       '403':
 *         description: Token inválido o no proporcionado
 *       '500':
 *         description: Error interno del servidor
 */
router.put('/mesas/:id', requireAdmin, MesaController.updateMesa);

/** Delete Mesa
 * @openapi
 * '/Mesa/mesas/{id}':
 *   delete:
 *     tags:
 *       - Mesa
 *     description: Elimina una mesa por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mesa a eliminar
 *     responses:
 *       '200':
 *         description: Mesa eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Mesa eliminada correctamente
 *       '401':
 *         description: No autorizado
 *       '403':
 *         description: Token inválido o no proporcionado
 *       '500':
 *         description: Error interno del servidor
 */
router.delete('/mesas/:id', requireAdmin, MesaController.deleteMesa);

module.exports = { routes: router };