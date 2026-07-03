const express = require('express');
const router = express.Router();

const insumoController = require('../../controllers/insumo.controller');
const { requireAdmin, requireEmployee } = require('../../middlewares/auth.middleware');

/** Create Insumo
 * @openapi
 * '/insumo/insumos':
 *   post:
 *     tags:
 *       - Insumo
 *     description: Create a new insumo (ingredient/supply)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Descripcion:
 *                 type: string
 *                 example: Arroz
 *               Costo:
 *                 type: number
 *                 example: 2500
 *               Cantidad:
 *                 type: number
 *                 example: 10
 *               Medida:
 *                 type: string
 *                 example: kilogramos
 *     responses:
 *       '200':
 *         description: Insumo creado correctamente
 */
router.post('/insumos',requireAdmin, insumoController.createInsumo);

/** Get All Insumos
 * @openapi
 * '/insumo/insumos':
 *   get:
 *     tags:
 *       - Insumo
 *     description: Get all insumos
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
 *                       insumo_id:
 *                         type: string
 *                       Descripcion:
 *                         type: string
 *                       Costo:
 *                         type: number
 *                       Cantidad:
 *                         type: number
 *                       Medida:
 *                         type: string
 */
router.get('/insumos',requireAdmin, insumoController.getInsumos);

/** Update Insumo
 * @openapi
 * '/insumo/insumos/{id}':
 *   put:
 *     tags:
 *       - Insumo
 *     description: Update an insumo by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Insumo ID
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
 *               Cantidad:
 *                 type: number
 *               Medida:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Insumo actualizado correctamente
 */
router.put('/insumos/:id',requireAdmin, insumoController.updateInsumo);

/** Delete Insumo
 * @openapi
 * '/insumo/insumos/{id}':
 *   delete:
 *     tags:
 *       - Insumo
 *     description: Delete an insumo by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Insumo ID
 *     responses:
 *       '200':
 *         description: Insumo eliminado correctamente
 */
router.delete('/insumos/:id',requireAdmin, insumoController.deleteInsumo);

module.exports = {
    routes: router
};