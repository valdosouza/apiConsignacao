const { Router } = require("express");
  
const financial =  require("../endpoint/financial.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     FinancialStatement:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *         tag_value:
 *           type: number
 *         kind:
 *           type: string 
 *
 * 
 *     FinancialListCustomerCharged:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name_customer:
 *           type: string
 *         time_attendace:
 *           type: string
 *         value_charged:
 *           type: number   
 * 
 *     FinancialListSalesmanCustomerCharged:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name_salesman:
 *           type: string
 *         value_charged:
 *           type: number   
 *  
 *     FinancialListCustomerOldDebit:
 *       type: object
 *       properties:
 *         dt_record:
 *           type: string
 *         tb_customer_id:
 *           type: integer
 *         name_customer:
 *           type: string
 *         current_debit_balance:
 *           type: number
 * 
 *     CashierStatementParams:
 *       type: object
 *       properties:
 *         tb_institution_id:
 *           type: integer
 *         dt_record:
 *           type: string
 *         tb_customer_id:
 *           type: integer
 *         tb_order_id:
 *           type: integer
 *         tb_salesman_id:
 *           type: integer
 *         name_customer:
 *           type: string
 *         page:
 *           type: integer 
 */
 

 /**
  * @swagger
  * tags:
  *   name: Financial
  *   description: The Financial managing API
  */

 /**
 * @swagger
 * /financial/statement/getbyday/{tb_institution_id}/{tb_user_id}/{date}:
 *   get:
 *     summary: Returns the statement by day/user
 *     tags: [Financial]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_user_id
 *      - in: path
 *        name: date
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       200:
 *         description: The list of the Financial Statement
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FinancialStatement'
 */

router.get("/statement/getbyday/:tb_institution_id/:tb_user_id/:date", financial.getByday);
  
/**
 * @swagger
 * /financial/statement/getbymonth/{tb_institution_id}/{tb_user_id}/{date}:
 *   get:
 *     summary: Returns the statement by day/user
 *     tags: [Financial]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_user_id
 *      - in: path
 *        name: date
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       200:
 *         description: The list of the Financial Statement
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FinancialStatement'
 */

router.get("/statement/getbymonth/:tb_institution_id/:tb_user_id/:date", financial.getByMonth);

/**
 * @swagger
 * /financial/statement/getbycustomer/{tb_institution_id}/{tb_user_id}/{tb_customer_id}/{date}:
 *   get:
 *     summary: Returns the statement by day/user/customer
 *     tags: [Financial]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true 
 *      - in: path
 *        name: tb_user_id
 *        required: true  
 *      - in: path
 *        name: tb_customer_id
 *        required: true
 *      - in: path
 *        name: date
 *        required: true
 *     responses:
 *       200:
 *         description: The list of the Financial Statement
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FinancialStatement'
 */

router.get("/statement/getbycustomer/:tb_institution_id/:tb_user_id/:tb_customer_id/:date", financial.getByDayByCustomer);

/**
 * @swagger
 * /financial/statement/getbyorder/{tb_institution_id}/{tb_user_id}/{tb_order_id}/{date}:
 *   get:
 *     summary: Returns the statement by day/user/customer
 *     tags: [Financial]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true 
 *      - in: path
 *        name: tb_user_id
 *        required: true  
 *      - in: path
 *        name: tb_order_id
 *        required: true
 *      - in: path
 *        name: date
 *        required: true
 *     responses:
 *       200:
 *         description: The list of the Financial Statement
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FinancialStatement'
 */

router.get("/statement/getbyorder/:tb_institution_id/:tb_user_id/:tb_order_id/:date", financial.getByOrder);

/**
 * @swagger
 * /financial/customer/charged/getlist/{tb_institution_id}/{tb_user_id}/{date}:
 *   get:
 *     summary: Returns the list of customers charged
 *     tags: [Financial]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true 
 *      - in: path
 *        name: tb_user_id
 *        required: true  
 *      - in: path
 *        name: date
 *        required: true
 *     responses:
 *       200:
 *         description: The list of customer that was charged
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FinancialListCustomerCharged'
 */

router.get("/customer/charged/getlist/:tb_institution_id/:tb_user_id/:date", financial.getListCustomerCharge);

/**
 * @swagger
 * /financial/salesman/customer/charged/getlist/{tb_institution_id}/{date}:
 *   get:
 *     summary: Returns the list of customers charged
 *     tags: [Financial]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: date
 *     responses:
 *       200:
 *         description: The list of customer that was charged
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FinancialListSalesmanCustomerCharged'
 */

router.get("/salesman/customer/charged/getlist/:tb_institution_id/:date", financial.getListSalesmanCustomerCharge);

/**
 * @swagger
 * /financial/customer/olddebit/getlist:
 *   post:
 *     summary: Returns the list of customers old debit
 *     tags: [Financial]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CashierStatementParams'
 *     responses:
 *       200:
 *         description: The list of customer that was charged
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FinancialListCustomerOldDebit'
 */

router.post("/customer/olddebit/getlist", financial.getDividaVelhaBySalesmanDetailed);


module.exports = router;