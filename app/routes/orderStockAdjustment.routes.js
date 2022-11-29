const { Router } = require("express");
  
const orderstockadjustment =  require("../endpoint/orderBonus.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     OrderStockAdjustment:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - tb_order_id
 *         - tb_user_id
 *         - dt_record
 *         - tb_entity_id
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
 *         tb_entity_id:
 *           type: integer
 *         name_entity:
 *           type: string
 *         dt_record:
 *           type: string
 *         note:
 *           type: string  
 *         status:
 *           type: string
 * 
 *     OrderStockAdjustmentItem:
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
 *           $ref: '#/components/schemas/OrderStockAdjustment'
 *         Items:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/OrderStockAdjustmentItem'
 */
 
 
 /**
  * @swagger
  * tags:
  *   name: OrderStockAdjustment
  *   description: The OrderStockAdjustment managing API
  */

/**
 * @swagger
 * /orderstockadjustment:
 *   post:
 *     summary: Create a new orderstockadjustment
 *     tags: [OrderStockAdjustment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderStockAdjustmentMain'
 *     respoStockAdjustment:
 *       200:
 *         description: The OrderStockAdjustment was suStockAdjustmentsfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderStockAdjustmentMain'
 *       500:
 *         description: Some server error
 */
 router.post("/", orderstockadjustment.create);

 /**
 * @swagger
 * /orderstockadjustment/getlist/{tb_institution_id}/{tb_order_id}:
 *   get:
 *     summary: Returns the list of all the OrderStockAdjustment
 *     tags: [OrderStockAdjustment]
 *     parameters:
 *      - in: path
 *        name: tb_institutiStockAdjustmentd
 *      - in: path
 *        name: tb_order_id
 *        schema:
 *          type: sStockAdjustmentg
 *        required: true
 *        description: The orderstockadjustment tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the payment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderStockAdjustmentMain/'
 */

router.get("/getlist/:tb_institution_id/:tb_order_id", orderstockadjustment.getList);
  
/**
 * @swagger
 * /orderstockadjustment/get/{tb_institution_id}/{tb_order_id}/{id}:
 *   get:
 *     summary: Returns the OrderStockAdjustment
 *     tags: [OrderStockAdjustment]
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
 *        description: The orderstockadjustment by tb_institution_id and....
 *     responses:
 *       200:
 *         description: The OrderStockAdjustment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderStockAdjustmentMain'
 */

 router.get("/get/:tb_institution_id/:tb_oStockAdjustment_id/:id", orderstockadjustment.get);

 /**
 * @swagger
 * /orderstockadjustment:
 *  put:
 *    summary: Update the orderstockadjustment by the id
 *    tags: [OrderStockAdjustment]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/OrderStockAdjustmentMain'
 *    responses:
 *      200:
 *        description: The OrderStockAdjustment was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderStockAdjustment'
 *      404:
 *        description: The orderstockadjustment was not found
 *      500:
 *        description: Some error happened
 */
  router.put("/", orderstockadjustment.update);

  /**
   * @swagger
   * /orderstockadjustment/{tb_institution_id}/{tb_order_id}/{id}:
   *  delete:
   *    summary: Delete the orderstockadjustment by the id
   *    tags: [OrderStockAdjustment]
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
   *        description: The orderstockadjustment id
   *    responses:
   *      200:
   *        description: The OrderStockAdjustment was deleted
   *      404:
   *        description: The orderstockadjustment was not found
   *      500:
   *        description: Some error happened
   */
  router.delete("/:tb_institution_id/:tb_order_id/:id", orderstockadjustment.delete);
  

module.exports = router;  
