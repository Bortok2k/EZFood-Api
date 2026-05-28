const express = require('express');
const {
    createOrder, 
    takeOrder, 
    cancelOrder, 
    shippedOrder, 
    getAll, 
    updateOrderItem, 
    deleteOrderItem, 
    addOrderItem, 
    getItemsByOrder,
    GetOrdersByUser
} = require('../../controllers/order.controller');
const router = express.Router();

/** Create
 * @openapi
 * /order/create:
 *     post:
 *       tags:
 *         - Order
 *       description: Create order
 *       requestBody:
 *          content:
 *             application/json:
 *               schema:
 *                   type: object
 *                   properties:
 *                     address_name:
 *                       type: string
 *                     lat:
 *                       type: number
 *                     lng:
 *                       type: number
 *                     total_price:
 *                       type: number
 *                     observations:
 *                       type: string
 *                     delivery_id:
 *                       type: string
 *                     'items':
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                            item_desc:
 *                              type: string
 *                            item_id:
 *                              type: string                         
 *                            quantity:
 *                              type: number
 *                            unit_price:
 *                              type: number 
 *       security:
 *         - bearerToken: []
 *       responses:
 *         '200':
 *           description:
 *           content:
 *             application/json:
 *               schema:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     address_name:
 *                       type: string
 *                     lat:
 *                       type: number
 *                     lng:
 *                       type: number
 *                     total_price:
 *                       type: number
 *                     delivery_id:
 *                       type: string
 *                     owner:
 *                       type: string
 *                     owner_id:
 *                       type: string
 *                     date:
 *                       type: string
 *                     observations:
 *                       type: string
 *                     state:
 *                       type: boolean
 *                     taken:
 *                       type: boolean
 *                     Canceled:
 *                       type: boolean
 *                     'items':
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                            id:
 *                              type: string
 *                            item_desc:
 *                              type: string
 *                            item_id:
 *                              type: string                          
 *                            quantity:
 *                              type: number
 *                            unit_price:
 *                              type: number
*/
router.post('/create', createOrder);

/** Take
 * @openapi
 * /order/take=id:
 *     patch:
 *       tags:
 *         - Order
 *       description: Create order
 *       parameters:
 *         - name: id
 *           in: path
 *           schema:
 *             type: string
 *           required: true
 *           description: Order ID
 *       security:
 *         - bearerToken: []
 *       responses:
 *         '200':
 *           description: Successful operation
*/
router.patch('/take=:id', takeOrder);

/** Cancel
 * @openapi
 * /order/cancel=id:
 *     delete:
 *       tags:
 *         - Order
 *       description: Cancel order
 *       parameters:
 *         - name: id
 *           in: path
 *           schema:
 *             type: string
 *           required: true
 *           description: Order ID
 *       security:
 *         - bearerToken: []
 *       responses:
 *         '200':
 *           description: Successful operation
*/
router.delete('/cancel=:id', cancelOrder);

/** Shipped
 * @openapi
 * /order/shipped=id:
 *     patch:
 *       tags:
 *         - Order
 *       description: Order shipped
 *       parameters:
 *         - name: id
 *           in: path
 *           schema:
 *             type: string
 *           required: true
 *           description: Order ID
 *       security:
 *         - bearerToken: []
 *       responses:
 *         '200':
 *           description: Successful operation
*/
router.patch('/shipped=:id', shippedOrder);

/** Update item
 * @openapi
 * /order/updateitem=orderId;itemId:
 *     patch:
 *       tags:
 *         - Order
 *       description: Update item by item ID and order ID
 *       parameters:
 *         - name: orderId
 *           in: path
 *           schema:
 *             type: string
 *           required: true
 *           description: Order ID
 *         - name: itemId
 *           in: path
 *           schema:
 *             type: string
 *           required: true
 *           description: Item ID
 *       requestBody:
 *          content:
 *             application/json:
 *               schema:
 *                   type: object
 *                   properties:
 *                     observations:
 *                       type: string
 *                     quantity:
 *                       type: number
 *       security:
 *         - bearerToken: []
 *       responses:
 *         '200':
 *           description: Successful operation
*/
router.patch('/updateitem=:orderId;:itemId', updateOrderItem);

/** Delete item
 * @openapi
 * /order/deleteitem=orderId;itemId:
 *     delete:
 *       tags:
 *         - Order
 *       description: Delete item by item ID and order ID
 *       parameters:
 *         - name: orderId
 *           in: path
 *           schema:
 *             type: string
 *           required: true
 *           description: Order ID
 *         - name: itemId
 *           in: path
 *           schema:
 *             type: string
 *           required: true
 *           description: Item ID
 *       security:
 *         - bearerToken: []
 *       responses:
 *         '200':
 *           description: Successful operation
*/
router.delete('/deleteitem=:orderId;:itemId', deleteOrderItem);

/** Get all
 * @openapi
 * /order:
 *     get:
 *       tags:
 *         - Order
 *       description: Get all active orders
 *       security:
 *         - bearerToken: []
 *       responses:
 *         '200':
 *           description:
 *           content:
 *             application/json:
 *               schema:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       address_name:
 *                         type: string
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 *                       total_price:
 *                         type: number
 *                       delivery_id:
 *                         type: string
 *                       owner:
 *                         type: string
 *                       owner_id:
 *                         type: string
 *                       observations:
 *                         type: string
 *                       state:
 *                         type: boolean
 *                       date:
 *                         type: string
 *                       taken:
 *                         type: boolean
 *                       canceled:
 *                         type: boolean
*/
router.get('', getAll);

/** add Item
 * @openapi
 * /order/item.add=id:
 *     post:
 *       tags:
 *         - Order
 *       description: Add a new item to a existing order by the order's ID
 *       parameters:
 *         - name: id
 *           in: path
 *           schema:
 *             type: string
 *           required: true
 *           description: Order ID
 *       requestBody:
 *          content:
 *             application/json:
 *               schema:  
 *                 type: object
 *                 properties:
 *                    item_desc:
 *                      type: string
 *                    item_id:
 *                      type: string
 *                    observations:
 *                      type: string
 *                    quantity:
 *                      type: number
 *                    unit_price:
 *                      type: number 
 *       security:
 *         - bearerToken: []
 *       responses:
 *         '200':
 *           content:
 *             application/json:
 *               schema:
 *                  type: object
 *                  properties:
 *                     id:
 *                       type: string
 *                     item_desc:
 *                       type: string
 *                     item_id:
 *                       type: string
 *                     observations:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     unit_price:
 *                       type: number              
*/
router.post('/item.add=:id', addOrderItem);

/** Get items
 * @openapi
 * /order/getItems=id:
 *     get:
 *       tags:
 *         - Order
 *       description: Get the list of an order items by the order ID provided
 *       parameters:
 *         - name: id
 *           in: path
 *           schema:
 *             type: string
 *           required: true
 *           description: Order ID
 *       security:
 *         - bearerToken: []
 *       responses:
 *         '200':
 *           content:
 *             application/json:
 *               schema:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                       id:
 *                         type: string
 *                       item_desc:
 *                         type: string
 *                       item_id:
 *                         type: string                   
 *                       quantity:
 *                         type: number
 *                       unit_price:
 *                         type: number              
*/
router.get('/getItems=:id', getItemsByOrder);

/** Get By User
 * @openapi
 * /getOrdersByUser:
 *     get:
 *       tags:
 *         - Order
 *       description: Get active orders by user
 *       security:
 *         - bearerToken: []
 *       responses:
 *         '200':
 *           description:
 *           content:
 *             application/json:
 *               schema:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       address_name:
 *                         type: string
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 *                       total_price:
 *                         type: number
 *                       delivery_id:
 *                         type: string
 *                       owner:
 *                         type: string
 *                       owner_id:
 *                         type: string
 *                       observations:
 *                         type: string
 *                       state:
 *                         type: boolean
 *                       date:
 *                         type: string
 *                       taken:
 *                         type: boolean
 *                       canceled:
 *                         type: boolean
*/
router.get('/getOrdersByUser', GetOrdersByUser);
module.exports = {
    routes: router
}