  const { Router } = require("express");
  
  const mailing = require("../endpoint/mailing.endpoint.js");

  const { withJWTAuthMiddleware } = require("express-kun");
  const router = Router();
  
  const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
  
  /**
 * @swagger
 * components:
 *   schemas:
 *     Mailing:
 *       type: object
 *       required:
 *         - email
  *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 */  

 /**
  * @swagger
  * tags:
  *   name: Mailing
  *   description: The Mailing managing API
  */

/**
 * @swagger
 * /Mailing:
 *   post:
 *     summary: Create a new email
 *     tags: [Mailing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mailing'
 *     responses:
 *       200:
 *         description: The Mailing was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mailing'
 *       500:
 *         description: Some server error
 */
  router.post("/", mailing.create);

  /**
 * @swagger
 * /Mailing:
 *   get:
 *     summary: Returns the list of all the mailing
 *     tags: [Mailing]
 *     responses:
 *       200:
 *         description: The list of the mailing
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mailing'
 */
  //protectedRouter.get("/", mailing.findAll);
  router.get("/", mailing.findAll);

 /**
 * @swagger
 * /Mailing/{email}:
 *  get:
 *    summary: Return email by the id
 *    tags: [Mailing]
 *    parameters:
 *      - in: path
 *        name: email
 *        schema:
 *          type: string
 *        required: true
 *        description: The email
 *    responses:
 *      200:
 *        description: The email was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Mailing'
 *      404:
 *        description: The email was not found
 *      500:
 *        description: Some error happened
 */
  //protectedRouter.get("/:id", mailing.findOne);
  router.get("/:email", mailing.findOne);

  /**
 * @swagger
 * /Mailing/{id}:
 *  put:
 *    summary: Update the mailing by the id
 *    tags: [Address]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The email id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Mailing'
 *    responses:
 *      200:
 *        description: The email was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Mailing'
 *      404:
 *        description: The email was not found
 *      500:
 *        description: Some error happened
 */
  //protectedRouter.put("/:id", mailing.update);
  router.put("/:id", mailing.update);

/**
 * @swagger
 * /Mailing/{id}:
 *  delete:
 *    summary: Delete the email by the id
 *    tags: [Mailing]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The email id
 *    responses:
 *      200:
 *        description: The email was deleted
 *      404:
 *        description: The email was not found
 *      500:
 *        description: Some error happened
 */
  //protectedRouter.put("/:id", mailing.update);
  router.delete("/:id", mailing.delete);


  module.exports = router;  

