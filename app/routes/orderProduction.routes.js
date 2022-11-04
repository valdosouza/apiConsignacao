const { Router } = require("express");
  
const orderproduction =  require("../endpoint/orderproduction.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     OrderProduction:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - tb_user_id
 *         - dt_record
 *         - status
 *         - tb_merchandise_id
 *         - name_merchandise
 *         - qtty_forecast
 *         - tb_stock_list_id_des
 *         - name_stock_list_des
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
 *         status:
 *           type: string
 *         tb_merchandise_id:
 *           type: integer
 *         name_merchandise:
 *           type: string
 *         qtty_forecast:
 *           type: number
 *         tb_stock_list_id_des:
 *           type: integer
 *         name_stock_list_des:
 *           type: string
 *         note:
 *           type: string
 *       
 */

 /**
  * @swagger
  * tags:
  *   name: OrderProduction
  *   description: The OrderProduction managing API
  */

/**
 * @swagger
 * /orderproduction:
 *   post:
 *     summary: Create a new orderproduction
 *     tags: [OrderProduction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderProduction'
 *     responses:
 *       200:
 *         description: The OrderProduction was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderProduction'
 *       500:
 *         description: Some server error
 */
 router.post("/", orderproduction.create);

 /**
 * @swagger
 * /orderproduction/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the OrderProductions
 *     tags: [OrderProduction]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The orderproduction tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the payment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderProduction'
 */

router.get("/getlist/:tb_institution_id", orderproduction.getList);
  
/**
 * @swagger
 * /orderproduction/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the OrderProduction
 *     tags: [OrderProduction]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderproduction by tb_institution_id and....
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderproduction by id
 *     responses:
 *       200:
 *         description: The OrderProduction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderProduction'
 */

 router.get("/get/:tb_institution_id/:id", orderproduction.get);
 /**
 * @swagger
 * /orderproduction:
 *  put:
 *    summary: Update the orderproduction by the id
 *    tags: [OrderProduction]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/OrderProduction'
 *    responses:
 *      200:
 *        description: The OrderProduction was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderProduction'
 *      404:
 *        description: The orderproduction was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", orderproduction.update);

/**
 * @swagger
 * /orderproduction/{id}:
 *  delete:
 *    summary: Delete the orderproduction by the id
 *    tags: [OrderProduction]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderproduction id
 *    responses:
 *      200:
 *        description: The OrderProduction was deleted
 *      404:
 *        description: The orderproduction was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", orderproduction.delete);

module.exports = router;