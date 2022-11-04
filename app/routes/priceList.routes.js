const { Router } = require("express");
  
const pricelist =  require("../endpoint/priceList.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     PriceList:
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
 *         validity:
 *            type: string
 *         aliq_profit:
 *            type: number
 *         active:
 *           type: string
 */

 /**
  * @swagger
  * tags:
  *   name: PriceList
  *   description: The PriceList managing API
  */

/**
 * @swagger
 * /pricelist:
 *   post:
 *     summary: Create a new pricelist
 *     tags: [PriceList]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PriceList'
 *     responses:
 *       200:
 *         description: The PriceList was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PriceList'
 *       500:
 *         description: Some server error
 */
 router.post("/", pricelist.create);

 /**
 * @swagger
 * /pricelist/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the PriceLists
 *     tags: [PriceList]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The pricelist tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the payment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PriceList'
 */

router.get("/getlist/:tb_institution_id", pricelist.getList);
  
/**
 * @swagger
 * /pricelist/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the PriceList
 *     tags: [PriceList]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The pricelist by tb_institution_id and....
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The pricelist by id
 *     responses:
 *       200:
 *         description: The PriceList
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PriceList'
 */

 router.get("/get/:tb_institution_id/:id", pricelist.get);
 /**
 * @swagger
 * /pricelist:
 *  put:
 *    summary: Update the pricelist by the id
 *    tags: [PriceList]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/PriceList'
 *    responses:
 *      200:
 *        description: The PriceList was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PriceList'
 *      404:
 *        description: The pricelist was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", pricelist.update);

/**
 * @swagger
 * /pricelist/{id}:
 *  delete:
 *    summary: Delete the pricelist by the id
 *    tags: [PriceList]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The pricelist id
 *    responses:
 *      200:
 *        description: The PriceList was deleted
 *      404:
 *        description: The pricelist was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", pricelist.delete);

module.exports = router;