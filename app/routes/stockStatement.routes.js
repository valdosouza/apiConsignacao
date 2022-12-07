const { Router } = require("express");
  
const stockStatement =  require("../endpoint/stockStatement.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     StockStatement:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - tb_stock_list_id
 *         - tb_merchandise_id
 *         - quantity
 *         - direction
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         terminal:
 *           type: integer
 *         tb_order_id:
 *           type: integer
 *         tb_order_item_id:
 *           type: integer
 *         tb_stock_list_id:
 *           type: integer
 *         local:
 *           type: string
 *         kind:
 *           type: string
 *         dt_record:
 *           type: string 
 *         direction:
 *           type: string 
 *         tb_merchandise_id:
 *           type: integer
 *         quantity:
 *           type: number 
 *         operation:
 *           type: string 
 * 
 *     ParamsStockStatement:
 *       type: object
 *       required:
 *         - tb_institution_id
 *       properties:
 *         tb_stock_list_id:
 *           type: integer
 *         dt_initial:
 *           type: string 
 *         dt_final:
 *           type: string 
 *         direction:
 *           type: string 
 *         tb_merchandise_id:
 *           type: integer 
*/
    
 
 /**
  * @swagger
  * tags:
  *   name: StockStatement
  *   description: The Stock Statement managing API
  */

/**
 * @swagger
 * /stockStatement:
 *   post:
 *     summary: Create a new Stock List
 *     tags: [StockStatement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/StockStatement'
 *     responses:
 *       200:
 *         description: The StockStatement item was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/StockStatement'
 *       500:
 *         description: Some server error
 */
 router.post("/", stockStatement.create);

 /**
 * @swagger
 * /stockStatement/getlist/{tb_institution_id}:
 *  post:
 *    summary: Return stockstatement by the tb_institution_id
 *    tags: [StockStatement]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id Institutionr
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            allOf:
 *              - $ref: '#/components/schemas/ParamsStockStatement'
 *    responses:
 *      200:
 *        description: The Stock Statement was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/StockStatement'
 *      404:
 *        description: The stock Statement was not found
 *      500:
 *        description: Some error happened
 */
router.post("/getlist/:tb_institution_id", stockStatement.getList);
  

module.exports = router;  