const { Router } = require("express");
  
const stockBalance =  require("../endpoint/stockBalance.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     StockBalance:
 *       type: object
 *       required:
 *         - tb_institution_id
 *         - tb_stock_list_id
 *         - name_stock_list
 *         - tb_merchandise_id
 *         - name_merchandise
 *         - quantity
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         tb_stock_list_id:
 *           type: integer
 *         name_stock_list:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StockBalanceItems'
 *  
 *     StockBalanceItems:
 *       type: object
 *       properties:
 *         tb_merchandise_id:
 *           type: integer
 *         name_merchandise:
 *           type: string  
 *         quantity:
 *           type: number  
 * 
 *     StockBalanceSummarized:
 *       type: object
 *       properties:
 *         tb_merchandise_id:
 *           type: integer
 *         name_merchandise:
 *           type: string
 *         quantity:
 *           type: number
 * 
 *   
*/
    
 
 /**
  * @swagger
  * tags:
  *   name: StockBalance
  *   description: The Stock Balance managing API
  */

/**
 * @swagger
 * /stockbalance/getlist/{tb_institution_id}/{tb_stock_list_id}:
 *  get:
 *    summary: Return stockbalance by the tb_institution_id and tb_stock_list_id
 *    tags: [StockBalance]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true
 *      - in: path
 *        name: tb_stock_list_id 
 *        required: true
 *    responses:
 *      200:
 *        description: The Stock Balance was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/StockBalance'
 *      404:
 *        description: The stock Balance was not found
 *      500:
 *        description: Some error happened
 */
router.get("/getlist/:tb_institution_id/:tb_stock_list_id/", stockBalance.getList);
  
/**
 * @swagger
 * /stockbalance/salesman/getlist/{tb_institution_id}/{tb_salesman_id}:
 *  get:
 *    summary: Return stockbalance by the salesman
 *    tags: [StockBalance]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true
 *      - in: path
 *        name: tb_salesman_id
 *        required: true
 *    responses:
 *      200:
 *        description: The Stock Balance was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/StockBalanceSummarized'
 *      404:
 *        description: The stock Balance was not found
 *      500:
 *        description: Some error happened
 */
router.get("/salesman/getlist/:tb_institution_id/:tb_salesman_id/", stockBalance.getListBySalesman);

/**
 * @swagger
 * /stockbalance/customer/getlist/{tb_institution_id}/{tb_salesman_id}:
 *  get:
 *    summary: Return stockbalance of all customer by the salesman
 *    tags: [StockBalance]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true
 *      - in: path
 *        name: tb_salesman_id
 *        required: true
 *    responses:
 *      200:
 *        description: The Stock Balance was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/StockBalanceSummarized'
 *      404:
 *        description: The stock Balance was not found
 *      500:
 *        description: Some error happened
 */
router.get("/customer/getlist/:tb_institution_id/:tb_salesman_id/", stockBalance.getListAllCustomer);

/**
 * @swagger
 * /stockbalance/salesman/getall/{tb_institution_id}/{tb_salesman_id}:
 *  get:
 *    summary: Return stockbalance of all customer and the salesman  by the salesman
 *    tags: [StockBalance]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true
 *      - in: path
 *        name: tb_salesman_id
 *        required: true
 *    responses:
 *      200:
 *        description: The Stock Balance was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/StockBalanceSummarized'
 *      404:
 *        description: The stock Balance was not found
 *      500:
 *        description: Some error happened
 */
router.get("/salesman/getall/:tb_institution_id/:tb_salesman_id/", stockBalance.getAllBySalesman);

module.exports = router;  