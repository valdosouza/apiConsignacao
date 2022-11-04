const { Router } = require("express");
  
const paymentType =  require("../endpoint/paymentType.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentType:
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
 */

 /**
  * @swagger
  * tags:
  *   name: PaymentType
  *   description: The PaymentType managing API
  */

/**
 * @swagger
 * /paymenttype:
 *   post:
 *     summary: Create a new paymentType
 *     tags: [PaymentType]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentType'
 *     responses:
 *       200:
 *         description: The PaymentType was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentType'
 *       500:
 *         description: Some server error
 */
 router.post("/", paymentType.create);

 /**
 * @swagger
 * /paymenttype/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the PaymentTypes
 *     tags: [PaymentType]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The paymentType tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the payment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentType'
 */

router.get("/getlist/:tb_institution_id", paymentType.getList);
  
/**
 * @swagger
 * /paymenttype/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the PaymentType
 *     tags: [PaymentType]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The paymentType by tb_institution_id and....
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The paymentType by id
 *     responses:
 *       200:
 *         description: The PaymentType
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentType'
 */

 router.get("/get/:tb_institution_id/:id", paymentType.get);
 /**
 * @swagger
 * /paymentType:
 *  put:
 *    summary: Update the paymentType by the id
 *    tags: [PaymentType]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/PaymentType'
 *    responses:
 *      200:
 *        description: The PaymentType was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PaymentType'
 *      404:
 *        description: The paymentType was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", paymentType.update);

/**
 * @swagger
 * /paymentType/{id}:
 *  delete:
 *    summary: Delete the paymentType by the id
 *    tags: [PaymentType]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The paymentType id
 *    responses:
 *      200:
 *        description: The PaymentType was deleted
 *      404:
 *        description: The paymentType was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", paymentType.delete);

module.exports = router;