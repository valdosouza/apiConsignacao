const { Router } = require("express");
  
const orderstocktransfer =  require("../endpoint/orderStockTransfer.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     OrderStockTransfer:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - tb_user_id
 *         - tb_entity_id
 *         - dt_record
 *         - status
 *         - tb_stock_list_id_ori
 *         - tb_stock_list_id_des
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         tb_user_id:
 *           type: integer
 *         dt_record:
 *           type: string
 *         number:
 *           type: integer
 *         tb_entity_id:
 *           type: integer
 *         name_entity:
 *           type: string 
 *         tb_stock_list_id_ori:
 *           type: integer
 *         name_stock_list_ori:
 *           type: string  
 *         tb_stock_list_id_des:
 *           type: integer
 *         name_stock_list_des:
 *           type: string
 *         note:
 *           type: string 
 *         status:
 *           type: string
 *  
 *     OrderStockTransferItem:
 *       type: object
 *       required:
 *         - tb_product_id
 *         - unit_value
 *         - quantity
 *       properties:
 *         tb_product_id:
 *           type: integer
 *         unit_value:
 *           type: number
 *         quantity:
 *           type: number
 * 
 *     OrderStockAdOperation:
 *       type: object
 *       required:
 *         - tb_institution_id
 *         - tb_order_id 
 *         - dt_record
 *         - direction 
 *       properties:
 *         tb_institution_id:
 *           type: integer
 *         id:
 *           type: integer
 *         dt_record:
 *           type: string 
 *
 *     OrderStockTransferMain:
 *       type: object
 *       properties:
 *         Order:
 *           $ref: '#/components/schemas/OrderStockTransfer'
 *         Items:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/OrderStockTransferItem'
 */
 
 
 /**
  * @swagger
  * tags:
  *   name: OrderStockTransfer
  *   description: The OrderStockTransfer managing API
  */

/**
 * @swagger
 * /orderstocktransfer:
 *   post:
 *     summary: Create a new orderstocktransfer
 *     tags: [OrderStockTransfer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderStockTransferMain'
 *     responses:
 *       200:
 *         description: The OrderStockTransfer was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderStockTransferMain'
 *       500:
 *         description: Some server error
 */
 router.post("/", orderstocktransfer.create);

 /**
 * @swagger
 * /orderstocktransfer/getlist/{tb_institution_id}/{tb_order_id}:
 *   get:
 *     summary: Returns the list of all the OrderStockTransfers
 *     tags: [OrderStockTransfer]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_order_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderstocktransfer tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the payment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderStockTransferMain'
 */

router.get("/getlist/:tb_institution_id/:tb_order_id", orderstocktransfer.getList);
  
/**
 * @swagger
 * /orderstocktransfer/get/{tb_institution_id}/{tb_order_id}/{id}:
 *   get:
 *     summary: Returns the OrderStockTransfer
 *     tags: [OrderStockTransfer]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_order_id
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderstocktransfer by tb_institution_id and....
 *     responses:
 *       200:
 *         description: The OrderStockTransfer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderStockTransferMain'
 */

 router.get("/get/:tb_institution_id/:tb_order_id/:id", orderstocktransfer.get);
 /**
 * @swagger
 * /orderstocktransfer:
 *  put:
 *    summary: Update the orderstocktransfer by the id
 *    tags: [OrderStockTransfer]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/OrderStockTransferMain'
 *    responses:
 *      200:
 *        description: The OrderStockTransfer was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderStockTransferMain'
 *      404:
 *        description: The orderstocktransfer was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", orderstocktransfer.update);

/**
 * @swagger
 * /orderstocktransfer/{tb_institution_id}/{tb_order_id}/{id}:
 *  delete:
 *    summary: Delete the orderstocktransfer by the id
 *    tags: [OrderStockTransfer]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_order_id
 *      - in: path
 *        name: id 
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderstocktransfer id
 *    responses:
 *      200:
 *        description: The OrderStockTransfer was deleted
 *      404:
 *        description: The orderstocktransfer was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/:tb_institution_id/:tb_order_id/:id", orderstocktransfer.delete);

/**
 * @swagger
 * /orderstocktransfer/close:
 *   post:
 *     summary: Close status Order StockTransfer
 *     tags: [OrderStockTransfer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderStockAdOperation'
 *     responses:
 *       200:
 *         description: The OrderStockTransfer was closed
 *       201:
 *         description: The OrderStockTransfer is already closed
 *       404:
 *         description: The Order StockAdjust was notTransfer
 *       500:
 *         description: Some error happened
 */
 router.post("/close/", orderstocktransfer.close);

 /**
  * @swagger
  * /orderstocktransfer/reopen:
  *   post:
  *     summary: Reopen Status Order StockTransfer
  *     tags: [OrderStockTransfer]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/OrderStockAdOperation'
  *     responses:
  *       200:
  *         description: The OrderStockTransfer was open
  *       201:
  *         description: The OrderStockTransfer is already open
  *       404:
  *         description: The Order StockAdjust was notTransfer
  *       500:
  *         description: Some error happened
  */
 router.post("/reopen/", orderstocktransfer.reopen);     

module.exports = router;