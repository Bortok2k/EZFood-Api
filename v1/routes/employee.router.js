const express = require('express');
const {createEmployee, getAll, getByIdDoc, fireEmployee, updateEmployee} = require('../../controllers/employee.controller');
const router = express.Router();

/** Create
 * @openapi
 * '/employee/create':
 *   post:
 *     tags:
 *       - Employee
 *     description: Create a new employee
 *     parameters:
 *       -
 *         name: rol
 *         in: header
 *         schema:
 *           type: number
 *         required: true
 *         description: this operation needs admin rol (1) given by token
 *         example: 1
 *     security:
 *       - bearerToken: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                   type: string
 *               user_name:
 *                   type: string
 *               first_name:
 *                   type: string
 *               second_name:
 *                   type: string
 *               last_name:
 *                   type: string
 *               mail:
 *                   type: string
 *               phone:
 *                   type: string
 *               id_doc:
 *                   type: string
 *               salary:
 *                   type: number
 *       responses:
 *         '200':
 *            description: Succesful operation 
*/
router.post('/create', createEmployee);

/** Get all
 * @openapi
 * '/employee':
 *   get:
 *     tags:
 *       - Employee
 *     description: Get all active employees
 *     parameters:
 *       -
 *         name: rol
 *         in: header
 *         schema:
 *           type: number
 *         required: true
 *         description: this operation needs admin rol (1) given by token
 *         example: 1
 *     security:
 *       - bearerToken: []
 *     responses:
 *       '200':
 *          description: Succesful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  msg:
 *                    type: string
 *                  data_list:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        user_id:
 *                          type: string
 *                        user_name:
 *                          type: string
 *                        rol:
 *                          type: number
 *                        user_data:
 *                          type: object
 *                          properties:
 *                            first_name:
 *                              type: string
 *                            second_name:
 *                              type: string
 *                            last_name:
 *                              type: string
 *                            mail:
 *                              type: string
 *                            phone:
 *                              type: string
 *                        employee_data:
 *                          type: object
 *                          properties:
 *                            salary:
 *                              type: number
 *                            active:
 *                              type: number
 *                            id_doc:
 *                              type: string
*/
router.get('', getAll);

/** Get by DNI
 * @openapi
 * '/employee/id':
 *   get:
 *     tags:
 *       - Employee
 *     description: Get an active employee by DNI provided
 *     parameters:
 *       -
 *         name: rol
 *         in: header
 *         schema:
 *           type: number
 *         required: true
 *         description: this operation needs admin rol (1) given by token
 *         example: 1
 *     security:
 *       - bearerToken: []
 *     responses:
 *       '200':
 *          description: Succesful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  msg:
 *                    type: string
 *                  data:
 *                    type: object
 *                    properties:
 *                      user_id:
 *                        type: string
 *                      user_name:
 *                        type: string
 *                      rol:
 *                        type: number
 *                      user_data:
 *                        type: object
 *                        properties:
 *                          first_name:
 *                            type: string
 *                          second_name:
 *                            type: string
 *                          last_name:
 *                            type: string
 *                          mail:
 *                            type: string
 *                          phone:
 *                            type: string
 *                      employee_data:
 *                        type: object
 *                        properties:
 *                          salary:
 *                            type: number
 *                          active:
 *                            type: number
 *                          id_doc:
 *                            type: string
*/
router.get('/:id', getByIdDoc);

/**  Dismiss
 * @openapi
 * '/employee/dismiss=id':
 *   patch:
 *     tags:
 *       - Employee
 *     description: Dismiss an active employee by DNI provided
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: dish id
 *       -
 *         name: rol
 *         in: header
 *         schema:
 *           type: number
 *         required: true
 *         description: this operation needs admin rol (1) given by token
 *         example: 1
 *     security:
 *       - bearerToken: []
 *     responses:
 *       '200':
 *          description: Succesful operation
*/
router.patch('/dismiss=:id', fireEmployee);

/** Update
 * @openapi
 * '/employee/update=id':
 *   put:
 *     tags:
 *       - Employee
 *     description: Update an active employee by DNI provided
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: dish id
 *       -
 *         name: rol
 *         in: header
 *         schema:
 *           type: number
 *         required: true
 *         description: this operation needs admin rol (1) given by token
 *         example: 1
 *     security:
 *       - bearerToken: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:           
 *               first_name:
 *                   type: string
 *               second_name:
 *                   type: string
 *               last_name:
 *                   type: string
 *               mail:
 *                   type: string
 *               phone:
 *                   type: string
 *               id_doc:
 *                   type: string
 *               salary:
 *                   type: number
 *     responses:
 *       '200':
 *          description: Succesful operation
*/
router.put('/update=:id', updateEmployee);

module.exports = {
    routes: router
}