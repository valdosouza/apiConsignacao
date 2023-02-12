const express = require('express');
const  cashier = require('../endpoint/cashier.endpoint.js');
const { withJWTAuthMiddleware } = require('express-kun');
const router = express.Router();
const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

/**
 * @swagger
 * components:
 *   schemas:
 *     Cashier:
 *       type: object
 *       required:
 *         - tb_institution_id
 *         - tb_user_id
 *       properties:
 *         tb_institution_id:
 *           type: integer
 *         tb_user_id:
 *           type: integer
 * 
 *     CashierStatus:
 *       type: object
 *       properties:
 *         tb_institution_id:
 *           type: integer
 *         tb_user_id:
 *           type: integer
 *         dt_record:
 *           type: string
 *         open:
 *           type: string
 * 
 *     CashierAnswer:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *         message:
 *           type: string  
 *         
 *     CashierClosureItem:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *         tag_value:
 *           type: number
 *         kind:
 *           type: string
 * 
 *     CashierClosure:
 *       type: object
 *       properties:
 *         dt_record:
 *           type: string
 *         tb_institution_id:
 *           type: integer
 *         tb_user_id:
 *           type: integer   
 *         items:
 *           type: array
 *           items:
 *            $ref: '#/components/schemas/CashierClosureItem'
 * 
 *     ListOfCashierClosure:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         dt_record:
 *           type: string 
 * 
 * 
 *     BalanceOfCashierItem:
 *       type: object
 *       properties:
 *         name_payment_type:
 *           type: string
 *         balance_value:
 *           type: number
 * 
 *  
 *     BalanceOfCashier:
 *       type: object
 *       properties:
 *         dt_record:
 *           type: string  
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BalanceOfCashierItem'
 */

/**
 * @swagger
 * tags:
 *   name: Cashier
 *   description: The Persons managing API
 */

/**
 * @swagger
 * /cashier/isopen/{tb_institution_id}/{tb_user_id}:
 *   get:
 *     summary: Returns whether is cashier is open or not
 *     tags: [Cashier]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true 
 *      - in: path
 *        name: tb_user_id
 *        required: true  
 *     responses:
 *       200:
 *         description: The cashier Status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashierStatus'
 */

router.get("/isopen/:tb_institution_id/:tb_user_id/", cashier.isOpen);

 /**
 * @swagger
 * /cashier/closure:
 *  post:
 *    summary: Update the Cashier by the id
 *    tags: [Cashier]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CashierClosure'
 *    responses:
 *      200:
 *        description: The Items Cashier Closuer was inserted 
 *      404:
 *        description: The Cashier was not found
 *      500:
 *        description: Some error happened
 */
  router.post("/closure/", cashier.closure);

/**
 * @swagger
 * /cashier/closure/getforclosure/{tb_institution_id}/{tb_user_id}/{dt_record}:
 *  get:
 *    summary: Get data for Closure
 *    tags: [Cashier]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true
 *      - in: path
 *        name: tb_user_id
 *        required: true
 *      - in: path
 *        name: dt_record
 *        required: true
 *    responses:
 *      200:
 *        description: The data for  Closure was listed successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CashierClosure'
 *      404:
 *        description: The Cashier was not found
 *      500:
 *        description: Some error happened
 */
router.get("/closure/getforclosure/:tb_institution_id/:tb_user_id/:dt_record/", cashier.getForClosure);

/**
 * @swagger
 * /cashier/closure/get/{tb_institution_id}/{tb_user_id}/{dt_record}:
 *  get:
 *    summary: get Cashier Closure
 *    tags: [Cashier]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true
 *      - in: path
 *        name: tb_user_id
 *        required: true
 *      - in: path
 *        name: dt_record
 *        required: true
 *    responses:
 *      200:
 *        description: The Cashier Closure was listed successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CashierClosure'
 *      404:
 *        description: The Cashier was not found
 *      500:
 *        description: Some error happened
 */
router.get("/closure/get/:tb_institution_id/:tb_user_id/:dt_record/", cashier.get);

/**
 * @swagger
 * /cashier/closure/getlist/{tb_institution_id}/{tb_user_id}:
 *  get:
 *    summary: Get List of Closures by user
 *    tags: [Cashier]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true
 *      - in: path
 *        name: tb_user_id
 *        required: true
 *    responses:
 *      200:
 *        description: The List of Cashier Closure was lited successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ListOfCashierClosure' 
 *      404:
 *        description: The Cashier was not found
 *      500:
 *        description: Some error happened
 */
router.get("/closure/getlist/:tb_institution_id/:tb_user_id/", cashier.getlist);

/**
 * @swagger
 * /cashier/balance/get/{tb_institution_id}/{tb_user_id}/{dt_record}:
 *   get:
 *     summary: Returns the balance of cashier
 *     tags: [Cashier]
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
 *         description: The balance of cashier
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BalanceOfCashier'
 */

router.get("/balance/get/:tb_institution_id/:tb_user_id/:dt_record/", cashier.getBalance);


module.exports = router;  