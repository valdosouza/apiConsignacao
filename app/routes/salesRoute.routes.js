const { Router } = require("express");
  
const salesroute =  require("../endpoint/salesRoute.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     SalesRoute:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - description
 *         - active
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         description:
 *           type: string
 *         active:
 *           type: string
 * 
 *     SalesRouteSequence:
 *       type: object
 *       required:
 *         - tb_institution_id
 *         - tb_sales_route_id
 *         - tb_customer_id
 *         - sequence
 *       properties: 
 *         tb_institution_id:
 *           type: integer
 *         tb_sales_route_id:
 *           type: integer  
 *         tb_customer_id:
 *           type: integer
 *         sequence:
 *           type: integer
 
 */

 /**
  * @swagger
  * tags:
  *   name: SalesRoute
  *   description: The SalesRoute managing API
  */

/**
 * @swagger
 * /salesroute:
 *   post:
 *     summary: Create a new salesroute
 *     tags: [SalesRoute]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalesRoute'
 *     responses:
 *       200:
 *         description: The SalesRoute was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalesRoute'
 *       500:
 *         description: Some server error
 */
 router.post("/", salesroute.create);

 /**
 * @swagger
 * /salesroute/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the SalesRoutes
 *     tags: [SalesRoute]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The salesroute tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the payment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SalesRoute'
 */

router.get("/getlist/:tb_institution_id", salesroute.getList);
  
/**
 * @swagger
 * /salesroute/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the SalesRoute
 *     tags: [SalesRoute]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The salesroute by tb_institution_id and....
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The salesroute by id
 *     responses:
 *       200:
 *         description: The SalesRoute
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SalesRoute'
 */

 router.get("/get/:tb_institution_id/:id", salesroute.get);
 /**
 * @swagger
 * /salesroute:
 *  put:
 *    summary: Update the salesroute by the id
 *    tags: [SalesRoute]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SalesRoute'
 *    responses:
 *      200:
 *        description: The Sales Route was updated
 *      404:
 *        description: The salesroute was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", salesroute.update);

 router.get("/get/:tb_institution_id/:id", salesroute.get);

/**
 * @swagger
 * /salesroute/sequence/:
 *  post:
 *    summary: Set the sequence of customer in the route
 *    tags: [SalesRoute]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SalesRouteSequence'
 *    responses:
 *      200:
 *        description: The Sequence of Sales Route was updated
 *      404:
 *        description: The Sequence of salesroute was not found
 *      500:
 *        description: Some error happened
 */
 router.post("/sequence/", salesroute.sequence);

/**
 * @swagger
 * /salesroute/{id}:
 *  delete:
 *    summary: Delete the salesroute by the id
 *    tags: [SalesRoute]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The salesroute id
 *    responses:
 *      200:
 *        description: The SalesRoute was deleted
 *      404:
 *        description: The salesroute was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", salesroute.delete);

module.exports = router;