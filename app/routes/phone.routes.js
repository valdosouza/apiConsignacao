const { Router } = require("express");
  
const phone =  require("../endpoint/phone.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     Phone:
 *       type: object
 *       required:
 *         - id
 *         - kind
 *         - contact
 *         - number
 *         - address_kind
 *       properties:
 *         id:
 *           type: integer
 *         kind:
 *           type: string
 *         contact:
 *           type: string
 *         number:
 *           type: string
 *         address_kind:
 *           type: string
 */

 /**
  * @swagger
  * tags:
  *   name: Phone
  *   description: The Phone managing API
  */

/**
 * @swagger
 * /Phone:
 *   post:
 *     summary: Create a new phone
 *     tags: [Phone]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Phone'
 *     responses:
 *       200:
 *         description: The Phone was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Phone'
 *       500:
 *         description: Some server error
 */
 router.post("/", phone.create);

 /**
 * @swagger
 * /Phone:
 *   get:
 *     summary: Returns the list of all the phone
 *     tags: [Phone]
 *     responses:
 *       200:
 *         description: The list of the phone
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Phone'
 */

router.get("/", phone.getList);
  
 /**
 * @swagger
 * /Phone/{id}:
 *  put:
 *    summary: Update the phone by the id
 *    tags: [Phone]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The phone id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Phone'
 *    responses:
 *      200:
 *        description: The Phone was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Phone'
 *      404:
 *        description: The phone was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", phone.update);

/**
 * @swagger
 * /Phone/{id}:
 *  delete:
 *    summary: Delete the phone by the id
 *    tags: [Phone]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The phone id
 *    responses:
 *      200:
 *        description: The phone was deleted
 *      404:
 *        description: The phone was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", phone.delete);

module.exports = router;  