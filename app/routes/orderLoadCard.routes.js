const { Router } = require("express");
  
const orderloadcard =  require("../endpoint/orderLoadCard.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     OrderLoadCardMain:
 *       type: object
 *       required:
 *         - tb_institution_id
 *         - tb_user_id
 *         - dt_record
 *       properties:
 *         id:
 *           type: integer 
 *         tb_institution_id:
 *           type: integer
 *         tb_user_id:
 *           type: integer
 *         name_name:
 *           type: string  
 *         dt_record:
 *           type: string 
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderLoadCard'   
 * 
 * 
 *     OrderLoadCard:
 *       type: object
 *       properties:
 *         tb_product_id:
 *           type: integer
 *         name_product:
 *           type: string
 *         stock_balance:
 *           type: number
 *         sale:
 *           type: number
 *         bonus:
 *           type: number
 *         adjust:
 *           type: number
 *         new_load:
 *           type: number 
 * 
 *     OrderLoadCardList:
 *       type: object
 *       required:
 *         - tb_institution_id
 *         - tb_user_id
 *       properties:
 *         id:
 *           type: integer 
 *         tb_institution_id:
 *           type: integer
 *         tb_user_id:
 *           type: integer
 *         user_name:
 *           type: String  
 *         dt_record:
 *           type: string 
 * 
 */
 
 
/**
 * @swagger
 * tags:
 *   name: OrderLoadCard
 *   description: The OrderLoadCard managing API
 */

/**
 * @swagger
 * /orderloadcard:
 *   post:
 *     summary: Create a new orderloadcard
 *     tags: [OrderLoadCard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderLoadCardMain'
 *     responses:
 *       200:
 *         description: The OrderLoadCard was successfully created
 *       500:
 *         description: Some server error
 */
 router.post("/", orderloadcard.create);

 /**
 * @swagger
 * /orderloadcard/closure:
 *   post:
 *     summary: Closure the status orderloadcard
 *     tags: [OrderLoadCard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderLoadCardMain'
 *     responses:
 *       200:
 *         description: The OrderLoadCard was successfully closured
 *       500:
 *         description: Some server error
 */
router.post("/closure/", orderloadcard.closure);

/**
 * @swagger
 * /orderloadcard/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of items of locad card
 *     tags: [OrderLoadCard]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true 
 *     responses:
 *       200:
 *         description: The list of Items of card
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderLoadCardMain'
 */
router.get("/getlist/:tb_institution_id", orderloadcard.getlist);

/**
 * @swagger
 * /orderloadcard/getlistByUser/{tb_institution_id}/{tb_user_id}:
 *   get:
 *     summary: Returns the list Load Card by User
 *     tags: [OrderLoadCard]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true 
 *      - in: path
 *        name: tb_user_id
 *        required: true 
 *     responses:
 *       200:
 *         description: The list of Load card by User
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderLoadCardList'
 */

router.get("/getlistByUser/:tb_institution_id/:tb_user_id", orderloadcard.getlistByUser);

/**
 * @swagger
 * /orderloadcard/getByOrder/{tb_institution_id}/{tb_order_id}:
 *   get:
 *     summary: Returns the Load Card by Order ID
 *     tags: [OrderLoadCard]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true 
 *      - in: path
 *        name: tb_order_id
 *        required: true 
 *     responses:
 *       200:
 *         description: The Order Load card by Order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderLoadCardMain'
 */
	router.get("/getByOrder/:tb_institution_id/:tb_order_id", orderloadcard.getByOrder);

/**
 * @swagger
 * /orderloadcard/getByUserDate/{tb_institution_id}/{tb_user_id}/{dt_record}:
 *   get:
 *     summary: Returns the Load Card by Order User and Date
 *     tags: [OrderLoadCard]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true 
 *      - in: path
 *        name: tb_user_id
 *        required: true 
 *      - in: path
 *        name: dt_record
 *        required: true 
 *     responses:
 *       200:
 *         description: The Order Load card by Order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderLoadCardMain'
 */
router.get("/getByUserDate/:tb_institution_id/:tb_user_id/:dt_record", orderloadcard.getByUserDate);

 /**
 * @swagger
 * /orderloadcard/getNewOrder/{tb_institution_id}/{tb_user_id}/{dt_record}:
 *   get:
 *     summary: Returns the list of items of card
 *     tags: [OrderLoadCard]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true 
 *      - in: path
 *        name: tb_user_id
 *        required: true  
 *      - in: path
 *        name: dt_record
 *        required: true   
 *     responses:
 *       200:
 *         description: The list of Items of card
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderLoadCardMain'
 */
  
 router.get("/getNewOrder/:tb_institution_id/:tb_user_id/:dt_record", orderloadcard.getNewOrderLoadCard);



module.exports = router;