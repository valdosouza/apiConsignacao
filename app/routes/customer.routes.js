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
 *         salesman_name:
 *           type: string
 *         tb_carrier_id:
 *           type: integer  
 *         tb_sales_route_id:
 *           type: integer
 *         sales_route_name:
 *           type: string
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
 *         name_company:
 *           type: string
 *         nick_trade:
 *           type: string
 *         doc_kind:
 *           type: string
 *         doc_number:
 *           type: string
 
 *     ListCustomerByRoute:
 *       type: object
 *       properties:
 *         tb_sales_route_id:
 *           type: integer
 *         name_sales_routed:
 *           type: string 
 *         sequence:
 *           type: integer
 *         id:
 *           type: integer
 *         name_company:
 *           type: string
 *         nick_trade:
 *           type: string
 *         doc_type:
 *           type: string
 *         doc_number:
 *           type: string
 * 
 *     ListCustomerBySalesRoute:
 *       type: object
 *       properties:
 *         tb_salesman_id:
 *           type: integer
 *         name_salesman:
 *           type: string 
 *         id:
 *           type: integer
 *         name_company:
 *           type: string
 *         nick_trade:
 *           type: string
 *         doc_type:
 *           type: string
 *         doc_number:
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
 *               $ref: '#/components/schemas/ListCustomer'
 *       500:
 *         description: Some server error
 */
 router.post("/", customer.save);

 /**
 * @swagger
 * /customer/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the list of all the customer
 *     tags: [Customer]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true 
 *      - in: path
 *        name: id  
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
 router.get("/get/:tb_institution_id/:id", customer.getCustomer);
  
/**
 * @swagger
 * /customer/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the Customer
 *     tags: [Customer]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
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
 * /customer/salesroute/getlist/{tb_institution_id}/{tb_sales_route_id}/{tb_salesman_id}:
 *   get:
 *     summary: Returns the list of all the Customer
 *     tags: [Customer]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true
 *      - in: path
 *        name: tb_sales_route_id
 *        required: true
 *      - in: path
 *        name: tb_salesman_id
 *        required: true
 *     responses:
 *       200:
 *         description: The list of Customer by Route e by Salesman
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ListCustomerByRoute'
 *       500:
 *         description: Some server error 
 */
 router.get("/salesroute/getlist/:tb_institution_id/:tb_sales_route_id/:tb_salesman_id", customer.getListSalesRoute);

/**
 * @swagger
 * /customer/salesman/getlist/{tb_institution_id}/{tb_salesman_id}:
 *   get:
 *     summary: Returns the list of all the Customer
 *     tags: [Customer]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        required: true 
 *      - in: path
 *        name: tb_salesman_id
 *        required: true
 *        description: The Customer List by tb_institution_id tb_salesman_id
 *     responses:
 *       200:
 *         description: The list of Customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ListCustomerBySalesRoute'
 *       500:
 *         description: Some server error 
 */
router.get("/salesman/getlist/:tb_institution_id/:tb_salesman_id", customer.getListBySalesman); 
/**
 * @swagger
 * /customer/{id}:
 *  delete:
 *    summary: Delete the customer by the id
 *    tags: [Customer]
 *    parameters:
 *      - in: path
 *        name: id
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

