const express = require('express');
const {createAdress, updateAdress, getAddressByUser,deleteAdress} = require('../../controllers/address.controller');

const router = express.Router();

/** Create
 * @openapi
 * /address/create:
 *     post:
 *       tags:
 *         - Address
 *       description: Create address
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *                   adress_name:
 *                     type: string
 *       security:
 *         - bearerToken: []
 *       responses:
 *         '200':
 *           description: Successful operation
*/
router.post('/create', createAdress);

/** Update
 * @openapi
 * '/address/update=id':
 *     put:
 *       tags:
 *         - Address
 *       description: Update Address field
 *       parameters:
 *         -
 *           name: id
 *           in: path
 *           schema:
 *             type: string
 *           required: true
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lat:
 *                   type: number
 *                 lng: 
 *                   type: number
 *                 adress_name:
 *                   type: string
 *       security:
 *         - bearerToken: []
 *       responses:
 *         '200':
 *           description: Successful operation
*/
router.put('/update=:id', updateAdress);

/** Get all
 * @openapi
 * '/address':
 *     get:
 *       tags:
 *         - Address
 *       description: Get all addresses by user id   
 *       security:
 *         - bearerToken: []
 *       responses:
 *         '200':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:	
 *                   user:
 *                     type: string
 *                   addresses:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                          type: string
 *                         lat:
 *                           type: number
 *                         lng: 
 *                           type: number
 *                         address_name:
 *                           type: string  
*/
router.get('', getAddressByUser);

/** Delete
 * @openapi
 * '/address/delete=id':
 *     delete:
 *       tags:
 *         - Address
 *       description: Get all addresses by user id
 *       parameters:
 *         -
 *           name: id
 *           in: path
 *           schema:
 *             type: string
 *           required: true
 *           description: address id
 *       security:
 *         - bearerToken: []
 *       responses:
 *         '200':
 *           description: Successful operation
*/
router.delete('/delete=:id',deleteAdress);

module.exports = {
    routes: router
}