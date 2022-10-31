const { Router } = require("express");
  
const lineBusiness =  require("../endpoint/lineBusiness.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     LineBusiness:
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
 *         active:
 *           type: string
 */

 /**
  * @swagger
  * tags:
  *   name: LineBusiness
  *   description: The LineBusiness managing API
  */

/**
 * @swagger
 * /linebusiness:
 *   post:
 *     summary: Create a new lineBusiness
 *     tags: [LineBusiness]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LineBusiness'
 *     responses:
 *       200:
 *         description: The LineBusiness was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LineBusiness'
 *       500:
 *         description: Some server error
 */
 router.post("/", lineBusiness.create);

 /**
 * @swagger
 * /linebusiness/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the LineBusinesss
 *     tags: [LineBusiness]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The lineBusiness tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the payment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LineBusiness'
 */

router.get("/getlist/:tb_institution_id", lineBusiness.getList);
  
/**
 * @swagger
 * /linebusiness/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the LineBusiness
 *     tags: [LineBusiness]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The lineBusiness by tb_institution_id and....
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The lineBusiness by id
 *     responses:
 *       200:
 *         description: The LineBusiness
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LineBusiness'
 */

 router.get("/get/:tb_institution_id/:id", lineBusiness.get);
 /**
 * @swagger
 * /lineBusiness:
 *  put:
 *    summary: Update the lineBusiness by the id
 *    tags: [LineBusiness]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LineBusiness'
 *    responses:
 *      200:
 *        description: The LineBusiness was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LineBusiness'
 *      404:
 *        description: The lineBusiness was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", lineBusiness.update);

/**
 * @swagger
 * /lineBusiness/{id}:
 *  delete:
 *    summary: Delete the lineBusiness by the id
 *    tags: [LineBusiness]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The lineBusiness id
 *    responses:
 *      200:
 *        description: The LineBusiness was deleted
 *      404:
 *        description: The lineBusiness was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", lineBusiness.delete);

module.exports = router;