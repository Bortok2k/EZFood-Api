const controller = require('../../controllers/menu.controller');
const express = require('express');
const router = express.Router();

/** Create
 * @openapi
 * '/menu/create':
 *    post:
 *      tags:
 *        - Menu
 *      description: Create new menu item
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
 *                category_id:
 *                  type: string
 *                description:
 *                  type: string
 *                dish_name:
 *                  type: string
 *                label_img:
 *                  type: string
 *                price:
 *                  type: number
 *      responses:
 *        '201':
 *          description: Successful operation
*/
router.post('/create', controller.createDish);

/** Get all
 * @openapi 
 * '/menu':
 *     get:
 *       tags: 
 *         - Menu
 *       description: get all menu items
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
 *                   msg:
 *                     type: string
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         dish_id:
 *                           type: string
 *                         category_id:
 *                           type: string
 *                         description:
 *                           type: string
 *                         dish_name:
 *                           type: string
 *                         label_img:
 *                           type: string
 *                         price:
 *                           type: number
*/
router.get('', controller.getDish);

/** Update
 * @openapi
 * '/menu/update=id':
 *     put:
 *       tags:
 *         - Menu
 *       description: update menu item by id
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
 *                 description:
 *                   type: string
 *                 dish_name:
 *                   type: string
 *                 label_img:
 *                   type: string
 *                 price:
 *                   type: number
 *       responses: 
 *         '201':
 *           description: Successful operation
*/
router.put('/update=:id', controller.updateDish);

/** Delete
 * @openapi
 * '/menu/delete=id':
 *     delete:
 *       tags:
 *         - Menu
 *       description: delete menu item by id
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
router.delete('/delete=:id', controller.deleteDish);

/** Get all
 * @openapi 
 * '/menu/getMenuWithcategory':
 *     get:
 *       tags: 
 *         - Menu
 *       description: get all menu items
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
 *                         dishes:
 *                           type: array
 *                           items:
 *                              type: object
 *                              properties:
 *                                dish_id:
 *                                  type: string
 *                                description:
 *                                  type: string
 *                                dish_name:
 *                                  type: string
 *                                label_img:
 *                                  type: string
 *                                price:
 *                                  type: number
*/
router.get('/getMenuWithcategory', controller.getMenuWithCategory);

module.exports = {
    routes: router,
}