const { Router } = require("express");
  
const stocklist =  require("../endpoint/stocklist.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     StockList:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - description
 *         - main
 *         - active
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         description:
 *           type: string
 *         main:
 *           type: string
 *         active:
 *           type: string 
 */

 /**
  * @swagger
  * tags:
  *   name: StockList
  *   description: The Stock List managing API
  */

/**
 * @swagger
 * /stockList:
 *   post:
 *     summary: Create a new Stock List
 *     tags: [StockList]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/StockList'
 *     responses:
 *       200:
 *         description: The Stock List was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/StockList'
 *       500:
 *         description: Some server error
 */
 router.post("/", stocklist.create);

 /**
 * @swagger
 * /stocklist/getlist/{tb_institution_id}:
 *  get:
 *    summary: Return stocklist by the id
 *    tags: [StockList]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id Institutionr
 *    responses:
 *      200:
 *        description: The Stock was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/StockList'
 *      404:
 *        description: The stock was not found
 *      500:
 *        description: Some error happened
 */
router.get("/getlist/:tb_institution_id", stocklist.getList);
  
/**
 * @swagger
 * /stocklist/get/{tb_institution_id}/{id}:
 *  get:
 *    summary: Return stocklist by the id
 *    tags: [StockList]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The stocklist by tb_institution_id 
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The stocklist by id
 *    responses:
 *      200:
 *        description: The Stock was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/StockList'
 *      404:
 *        description: The stock was not found
 *      500:
 *        description: Some error happened
 */
router.get("/get/:tb_institution_id/:id", stocklist.get);

 /**
 * @swagger
 * /stockList:
 *  put:
 *    summary: Update the Stock List by the id
 *    tags: [StockList]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            allOf:
 *              - $ref: '#/components/schemas/StockList'
 *    responses:
 *      200:
 *        description: The Stock List was updated       
 *      404:
 *        description: The Stock List was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", stocklist.update);

/**
 * @swagger
 * /StockList/{id}:
 *  delete:
 *    summary: Delete the Stock List by the id
 *    tags: [StockList]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Stock List id
 *    responses:
 *      200:
 *        description: The Stock List was deleted
 *      404:
 *        description: The institution was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", stocklist.delete);

module.exports = router;  