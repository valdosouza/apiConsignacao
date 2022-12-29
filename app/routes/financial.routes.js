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
 *        description: The financial tb_institution_id/tb_user_id/date
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

router.get("/statement/getbyday/:tb_institution_id/:tb_user_id/:date", financial.getbyday);
  
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
 *        description: The financial tb_institution_id/tb_user_id/date -
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

router.get("/statement/getbymonth/:tb_institution_id/:tb_user_id/:date", financial.getbymonth);

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

router.get("/statement/getbycustomer/:tb_institution_id/:tb_user_id/:tb_customer_id/:date", financial.getbyDaybyCustomer);

module.exports = router;