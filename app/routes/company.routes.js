const { Router } = require("express");
  
const company =  require("../endpoint/company.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - id
 *         - cnpj
 *       properties:
 *         id:
 *           type: Integer
 *         cnpj:
 *           type: string  
 *         ie:
 *           type: string
 *         im:
 *           type: string
 *         iest:
 *           type: string
 *         crt:
 *           type: string
 *         crt_modal:
 *           type: string
 *         ind_ie_destinatario:
 *           type: string
 *         iss_ind_exig:
 *           type: string
 *         iss_retencao:
 *           type: string
 *         iss_inc_fiscal:
 *           type: string
 *         iss_process_number:
 *           type: string
 *         send_xml_nfe_only:
 *           type: string
 */

 /**
  * @swagger
  * tags:
  *   name: Company
  *   description: The Companys managing API
  */

/**
 * @swagger
 * /Company:
 *   post:
 *     summary: Create a new company
 *     tags: [Company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Entity'
 *     responses:
 *       200:
 *         description: The Company was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       500:
 *         description: Some server error
 */
 router.post("/", company.create);

 /**
 * @swagger
 * /Company:
 *   get:
 *     summary: Returns the list of all the companies
 *     tags: [Company]
 *     responses:
 *       200:
 *         description: The list of the companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 */

router.get("/", company.getList);
  
 /**
 * @swagger
 * /Company/{id}:
 *  put:
 *    summary: Update the company by the id
 *    tags: [Company]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The company id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Company'
 *    responses:
 *      200:
 *        description: The Company was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Company'
 *      404:
 *        description: The company was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", company.update);

/**
 * @swagger
 * /Company/{id}:
 *  delete:
 *    summary: Delete the company by the id
 *    tags: [Company]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The company id
 *    responses:
 *      200:
 *        description: The company was deleted
 *      404:
 *        description: The company was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", company.delete);

/**
 * @swagger
 * /Company/getbycnpj/{cnpj}:
 *  get:
 *    summary: Return company by the CNPJ
 *    tags: [Company]
 *    parameters:
 *      - in: path
 *        name: cnpj
 *        schema:
 *          type: string
 *        required: true
 *        description: The CNPJ company
 *    responses:
 *      200:
 *        description: The Company was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Company'
 *      404:
 *        description: The company was not found
 *      500:
 *        description: Some error happened
 */
 router.get("/getbycnpj/:cnpj", company.getbycnpj);

module.exports = router;  