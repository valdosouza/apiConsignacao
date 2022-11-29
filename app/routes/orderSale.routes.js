const { Router } = require("express");
  
const ordersale =  require("../endpoint/orderBonus.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     OrderSale:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - tb_order_id
 *         - tb_user_id
 *         - dt_record
 *         - tb_customer_id
 *         - tb_salesman_id
 *         - status 
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         tb_order_id:
 *           type: integer
 *         tb_user_id:
 *           type: integer
 *         tb_customer_id:
 *           type: integer
 *         name_customer:
 *           type: string
 *         tb_salesman_id:
 *           type: integer
 *         name_salesman:
 *           type: string 
 *         dt_record:
 *           type: string
 *         note:
 *           type: string  
 *         status:
 *           type: string
 * 
 *     OrderStockAdjustment:
 *       type: object
 *       required:
 *         - tb_product_id
 *         - unit_value
 *         - quantity
 *       properties:
 *         tb_product_id:
 *           type: integer
 *         unit_value:
 *           type: number
 *         quantity:
 *           type: number
 * 
 *     OrderStockAdjustmentMain:
 *       type: object
 *       properties:
 *         Order:
 *           $ref: '#/components/schemas/OrderSale'
 *         Items:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/OrderSaleItem'
 */
 
 
 /**
  * @swagger
  * tags:
  *   name: OrderSale
  *   description: The OrderSale managing API
  */

/**
 * @swagger
 * /ordersale:
 *   post:
 *     summary: Create a new ordersale
 *     tags: [OrderSale]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderSaleMain'
 *     responses:
 *       200:
 *         description: The OrderSale was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderSale'
 *       500:
 *         description: Some server error
 */
 router.post("/", ordersale.create);

 /**
 * @swagger
 * /ordersale/getlist/{tb_institution_id}/{tb_order_id}:
 *   get:
 *     summary: Returns the list of all the OrderSales
 *     tags: [OrderSale]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_order_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The ordersale tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the payment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderSaleMain'
 */

router.get("/getlist/:tb_institution_id/:tb_order_id", ordersale.getList);
  
/**
 * @swagger
 * /ordersale/get/{tb_institution_id}/{tb_order_id}/{id}:
 *   get:
 *     summary: Returns the OrderSale
 *     tags: [OrderSale]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_order_id
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The ordersale by tb_institution_id and....
 *     responses:
 *       200:
 *         description: The OrderSale
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderSaleMain'
 */

 router.get("/get/:tb_institution_id/:tb_order_id/:id", ordersale.get);
 
 /**
 * @swagger
 * /ordersale:
 *  put:
 *    summary: Update the ordersale by the id
 *    tags: [OrderSale]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/OrderSaleMain'
 *    responses:
 *      200:
 *        description: The OrderSale was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderSale'
 *      404:
 *        description: The ordersale was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", ordersale.update);

/**
 * @swagger
 * /ordersale/{tb_institution_id}/{tb_order_id}/{id}:
 *  delete:
 *    summary: Delete the ordersale by the id
 *    tags: [OrderSale]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_order_id
 *      - in: path
 *        name: id 
 *        schema:
 *          type: string
 *        required: true
 *        description: The ordersale id
 *    responses:
 *      200:
 *        description: The OrderSale was deleted
 *      404:
 *        description: The ordersale was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/:tb_institution_id/:tb_order_id/:id", ordersale.delete);

module.exports = router;