const { Router } = require("express");
  
const orderconsignment =  require("../endpoint/orderConsignment.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     OrderConsignment:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - tb_order_id
 *         - tb_user_id
 *         - tb_customer_id
 *         - tb_salesman_id
 *         - dt_record
 *         - direction
 *         - kind
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
 *         tb_salesman_id:
 *           type: integer
 *         dt_record:
 *           type: string
 *         direction:
 *           type: string
 *         kind:
 *           type: string
 *     
 *     OrderConsignmentItem:
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
 *     OrderConsignmentMain:
 *       type: object
 *       properties:
 *         Order:
 *           $ref: '#/components/schemas/OrderConsignment'
 *         Items:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/OrderConsignmentItem'
*/
 
 
 /**
  * @swagger
  * tags:
  *   name: OrderConsignment
  *   description: The OrderConsignment managing API
  */

/**
 * @swagger
 * /orderconsignment:
 *   post:
 *     summary: Create a new orderconsignment
 *     tags: [OrderConsignment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderConsignmentMain'
 *     responses:
 *       200:
 *         description: The OrderConsignment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderConsignmentMain'
 *       500:
 *         description: Some server error
 */
 router.post("/", orderconsignment.create);

 /**
 * @swagger
 * /orderconsignment/getlist/{tb_institution_id}/{tb_order_id}:
 *   get:
 *     summary: Returns the list of all the OrderConsignments
 *     tags: [OrderConsignment]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_order_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderconsignment tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the payment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderConsignmentMain'
 */

router.get("/getlist/:tb_institution_id/:tb_order_id", orderconsignment.getList);
  
/**
 * @swagger
 * /orderconsignment/get/{tb_institution_id}/{tb_order_id}/{id}:
 *   get:
 *     summary: Returns the OrderConsignment
 *     tags: [OrderConsignment]
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
 *        description: The orderconsignment by tb_institution_id and....
 *     responses:
 *       200:
 *         description: The OrderConsignment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderConsignmentMain'
 */

 router.get("/get/:tb_institution_id/:tb_order_id/:id", orderconsignment.get);

module.exports = router;