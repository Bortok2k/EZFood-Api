const express = require('express');
const router = express.Router();

const PlatoController = require('../../controllers/Plato.controller');
const { requireAdmin, requireEmployee } = require('../../middlewares/auth.middleware');

/** Create Plato
 * @openapi
 * '/Plato/Platos':
 *   post:
 *     tags:
 *       - Plato
 *     description: Create a new dish (plato)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Descripcion:
 *                 type: string
 *                 example: Almuerzo del día
 *               Precio:
 *                 type: number
 *                 example: 19000
 *     responses:
 *       '200':
 *         description: Plato creado correctamente
 */
router.post('/Platos',requireAdmin, PlatoController.createPlato);

/** Get All Platos
 * @openapi
 * '/Plato/Platos':
 *   get:
 *     tags:
 *       - Plato
 *     description: Get all platos
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
 *                       plato_id:
 *                         type: string
 *                       Descripcion:
 *                         type: string
 *                       Precio:
 *                         type: number
 */
router.get('/Platos',requireEmployee, PlatoController.getPlatos);

/** Update Plato
 * @openapi
 * '/Plato/Platos/{id}':
 *   put:
 *     tags:
 *       - Plato
 *     description: Update a plato by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Plato ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Descripcion:
 *                 type: string
 *               Precio:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Plato actualizado correctamente
 */
router.put('/Platos/:id',requireAdmin, PlatoController.updatePlato);

/** Delete Plato
 * @openapi
 * '/Plato/Platos/{id}':
 *   delete:
 *     tags:
 *       - Plato
 *     description: Delete a plato by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Plato ID
 *     responses:
 *       '200':
 *         description: Plato eliminado correctamente
 */
router.delete('/Platos/:id',requireAdmin, PlatoController.DeletePlato);

module.exports = {
    routes: router
};