const express = require('express');
const  cashier = require('./endpoint.js');
const { withJWTAuthMiddleware } = require('express-kun');
const router = express.Router();
const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

/**
 * @swagger
 * components:
 *   schemas:
 *     CashierStatementSummaryGet:
 *       type: object
 *       properties:
 *         tb_institution_id:
 *           type: integer
 *         month:
 *           type: integer
 *         year:
 *           type: integer
 *         tb_salesman_id:
 *           type: integer 
 *         salesman_name:
 *           type: string   
 *   
 *     CashierStatementSummaryProduct:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         description:
 *           type: string
 *         value:
 *           type: number
 *  
 *     CashierStatementSummaryAnswer:
 *       type: object
 *       properties:
 *         day:
 *           type: integer
 *         week_day:
 *           type: string
 *         product_list:
 *           type: array
 *           items:
 *            $ref: '#/components/schemas/CashierStatementSummaryProduct'
 *         old_debit:
 *           type: number  
 *         debit_balance:
 *           type: number  
 *         total_received:
 *           type: number  
 * 
 */

/**
 * @swagger
 * tags:
 *   name: CashierStatementSummary
 *   description: The Cashier Statement managing API
 */

/**
 * @swagger
 * /cashierstatementsummary/get:
 *   post:
 *     summary: List a summary of cashier
 *     tags: [CashierStatementSummary]
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CashierStatementSummaryGet'
 *     responses:
 *       200:
 *         description: The Cashier Summary was successfully listed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashierStatementSummaryAnswer'
 *       500:
 *         description: Some server error
 */
router.post("/get", cashier.get);


module.exports = router;  