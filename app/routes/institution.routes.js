const { Router } = require("express");
  
const institution =  require("../endpoint/institution.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     Institution:
 *       type: object
 *       required:
 *         - id
 *         - name_company
 *         - nick_trade
 *         - cnpj
 *         - active
 *         - street
 *         - nmbr
 *         - neighborhood
 *         - address_kind
 *         - zip_code
 *         - tb_country_id
 *         - tb_state_id
 *         - tb_city_id
 *         - main 
 *         - phone_kind
 *         - phone_number  
 *       properties:
 *         id:
 *           type: integer
 *         name_company:
 *           type: string
 *         nick_trade:
 *           type: string
 *         tb_line_buiness_id:
 *           type: integer
 *         note:
 *           type: string
 *         active:
 *           type: string
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
 *         address_kind:
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
 *         phone_kind:
 *           type: string
 *         phone_number:
 *           type: string
*/

 /**
  * @swagger
  * tags:
  *   name: Institution
  *   description: The Institution managing API
  */

/**
 * @swagger
 * /institution:
 *   post:
 *     summary: Create a new institution
 *     tags: [Institution]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Institution'
 *     responses:
 *       200:
 *         description: The Institution was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Institution'
 *       500:
 *         description: Some server error
 */
 router.post("/", institution.create);

 /**
 * @swagger
 * /institution/{id}:
 *   get:
 *     summary: Returns the list of all the institution
 *     tags: [Institution]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id institution
 *     responses:
 *       200:
 *         description: The  institution
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Institution'
 */
router.get("/:id", institution.getInstitution);
  
 /**
 * @swagger
 * /institution/{id}:
 *  put:
 *    summary: Update the institution by the id
 *    tags: [Institution]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The institution id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            allOf:
 *              - $ref: '#/components/schemas/Institution'
 *    responses:
 *      200:
 *        description: The Institution was updated       
 *      404:
 *        description: The institution was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/:id", institution.update);

/**
 * @swagger
 * /institution/{id}:
 *  delete:
 *    summary: Delete the institution by the id
 *    tags: [Institution]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The institution id
 *    responses:
 *      200:
 *        description: The institution was deleted
 *      404:
 *        description: The institution was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", institution.delete);

module.exports = router;  