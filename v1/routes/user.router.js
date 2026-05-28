const express = require('express');
const {createUser, getAll, getById, updateUser, deleteUser} = require('../../controllers/user.controller');

const router = express.Router();

/** Create
 * @openapi
 * '/user/create':
 *     post:
 *       tags:
 *         - User
 *       description: Create address
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   password:
 *                     type: string
 *                   user_name:
 *                     type: string
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   mail:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   second_name:
 *                     type: string
 *       responses:
 *         '200':
 *           description: Successful operation
*/          
router.post('/create',createUser);

/** Get all
 * @openapi
 * '/user':
 *     get:
 *       tags:
 *        - User
 *       description: Get all users
 *       parameters:
 *         -
 *           name: rol
 *           in: header
 *           description: this operation needs admin rol (1) given by token
 *           schema:
 *             type: number
 *           required: true
 *           example: 1
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
 *                   user_list:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         rol:
 *                           type: number
 *                         user_name:
 *                           type: string
 *
*/
router.get('', getAll);

/** Get by ID
 * @openapi
 * '/user/id':
 *     get:
 *       tags:
 *         - User
 *       description: get user info by id
 *       parameters:
 *         -
 *           name: id
 *           in: path
 *           description: user id
 *           schema:
 *             type: string
 *           required: true
 *         -
 *           name: rol
 *           in: header
 *           description: this operation needs admin rol (1) given by token
 *           schema:
 *             type: number
 *           required: true
 *           example: 1
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
 *                   user:
 *                     type: object
 *                     properties:
 *                       rol:
 *                         type: string
 *                       user_name:
 *                         type: string
 *                   user_data:
 *                     type: object
 *                     properties:
 *                       first_name:
 *                         type: string
 *                       mail:
 *                         type: string
 *                       last_name:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       second_name:
 *                         type: string
 *                       user_id:
 *                         typr: string
*/
router.get('/:id', getById);

/** Update
 * @openapi 
 * '/user/update=id':
 *   put:
 *     tags:
 *       - User
 *     description: update user info by id
 *     parameters:
 *       -
 *         name: id
 *         in: path
 *         description: user id
 *         schema:
 *           type: string
 *         required: true
 *       -
 *         name: rol
 *         in: header
 *         description: this operation needs admin rol (1) given by token
 *         schema:
 *           type: number
 *         required: true
 *         example: 1
 *     security:
 *       - bearerToken: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 password:
 *                   type: string
 *                 user_name:
 *                   type: string
 *                 rol:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Successful operation
*/
router.put('/update=:id', updateUser);

/** Delete
 * @openapi
 * '/user/delete=id':
 *     delete:
 *       tags:
 *         - User
 *       description: Delete a user by id
 *       parameters:
 *         -
 *           name: id
 *           in: path
 *           description: user id
 *           schema:
 *             type: string
 *           required: true
 *         -
 *           name: rol
 *           in: header
 *           description: this operation needs admin rol (1) given by token
 *           schema:
 *             type: number
 *           required: true
 *           example: 1
 *       security:
 *         - bearerToken: []
 *       responses:
 *         '200':
 *           description: Successful operation
*/
router.delete('/delete=:id', deleteUser);

module.exports = {
    routes: router
}