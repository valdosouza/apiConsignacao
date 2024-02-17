const { Router } = require("express");
  
const ordersale =  require("../endpoint/orderSale.endpoint.js");

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
 *         tb_user_id:
 *           type: integer
 *         number:
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
 *     OrderSaleItems:
 *       type: object
 *       required:
 *         - tb_product_id
 *         - unit_value
 *         - quantity 
 *       properties:
 *         id:
 *           type: integer 
 *         tb_stock_list_id:
 *           type: integer
 *         name_stock_list:
 *           type: string  
 *         tb_price_list_id:
 *           type: integer
 *         name_price_list:
 *           type: string  
 *         tb_product_id:
 *           type: integer
 *         unit_value:
 *           type: number
 *         quantity:
 *           type: number
 *         update_status:
 *           type: string
 * 
 * 
 *     OrderSaleMain:
 *       type: object
 *       properties:
 *         order:
 *           $ref: '#/components/schemas/OrderSale'
 *         items:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/OrderSaleItems'
 * 
 * 
 *     OrderSaleMainCard:
 *       type: object
 *       properties:
 *         order:
 *           $ref: '#/components/schemas/OrderSale'
 *         items:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/OrderSaleCard'
 *         Payments:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/OrderPaid' 
 * 
 *     OrderSaleCard:
 *       type: object
 *       required:
 *         - tb_product_id
 *         - name_product
 *         - bonus
 *         - sale
 *         - unit_value
 *       properties:
 *         tb_product_id:
 *           type: integer
 *         name_product:
 *           type: string
 *         bonus:
 *           type: number
 *         sale:
 *           type: number 
 *         unit_value:
 *           type: number 
 * 
 *     orderSaleParams:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         tb_institution_id:
 *           type: integer 
 *         tb_salesman_id:
 *           type: integer 
 *         number:
 *           type: integer
 *         tb_customer_id:
 *           type: integer
 *         nick_trade:
 *           type: string 
 *         tb_region_id:
 *           type: integer
 *         name_region:
 *           type: string  
 *         date_initial:
 *           type: string
 *         date_final:
 *           type: string  
 * 
 *     saleAverage:
 *       type: object
 *       properties:
 *         tb_customer_id:
 *           type: integer
 *         name_customer:
 *           type: string  
 *         total_value:
 *           type: double
 *         tag_value:
 *           type: double
 *         number_of_sales:
 *           type: integer
 * 
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
* /ordersale/getlist/:
*   post:
*     summary: Returns the list of all the OrderSale
*     tags: [OrderSale]
*     requestBody:
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/orderSaleParams'
*     responses:
*       200:
*         description: The list of the payment types
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/orderSale'
*/
router.post("/getlist", ordersale.getList);
  

/**
 * @swagger
 * /ordersale/get/{tb_institution_id}/{tb_order_id}:
 *   get:
 *     summary: Returns the OrderSale
 *     tags: [OrderSale]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_order_id
 *     responses:
 *       200:
 *         description: The OrderSale
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderSaleMain'
 */

 router.get("/get/:tb_institution_id/:tb_order_id", ordersale.get);
 
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
 * /ordersale/{tb_institution_id}/{tb_order_id}:
 *  delete:
 *    summary: Delete the ordersale by the id
 *    tags: [OrderSale]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true
 *      - in: path
 *        name: tb_order_id
 *        required: true 
 *    responses:
 *      200:
 *        description: The OrderSale was deleted
 *      404:
 *        description: The ordersale was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/:tb_institution_id/:tb_order_id", ordersale.delete);

/**
 * @swagger
 * /ordersale/card:
 *   post:
 *     summary: Create a new ordersale card
 *     tags: [OrderSale]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderSaleMainCard'
 *     responses:
 *       200:
 *         description: The OrderSale card was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderSale'
 *       500:
 *         description: Some server error
 */
router.post("/card", ordersale.saveByCard);

 /**
 * @swagger
 * /ordersale/card/newlist/{tb_institution_id}/{tb_price_list_id}:
 *   get:
 *     summary: Returns the list of items of card
 *     tags: [OrderSale]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true 
 *      - in: path
 *        name: tb_price_list_id
 *        required: true  
 *     responses:
 *       200:
 *         description: The list of Items of card
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderSaleCard'
 */

 router.get("/card/newlist/:tb_institution_id/:tb_price_list_id/", ordersale.getNewOrderSaleCard);

 /**
 * @swagger
 * /ordersale/card/get/{tb_institution_id}/{tb_order_id}:
 *   get:
 *     summary: Returns a orderSaleCard
 *     tags: [OrderSale]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true 
 *      - in: path
 *        name: tb_order_id
 *        required: true  
 *     responses:
 *       200:
 *         description: Returns a orderSaleCard
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderSaleCard'
 */

 router.get("/card/get/:tb_institution_id/:tb_order_id/", ordersale.getOrderSaleCard);

/**
 * @swagger
 * /ordersale/average/getlist:
 *   post:
 *     summary: Create a new ordersale
 *     tags: [OrderSale]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/orderSaleParams'
 *     responses:
 *       200:
 *         description: The OrderSale was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/saleAverage'
 *       500:
 *         description: Some server error
 * 
 */
router.post("/average/getlist", ordersale.getSaleAverage);


module.exports = router;