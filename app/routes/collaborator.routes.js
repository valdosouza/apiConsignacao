const { Router } = require("express");

const collaborator = require("../endpoint/collaborator.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     Collaborator:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer 
 *         dt_admission:
 *           type: string
 *         dt_resignation:
 *           type: string  
 *         salary:
 *           type: number
 *         pis:
 *           type: string
 *         fahters_name:
 *           type: string
 *         mothers_name:
 *           type: string
 *         vote_number:
 *           type: string
 *         vote_zone:
 *           type: string
 *         vote_section:
 *           type: string
 *         military_certificate:
 *           type: string
 *         active:
 *           type: string 
 * 
 *     UserColab:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 * 
 *     ObjCollaborator:
 *       type: object
 *       properties:
 *         collaborator:
 *           $ref: '#/components/schemas/Collaborator'
 *         entity:
 *           $ref: '#/components/schemas/Entity' 
 *         person:
 *           $ref: '#/components/schemas/Person'  
 *         address:
 *           $ref: '#/components/schemas/Address' 
 *         phone:
 *           $ref: '#/components/schemas/Phone'  
 *         user:
 *           $ref: '#/components/schemas/UserColab'               
 
 *     ListCollaborator:
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
 *         tb_linebusiness_id:
 *           type: integer
 *         name_linebusiness:
 *           type: string  
 *  
 */

/**
 * @swagger
 * tags:
 *   name: Collaborator
 *   description: The Collaborator managing API
 */

/**
 * @swagger
 * /collaborator:
 *   post:
 *     summary: Create a new collaborator
 *     tags: [Collaborator]
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ObjCollaborator'
 *     responses:
 *       200:
 *         description: The Collaborator was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListCollaborator'
 *       500:
 *         description: Some server error
 */
router.post("/", collaborator.save);

/**
* @swagger
* /collaborator/getlist/{tb_institution_id}:
*   get:
*     summary: Returns the list of all the Collaborator
*     tags: [Collaborator]
*     parameters:
*      - in: path
*        name: tb_institution_id
*        schema:
*          type: integer  
*        required: true
*        description: The Collaborator tb_institution_id
*     responses:
*       200:
*         description: The list of collaborator
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/ListCollaborator'
*       500:
*         description: Some server error 
*/
router.get("/getlist/:tb_institution_id/", collaborator.getList);

/**
 * @swagger 
 * /collaborator/{tb_institution_id}/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Returns the list of all the collaborator
 *     tags: [Collaborator]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: id
 *     responses:
 *       200:
 *         description: The  collaborator
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/ObjCollaborator'
 */
router.get("/:tb_institution_id/:id/", collaborator.get);

/**
 * @swagger
 * /collaborator/{id}:
 *  delete:
 *    summary: Delete the collaborator by the id
 *    tags: [Collaborator]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The collaborator id
 *    responses:
 *      200:
 *        description: The collaborator was deleted
 *      404:
 *        description: The institution was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", collaborator.delete);

module.exports = router;  