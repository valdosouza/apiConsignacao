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
 */

 /**
  * @swagger
  * tags:
  *   name: Cashier
  *   description: The Persons managing API
  */

/**
 * @swagger
 * /cashier/open:
 *   post:
 *     summary: Create a new Cashier
 *     tags: [Cashier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cashier'
 *     responses:
 *       200:
 *         description: The Cashier was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashierAnswer'
 *       500:
 *         description: Some server error
 */
 router.post("/open", cashier.open);
 
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
 * /cashier/closure/get/{tb_institution_id}/{tb_user_id}/{dt_record}:
 *  get:
 *    summary: Update the Cashier by the id
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
 *        description: The Cashier Closure was lited successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CashierClosure'
 *      404:
 *        description: The Cashier was not found
 *      500:
 *        description: Some error happened
 */
router.get("/closure/get/:tb_institution_id/:tb_user_id/:dt_record", cashier.get);

module.exports = router;  