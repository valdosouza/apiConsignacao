const { Router } = require("express");
  
const customer =  require("../endpoint/customer.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer 
 *         tb_salesman_id:
 *           type: integer
 *         tb_carrier_id:
 *           type: integer  
 *         credit_status:
 *           type: string
 *         credit_value:
 *           type: number
 *           format: double
 *         Wallet:
 *           type: string
 *         consumer:
 *           type: string
 *         multiplier:
 *           type: number
 *           format: double
 *         by_pass_st:
 *           type: string
 *         active:
 *           type: string 
 * 
 *     ObjCustomer:
 *       type: object
 *       properties:
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         entity:
 *           $ref: '#/components/schemas/Entity' 
 *         person:
 *           $ref: '#/components/schemas/Person'  
 *         company:
 *           $ref: '#/components/schemas/Company'
 *         address:
 *           $ref: '#/components/schemas/Address' 
 *         phone:
 *           $ref: '#/components/schemas/Phone'  
 *             
 *     ListCustomer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         apelido:
 *           type: string
 *         TipoDoc:
 *           type: string
 *         Documento:
 *           type: string
 
 */

 /**
  * @swagger
  * tags:
  *   name: Customer
  *   description: The Customer managing API
  */

/**
 * @swagger
 * /customer:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ObjCustomer'
 *     responses:
 *       200:
 *         description: The Customer was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ObjCustomer'
 *       500:
 *         description: Some server error
 */
 router.post("/", customer.create);

 /**
 * @swagger
 * /customer/{id}:
 *   get:
 *     summary: Returns the list of all the customer
 *     tags: [Customer]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id customer
 *     responses:
 *       200:
 *         description: The  customer
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/ObjCustomer'
 */
 router.get("/:id", customer.getCustomer);
  
/**
 * @swagger
 * /customer/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the Customer
 *     tags: [Customer]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: integer  
 *        required: true
 *        description: The Customer tb_institution_id
 *     responses:
 *       200:
 *         description: The list of collaborator
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ListCustomer'
 *       500:
 *         description: Some server error 
 */
 router.get("/getlist/:tb_institution_id", customer.getList);
 
/**
 * @swagger
 * /customer/{id}:
 *  delete:
 *    summary: Delete the customer by the id
 *    tags: [Customer]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The customer id
 *    responses:
 *      200:
 *        description: The customer was deleted
 *      404:
 *        description: The institution was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", customer.delete);

module.exports = router;  

