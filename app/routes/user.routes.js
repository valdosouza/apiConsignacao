
  const { Router } = require("express");
  
  const users = require("../endpoint/user.endpoint.js");

  const { withJWTAuthMiddleware } = require("express-kun");
  const router = Router();
  
  const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
  
  /**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - Institution
 *         - id
 *         - nick
 *         - email
 *         - password
 *         - kind
 *       properties:
 *         Institution:
 *           type: string
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
 *     RecoveryPassword:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *     ChangePassword:
 *       type: object
 *       required:
 *         - user
 *         - email
 *         - salt
 *         - newPassword
 *       properties:
 *         user:
 *           type: string
 *         email: 
 *           type: string
 *         salt: 
 *           type: string
 *         newPassword: 
 *           type: string
 */
  

 /**
  * @swagger
  * tags:
  *   name: User
  *   description: The User managing API
  */

/**
 * @swagger
 * /User:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The User was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
  router.post("/", users.create);

  /**
 * @swagger
 * /User:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
  //protectedRouter.get("/", users.findAll);
  router.get("/", users.findAll);

 /**
 * @swagger
 * /User/{id}:
 *  get:
 *    summary: Return user by the id
 *    tags: [User]
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
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */
  //protectedRouter.get("/:id", users.findOne);
  router.get("/:id", users.findOne);

  /**
 * @swagger
 * /User/{id}:
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
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: The user was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */
  //protectedRouter.put("/:id", users.update);
  router.put("/:id", users.update);

/**
 * @swagger
 * /User/{id}:
 *  delete:
 *    summary: Delete the user by the id
 *    tags: [User]
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
 * /user/authenticate:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: The User was authenticate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       500:
 *         description: Some server error
 */
  router.post("/authenticate", users.authenticate);
  
/** 
 * @swagger
 * /user/recoverypassword:
 *   post:
 *     summary: gera uma chave de controle, cria link para a troca da senha
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecoveryPassword'
 *     responses:
 *       200:
 *         description: Utilize a Chave para enviar a troca de senha
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecoveryPassword'
 *       500:
 *         description: Some server error
 */
 router.post("/recoverypassword", users.recoveryPassword);

/** 
 * @swagger
 * /user/changepassword:
 *   post:
 *     summary: Recebe um hash e um id para trocar a senha
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePassword'
 *     responses:
 *       200:
 *         description: Utilize a Chave para enviar a troca de senha
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChangePassword'
 *       500:
 *         description: Some server error
 */
 router.post("/changepassword", users.changePassword);

/**
 * 
 */
router.get("/authorization", users.authorization);

  module.exports = router;  

