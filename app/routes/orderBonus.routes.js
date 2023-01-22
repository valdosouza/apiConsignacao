const { Router } = require("express");
  
const orderbonus =  require("../endpoint/orderBonus.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     OrderBonus:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - tb_user_id
 *         - tb_customer_id
 *         - tb_salesman_id
 *         - dt_record
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         tb_user_id:
 *           type: integer
 *         dt_record:
 *           type: string
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
 *         note:
 *           type: string 
 *         status:
 *           type: string
 *  
 *     OrderBonusList:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_user_id:
 *           type: integer
 *         dt_record:
 *           type: string
 *         number:
 *           type: integer
 *         tb_customer_id:
 *           type: integer
 *         name_customer:
 *           type: string 
 *         status:
 *           type: string
 * 
 *     OrderBonusItem:
 *       type: object
 *       required:
 *         - tb_product_id
 *         - unit_value
 *         - quantity
 *       properties:
 *         tb_product_id:
 *           type: integer
 *         name_product:
 *           type: string
 *         unit_value:
 *           type: number
 *         quantity:
 *           type: number
 * 
 *     OrderStockAdOperation:
 *       type: object
 *       required:
 *         - tb_institution_id
 *         - tb_order_id 
 *         - dt_record
 *         - direction 
 *       properties:
 *         tb_institution_id:
 *           type: integer
 *         id:
 *           type: integer
 *         dt_record:
 *           type: string 
 *
 *     OrderBonusMain:
 *       type: object
 *       properties:
 *         Order:
 *           $ref: '#/components/schemas/OrderBonus'
 *         Items:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/OrderBonusItem'
 */
 
 
 /**
  * @swagger
  * tags:
  *   name: OrderBonus
  *   description: The OrderBonus managing API
  */

/**
 * @swagger
 * /orderbonus:
 *   post:
 *     summary: Create a new orderbonus
 *     tags: [OrderBonus]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderBonusMain'
 *     responses:
 *       200:
 *         description: The OrderBonus was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderBonusMain'
 *       500:
 *         description: Some server error
 */
  //router.post("/", orderbonus.create);
  protectedRouter.post("/", orderbonus.create);

 /**
 * @swagger
 * /orderbonus/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the OrderBonuss
 *     tags: [OrderBonus]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderbonus tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the Bonus
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderBonusList'
 */
  //router.get("/getlist/:tb_institution_id", orderbonus.getList);
  protectedRouter.get("/getlist/:tb_institution_id", orderbonus.getList);
/**
 * @swagger
 * /orderbonus/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the OrderBonus
 *     tags: [OrderBonus]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Order Bonus by tb_institution_id and id
 *     responses:
 *       200:
 *         description: The OrderBonus
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderBonusMain'
 */
  //router.get("/get/:tb_institution_id/:id", orderbonus.get);
  protectedRouter.get("/get/:tb_institution_id/:id", orderbonus.get);
 /**
 * @swagger
 * /orderbonus:
 *  put:
 *    summary: Update the orderbonus by the id
 *    tags: [OrderBonus]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/OrderBonusMain'
 *    responses:
 *      200:
 *        description: The OrderBonus was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderBonusMain'
 *      404:
 *        description: The orderbonus was not found
 *      500:
 *        description: Some error happened
 */
  //router.put("/", orderbonus.update);
  protectedRouter.put("/", orderbonus.update);
/**
 * @swagger
 * /orderbonus/{tb_institution_id}/{id}:
 *  delete:
 *    summary: Delete the orderbonus by the id
 *    tags: [OrderBonus]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: id 
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderbonus id
 *    responses:
 *      200:
 *        description: The OrderBonus was deleted
 *      404:
 *        description: The orderbonus was not found
 *      500:
 *        description: Some error happened
 */
  //router.delete("/:tb_institution_id/:id", orderbonus.delete);
  protectedRouter.delete("/:tb_institution_id/:id", orderbonus.delete);
/**
 * @swagger
 * /orderbonus/closure:
 *   post:
 *     summary: Close status Order Bonus
 *     tags: [OrderBonus]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderStockAdOperation'
 *     responses:
 *       200:
 *         description: The OrderBonus was closed
 *       201:
 *         description: The OrderBonus is already closed
 *       404:
 *         description: The Order Bonus was not found
 *       500:
 *         description: Some error happened
 */
  
  protectedRouter.post("/closure/", orderbonus.closure);
 /**
  * @swagger
  * /orderbonus/reopen:
  *   post:
  *     summary: Reopen Status Order Bonus
  *     tags: [OrderBonus]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/OrderStockAdOperation'
  *     responses:
  *       200:
  *         description: The OrderBonus was open
  *       201:
  *         description: The OrderBonus is already open
  *       404:
  *         description: The Order Bonus was not found
  *       500:
  *         description: Some error happened
  */
  //router.post("/reopen/", orderbonus.reopen);     
  protectedRouter.post("/reopen/", orderbonus.reopen);     
module.exports = router;