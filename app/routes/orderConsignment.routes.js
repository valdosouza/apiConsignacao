const { Router } = require("express");
  
const orderconsignment =  require("../endpoint/orderConsignment.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     OrderConsignmentCheckPoint:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - tb_customer_id
 *         - total_value
 *         - change_value
 *         - previous_debit_balance
 *         - current_debit_balance
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         tb_customer_id:
 *           type: integer 
 *         name_customer:
 *           type: string
 *         total_value:
 *           type: number
 *         change_value:
 *           type: number
 *         previous_debit_balance:
 *           type: number
 *         current_debit_balance:
 *           type: number 
 *     
 *     OrderConsignmentItemCheckPoint:
 *       type: object
 *       required:
 *         - tb_product_id
 *         - name_product
 *         - bonus
 *         - qty_consigned
 *         - leftover
 *         - qty_sold
 *         - unit_value
 *       properties:
 *         tb_product_id:
 *           type: integer
 *         bonus:
 *           type: number
 *         qty_consigned:
 *           type: number 
 *         leftover:
 *           type: number
 *         qty_sold:
 *           type: number
 *         unit_value:
 *           type: number 
 * 
 *     OrderConsignmentItemPayment:
 *       type: object
 *       required:
 *         - tb_payment_type_id
 *         - description
 *         - value
 *       properties:
 *         tb_payment_type_id:
 *           type : integer
 *         name_payment_type:
 *           type: string
 *         value:
 *           type: number
 *  
 *     OrderConsignmentCheckPointMain:
 *       type: object
 *       properties:
 *         Order:
 *           $ref: '#/components/schemas/OrderConsignmentCheckPoint'
 *         Items:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/OrderConsignmentItemCheckPoint'
 *         Payments:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/OrderConsignmentItemPayment'
 * 
 *     OrderConsignmentSupplying:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - tb_customer_id
 *         - current_debit_balance 
 * 
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         tb_customer_id:
 *           type: integer 
 *         name_customer:
 *           type: string 
 *         current_debit_balance:
 *           type: number   
 *       
 *     OrderConsignmentItemSupplying:
 *       type: object
 *       required:
 *         - tb_product_id
 *         - name_product
 *         - bonus
 *         - leftover
 *         - devolution
 *         - new_consignment
 *         - qty_consigned
 *         - unit_value 
 * 
 *       properties:
 *         tb_product_id:
 *           type: integer
 *         name_product:
 *           type: integer  
 *         bonus:
 *           type: number
 *         leftover:
 *           type: number
 *         devolution:
 *           type: number
 *         new_consignment:
 *           type: number
 *         qty_consigned:
 *           type: number   
 *         unit_value:
 *           type: number   
 * 
 *     OrderConsignmentSupplyingMain:
 *       type: object
 *       properties:
 *         Order:
 *           $ref: '#/components/schemas/OrderConsignmentSupplying'
 *         Items:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/OrderConsignmentItemSupplying' 
 * 
 */
 
 
 /**
  * @swagger
  * tags:
  *   name: OrderConsignment
  *   description: The OrderConsignment managing API
  */

/**
 * @swagger
 * /orderconsignment/checkpoint:
 *   post:
 *     summary: Create a new Order Consignment - CheckPoint
 *     tags: [OrderConsignment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderConsignmentCheckPointMain'
 *     responses:
 *       200:
 *         description: The OrderConsignment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderConsignmentCheckPointMain'
 *       500:
 *         description: Some server error
 */
router.post("/checkpoint", orderconsignment.saveCheckpoint);

/**
 * @swagger
 * /orderconsignment/supplying:
 *   post:
 *     summary: Create a new Order Consignment - Supplying
 *     tags: [OrderConsignment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderConsignmentSupplyingMain'
 *     responses:
 *       200:
 *         description: The OrderConsignment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderConsignmentSupplyingMain'
 *       500:
 *         description: Some server error
 */
router.post("/supplying", orderconsignment.saveSupplying);
  
/**
 * @swagger
 * /orderconsignment/checkpoint/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the OrderConsignment CheckPoint
 *     tags: [OrderConsignment]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderconsignment CheckPoint by tb_institution_id and id
 *     responses:
 *       200:
 *         description: The OrderConsignment CheckPoint 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderConsignmentCheckPointMain'
 */

 router.get("/checkpoint/get/:tb_institution_id/:id", orderconsignment.getCheckpoint);

/**
 * @swagger
 * /orderconsignment/supplying/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the OrderConsignment Supplying
 *     tags: [OrderConsignment]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderconsignment Supplyng by tb_institution_id and id
 *     responses:
 *       200:
 *         description: The OrderConsignment Supplying
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderConsignmentSupplyingMain'
 */

router.get("/supplying/get/:tb_institution_id/:id", orderconsignment.getSupplying);

/**
 * @swagger
 * /orderconsignment/getlast/{tb_institution_id}/{tb_customer_id}:
 *   get:
 *     summary: Returns the Last Supplying made at the Order  Consignament 
 *     tags: [OrderConsignment]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_customer_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderconsignment Supplyng by tb_institution_id and tb_customer_id
 *     responses:
 *       200:
 *         description: The OrderConsignment Supplying
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderConsignmentSupplyingMain'
 */

router.get("/getlast/:tb_institution_id/:tb_customer_id", orderconsignment.getLast);

module.exports = router;