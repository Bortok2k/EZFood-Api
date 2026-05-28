const express = require('express');
const {auth} = require('../../controllers/auth.controller');
const router = express.Router();

/** Auth
 * @openapi
 * '/auth':
 *    post: 
 *      tags:
 *       - Auth
 *      summary: Authentication
 *      description: Authentication requestBody
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user_name:
 *                  type: string
 *                password:
 *                  type: string
 *      responses:
 *        '200':
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  user:
 *                    type: object
 *                    properties:
 *                      user_name:
 *                        type: string
 *                      rol:
 *                        type: number
 *                  token:
 *                    type: string
*/
router.post('', auth);

module.exports = {
    routes: router
}