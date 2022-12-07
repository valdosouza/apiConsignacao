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
 *         tb_merchandise_id:
 *           type: integer
 *         name_merchandise:
 *           type: string  
 *         quantity:
 *           type: number 
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
 * /stockBalance/getlist/{tb_institution_id}/{tb_stock_list_id}:
 *  get:
 *    summary: Return stockstatement by the tb_institution_id and tb_stock_list_id
 *    tags: [StockBalance]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_stock_list_id 
 *        schema:
 *          type: string
 *        required: true
 *        description: The id Institution and Id StockList
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
  

module.exports = router;  