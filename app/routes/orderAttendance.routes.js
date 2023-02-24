const { Router } = require("express");
  
const orderattendance =  require("../endpoint/orderAttendance.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     OrderAttendance:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - tb_user_id 
 *         - tb_customer_id
 *         - tb_salesman_id  
 *         - dt_record
 *         - visited
 *         - charged
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
 *         tb_customer_id:
 *           type: integer
 *         name_customer:
 *           type: string 
 *         tb_price_list_id:
 *           type: integer
 *         tb_salesman_id:
 *           type: integer
 *         name_salesman:
 *           type: string  
 *         note:
 *           type: string 
 *         status:
 *           type: string
 *         visited:
 *           type: string
 *         charged:
 *           type: string
 *         longitude:
 *           type: string
 *         latitude:
 *           type: string
 *  
 * 
 *     OrderAttendanceOperation:
 *       type: object
 *       required:
 *         - tb_institution_id
 *         - tb_order_id 
 *       properties:
 *         tb_institution_id:
 *           type: integer
 *         id:
 *           type: integer
 *
 */
 
 /**
  * @swagger
  * tags:
  *   name: OrderAttendance
  *   description: The OrderAttendance managing API
  */

/**
 * @swagger
 * /orderattendance:
 *   post:
 *     summary: Create a new orderattendance
 *     tags: [OrderAttendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderAttendance'
 *     responses:
 *       200:
 *         description: The OrderAttendance was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderAttendance'
 *       500:
 *         description: Some server error
 */
 router.post("/", orderattendance.create);

 /**
 * @swagger
 * /orderattendance/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the OrderAttendance
 *     tags: [OrderAttendance]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderattendance tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the Order Attendance
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderAttendance'
 */

router.get("/getlist/:tb_institution_id", orderattendance.getList);
  
/**
 * @swagger
 * /orderattendance/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the OrderAttendance
 *     tags: [OrderAttendance]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Order Attendance by tb_institution_id and id
 *     responses:
 *       200:
 *         description: The OrderAttendance
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderAttendance'
 */

 router.get("/get/:tb_institution_id/:id", orderattendance.get);
 /**
 * @swagger
 * /orderattendance:
 *  put:
 *    summary: Update the orderattendance by the id
 *    tags: [OrderAttendance]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/OrderAttendance'
 *    responses:
 *      200:
 *        description: The OrderAttendance was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderAttendance'
 *      404:
 *        description: The orderattendance was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", orderattendance.update);

/**
 * @swagger
 * /orderattendance/{tb_institution_id}/{id}:
 *  delete:
 *    summary: Delete the orderattendance by the id
 *    tags: [OrderAttendance]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: id 
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderattendance id
 *    responses:
 *      200:
 *        description: The OrderAttendance was deleted
 *      404:
 *        description: The orderattendance was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/:tb_institution_id/:id", orderattendance.delete);

/**
 * @swagger
 * /orderattendance/closure:
 *   post:
 *     summary: Close status Order Attendance
 *     tags: [OrderAttendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderAttendanceOperation'
 *     responses:
 *       200:
 *         description: The OrderAttendance was closed
 *       201:
 *         description: The OrderAttendance is already closed
 *       404:
 *         description: The Order Attendance was not Found
 *       500:
 *         description: Some error happened
 */
 router.post("/closure/", orderattendance.closure);

 /**
  * @swagger
  * /orderattendance/reopen:
  *   post:
  *     summary: Reopen Status Order Attendance
  *     tags: [OrderAttendance]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/OrderAttendanceOperation'
  *     responses:
  *       200:
  *         description: The OrderAttendance was open
  *       201:
  *         description: The OrderAttendance is already open
  *       404:
  *         description: The Order Attendance was not Found
  *       500:
  *         description: Some error happened
  */
 router.post("/reopen/", orderattendance.reopen);     

 router.post("/cleanup", orderattendance.cleanup);

module.exports = router;