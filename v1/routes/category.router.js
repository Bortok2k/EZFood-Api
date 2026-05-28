const controller = require('../../controllers/category.controller');
const express = require('express');
const router = express.Router();

/** Create
 * @openapi
 * '/category/create':
 *    post:
 *      tags:
 *        - Menu categories
 *      description: Create new menu category
 *      parameters:
 *        - name: rol
 *          in: header
 *          schema:
 *            type: number
 *          required: true
 *          description: this operation needs admin rol (1) given by token
 *          example: 1
 *      security:
 *        - bearerToken: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                category_name:
 *                  type: string
 *      responses:
 *        '201':
 *          description: Successful operation
*/
router.post('/create', controller.createController);

/** Get all
 * @openapi 
 * '/category':
 *     get:
 *       tags: 
 *         - Menu categories
 *       description: get all menu categories
 *       security:
 *         - bearerToken: []
 *       parameters:
 *        - name: rol
 *          in: header
 *          schema:
 *            type: number
 *          required: true
 *          description: this operation needs admin rol (1) given by token
 *          example: 1
 *       responses:
 *         '200': 
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   msg:
 *                     type: string
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         category_id:
 *                           type: string
 *                         category_name:
 *                           type: string
*/
router.get('', controller.getController);

/** Update
 * @openapi
 * '/category/update=id':
 *     put:
 *       tags:
 *         - Menu categories
 *       description: update menu category by id
 *       security:
 *         - bearerToken: []
 *       parameters:
 *         - name: id
 *           in: path
 *           schema:
 *             type: string
 *           required: true
 *           description: dish id
 *         - name: rol
 *           in: header
 *           schema:
 *             type: number
 *           required: true
 *           description: this operation needs admin rol (1) given by token
 *           example: 1
 *       requestBody: 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category_name:
 *                   type: string              
 *       responses: 
 *         '201':
 *           description: Successful operation
*/
router.patch('/update=:id', controller.updateController);

/** Delete
 * @openapi
 * '/category/delete=id':
 *     delete:
 *       tags:
 *         - Menu categories
 *       description: delete menu icategory by id
 *       security:
 *         - bearerToken: []
 *       parameters:
 *         -
 *           name: id
 *           in: path
 *           schema:
 *             type: string
 *           required: true
 *           description: dish id
 *         - name: rol
 *           in: header
 *           schema:
 *             type: number
 *           required: true
 *           description: this operation needs admin rol (1) given by token
 *           example: 1
 *       responses:
 *         '201':
 *           description: Successful operation
*/
router.delete('/delete=:id', controller.deleteController);

module.exports = {
    routes: router
};