const { Router } = require("express");
  
const person =  require("../endpoint/person.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     Person:
 *       type: object
 *       required:
 *         - id
 *         - cpf
 *       properties:
 *         id:
 *           type: integer
 *         cpf:
 *           type: string 
 *         rg:
 *           type: string 
 *         rg_dt_emission:
 *           type: string 
 *         rg_organ_issuer:
 *           type: string
 *         rg_state_issuer:
 *           type: integer
 *         birthday:
 *           type: string
 *         tb_profession_id:
 *           type: integer
 */

 /**
  * @swagger
  * tags:
  *   name: Person
  *   description: The Persons managing API
  */

/**
 * @swagger
 * /Person:
 *   post:
 *     summary: Create a new Person
 *     tags: [Person]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Entity'
 *     responses:
 *       200:
 *         description: The Person was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *       500:
 *         description: Some server error
 */
 router.post("/", person.create);

 /**
 * @swagger
 * /Person:
 *   get:
 *     summary: Returns the list of all the person
 *     tags: [Person]
 *     responses:
 *       200:
 *         description: The list of the person
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Person'
 */

router.get("/", person.getList);
  
 /**
 * @swagger
 * /Person/{id}:
 *  put:
 *    summary: Update the Person by the id
 *    tags: [Person]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Person id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Person'
 *    responses:
 *      200:
 *        description: The Person was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Person'
 *      404:
 *        description: The Person was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", person.update);

/**
 * @swagger
 * /Person/{id}:
 *  delete:
 *    summary: Delete the Person by the id
 *    tags: [Person]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Person id
 *    responses:
 *      200:
 *        description: The Person was deleted
 *      404:
 *        description: The Person was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", person.delete);

/**
 * @swagger
 * /Person/getbycpf/{cpf}:
 *  get:
 *    summary: Return Person by the CPF
 *    tags: [Person]
 *    parameters:
 *      - in: path
 *        name: cpf
 *        schema:
 *          type: string
 *        required: true
 *        description: The CPF Person
 *    responses:
 *      200:
 *        description: The Person was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Person'
 *      404:
 *        description: The Person was not found
 *      500:
 *        description: Some error happened
 */
 router.get("/getbycpf/:cpf", person.getbycpf);

module.exports = router;  