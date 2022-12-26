const { Router } = require("express");
  
const address =  require("../endpoint/address.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - id
 *         - street
 *         - nmbr
 *         - id
 *         - street
 *         - nmbr
 *         - neighborhood
 *         - kind
 *         - zip_code
 *         - tb_country_id
 *         - tb_state_id
 *         - tb_city_id
 *         - main
 *       properties:
 *         id:
 *           type: integer
 *         street:
 *           type: string
 *         nmbr:
 *           type: string
 *         complement:
 *           type: string
 *         neighborhood:
 *           type: string
 *         region:
 *           type: string
 *         kind:
 *           type: string
 *         zip_code:
 *           type: string
 *         tb_country_id:
 *           type: integer
 *         name_country:
 *           type: string
 *         tb_state_id:
 *           type: integer
 *         name_state:
 *           type: string 
 *         tb_city_id:
 *           type: integer
 *         name_city:
 *           type: string 
 *         main:
 *           type: string
 *         longitude:
 *           type: string
 *         latitude:
 *           type: string
 */

 /**
  * @swagger
  * tags:
  *   name: Address
  *   description: The Address managing API
  */

/**
 * @swagger
 * /Address:
 *   post:
 *     summary: Create a new address
 *     tags: [Address]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: The Address was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       500:
 *         description: Some server error
 */
 router.post("/", address.create);

 /**
 * @swagger
 * /Address:
 *   get:
 *     summary: Returns the list of all the address
 *     tags: [Address]
 *     responses:
 *       200:
 *         description: The list of the address
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 */
protectedRouter.get("/", address.getList);
//router.get("/", address.getList);
  
 /**
 * @swagger
 * /Address/{id}:
 *  put:
 *    summary: Update the address by the id
 *    tags: [Address]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The address id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Address'
 *    responses:
 *      200:
 *        description: The Address was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Address'
 *      404:
 *        description: The address was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", address.update);

/**
 * @swagger
 * /Address/{id}:
 *  delete:
 *    summary: Delete the address by the id
 *    tags: [Address]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The address id
 *    responses:
 *      200:
 *        description: The address was deleted
 *      404:
 *        description: The address was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", address.delete);

module.exports = router;  