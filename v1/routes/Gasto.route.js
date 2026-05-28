const express = require('express');
const router = express.Router();

const GastoController = require('../../controllers/Gasto.controller');

/** Create Gasto
 * @openapi
 * '/Gasto/gasto':
 *   post:
 *     tags:
 *       - Gasto
 *     description: Create a new expense
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Descripcion:
 *                 type: string
 *                 example: Compra de insumos
 *               Costo:
 *                 type: number
 *                 example: 50000
 *     responses:
 *       '200':
 *         description: Gasto creado correctamente
 */
router.post('/gasto', GastoController.CreateGasto);

/** Get All Gastos
 * @openapi
 * '/Gasto/gasto':
 *   get:
 *     tags:
 *       - Gasto
 *     description: Get all expenses
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       gasto_id:
 *                         type: string
 *                       Descripcion:
 *                         type: string
 *                       Costo:
 *                         type: number
 */
router.get('/gasto', GastoController.GetGasto);

/** Update Gasto
 * @openapi
 * '/Gasto/gasto/{id}':
 *   put:
 *     tags:
 *       - Gasto
 *     description: Update an expense by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Gasto ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Descripcion:
 *                 type: string
 *               Costo:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Gasto actualizado correctamente
 */
router.put('/gasto/:id', GastoController.GastoUpdate);

/** Delete Gasto
 * @openapi
 * '/Gasto/gasto/{id}':
 *   delete:
 *     tags:
 *       - Gasto
 *     description: Delete an expense by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Gasto ID
 *     responses:
 *       '200':
 *         description: Gasto eliminado correctamente
 */
router.delete('/gasto/:id', GastoController.GastoDelete);

module.exports = {
    routes: router
};