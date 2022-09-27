
  const { Router } = require("express");
  
  const users = require("../endpoint/user.endpoint.js");

  const { withJWTAuthMiddleware } = require("express-kun");
  const router = Router();
  
  const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
  
  /**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - id
 *         - nick
 *         - email
 *         - password
 *         - kind
  *       properties:
 *         id:
 *           type: string
 *         nick:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         kind:
 *           type: string
 *         cpf:
 *           type: string  
 *     Auth:
 *       type: object
 *       required:
 *         - email
 *         - password 
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         auth:
 *           type: string
 *         id:
 *           type: string
 *         institution:
 *           type: string
 *         email:
 *           type: string
 *         jwt:
 *           type: string
 */
  

 /**
  * @swagger
  * tags:
  *   name: Users
  *   description: The Users managing API
  */

/**
 * @swagger
 * /Users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Users'
 *     responses:
 *       200:
 *         description: The Users was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       500:
 *         description: Some server error
 */
  router.post("/", users.create);

  /**
 * @swagger
 * /Users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Users'
 */
  //protectedRouter.get("/", users.findAll);
  router.get("/", users.findAll);

 /**
 * @swagger
 * /Users/{id}:
 *  get:
 *    summary: Return user by the id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id user
 *    responses:
 *      200:
 *        description: The USer was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Users'
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */
  //protectedRouter.get("/:id", users.findOne);
  router.get("/:id", users.findOne);

  /**
 * @swagger
 * /Users/{id}:
 *  put:
 *    summary: Update the users by the id
 *    tags: [Address]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Users'
 *    responses:
 *      200:
 *        description: The user was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Users'
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */
  //protectedRouter.put("/:id", users.update);
  router.put("/:id", users.update);

/**
 * @swagger
 * /Users/{id}:
 *  delete:
 *    summary: Delete the user by the id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    responses:
 *      200:
 *        description: The user was deleted
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */
  //protectedRouter.put("/:id", users.update);
  router.delete("/:id", users.delete);

 /** 
 * @swagger
 * /users/authenticate:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: The Users was authenticate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       500:
 *         description: Some server error
 */
  router.post("/authenticate", users.authenticate);
  
  router.get("/authorization", users.authorization);

  module.exports = router;  

