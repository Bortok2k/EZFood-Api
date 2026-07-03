const express = require('express');
const router = express.Router();

const clientController = require('../../controllers/client.controller');
const { requireAdmin, requireEmployee } = require('../../middlewares/auth.middleware');
/** Create Client
 * @openapi
 * '/client/clients':
 *   post:
 *     tags:
 *       - Client
 *     description: Create a new client
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
 *               nombre:
 *                 type: string
 *                 example: Juan Perez
 *               correo:
 *                 type: string
 *                 example: juan@email.com
 *               telefono:
 *                 type: string
 *                 example: 3001234567
 *               direccion:
 *                 type: string
 *                 example: Calle 123 #45-67
 *     responses:
 *       '200':
 *         description: Client created successfully
 */
router.post('/clients',requireAdmin, clientController.createClient);

/** Get All Clients
 * @openapi
 * '/client/clients':
 *   get:
 *     tags:
 *       - Client
 *     description: Get all clients
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       client_id:
 *                         type: string
 *                       nit:
 *                         type: number
 *                       nombre:
 *                         type: string
 *                       correo:
 *                         type: string
 *                       telefono:
 *                         type: string
 *                       direccion:
 *                         type: string
 */
router.get('/clients',requireAdmin, clientController.getClients);

/** Get Client by NIT
 * @openapi
 * '/client/clients/nit/{nit}':
 *   get:
 *     tags:
 *       - Client
 *     description: Get a client by NIT
 *     parameters:
 *       - name: nit
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: Client NIT
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '404':
 *         description: Client not found
 */
router.get('/clients/nit/:nit',requireAdmin, clientController.getClientByNit);

/** Update Client
 * @openapi
 * '/client/clients/{id}':
 *   put:
 *     tags:
 *       - Client
 *     description: Update a client by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nit:
 *                 type: number
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Client updated successfully
 */
router.put('/clients/:id',requireAdmin, clientController.updateClient);

/** Delete Client
 * @openapi
 * '/client/clients/{id}':
 *   delete:
 *     tags:
 *       - Client
 *     description: Delete a client by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       '200':
 *         description: Client deleted successfully
 */
router.delete('/clients/:id',requireAdmin, clientController.deleteClient);

module.exports = {
    routes: router
};