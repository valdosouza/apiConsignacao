const { Router } = require("express");
  
const entity =  require("../endpoint/entity.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     Entity:
 *       type: object
 *       required:
 *         - id
 *         - name_company
 *         - nick_trade
 *       properties:
 *         id:
 *           type: integer
 *         name_company:
 *           type: string
 *         nick_trade:
 *           type: string
 *         aniversary:
 *           type: string
 *         tb_line_buiness_id:
 *           type: integer
 *         name_linebusiness:
 *           type: string 
 *         note:
 *           type: string
 */

 /**
  * @swagger
  * tags:
  *   name: Entity
  *   description: The Entity managing API
  */

/**
 * @swagger
 * /Entity:
 *   post:
 *     summary: Create a new entity
 *     tags: [Entity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Entity'
 *     responses:
 *       200:
 *         description: The Entity was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entity'
 *       500:
 *         description: Some server error
 */
 router.post("/", entity.create);

 /**
 * @swagger
 * /Entity:
 *   get:
 *     summary: Returns the list of all the Entities
 *     tags: [Entity]
 *     responses:
 *       200:
 *         description: The list of the entities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Entity'
 */

router.get("/", entity.getList);
  
 /**
 * @swagger
 * /entity/{id}:
 *  put:
 *    summary: Update the entity by the id
 *    tags: [Entity]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The entity id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Entity'
 *    responses:
 *      200:
 *        description: The Entity was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Entity'
 *      404:
 *        description: The entity was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", entity.update);

/**
 * @swagger
 * /entity/{id}:
 *  delete:
 *    summary: Delete the entity by the id
 *    tags: [Entity]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The entity id
 *    responses:
 *      200:
 *        description: The Entity was deleted
 *      404:
 *        description: The entity was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", entity.delete);

module.exports = router;  