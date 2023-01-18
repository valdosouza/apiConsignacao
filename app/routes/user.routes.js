
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
 *         - tb_institution_id
 *         - id
 *         - nick
 *         - email
 *         - password
 *         - kind
 *       properties:
 *         tb_institution_id:
 *           type: integer
 *         id:
 *           type: integer
 *         nick:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         kind:
 *           type: string
 *         tb_device_id:
 *           type: string  
 *         active:
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
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         email:
 *           type: string
 *         jwt:
 *           type: string
 *     RecoveryPassword:
 *       type: object
 *       required:
 *         - email    
 *       properties:
 *         email:
 *           type: string
 *     ChangePassword:
 *       type: object
 *       required:
 *         - tb_user_id
 *         - salt
 *         - newPassword
 *       properties:
 *         tb_user_id:
 *           type: integer
 *         salt: 
 *           type: string
 *         newPassword: 
 *           type: string
 *     RespostaMensagem:
 *       type: object
 *       properties:
 *         message:
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
 * /user:
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
  //router.post("/", users.create);
  protectedRouter.post("/", users.create);

 /**
 * @swagger
 * /user:
 *   put:
 *     summary: Update then user
 *     tags: [User]
 *     parameters:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The User was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
 router.put("/", users.update);
 //protectedRouter.put("/", users.update);

/**
 * @swagger
 * /user/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [User]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The tb_institution_id 
 *     responses:
 *       200:
 *         description: The list of the users by institution
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
  //router.get("/getlist/:tb_institution_id", users.getlist);
  protectedRouter.get("/getlist/:tb_institution_id", users.getlist);

 /**
 * @swagger
 * /user/get/{email}:
 *  get:
 *    summary: Return user by the email
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: email
 *        schema:
 *          type: string
 *        required: true
 *        description: The email user sistema
 *    responses:
 *      200:
 *        description: The user was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/user'
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */  
  //router.get("/get/:email", users.get);
  protectedRouter.get("/get/:email", users.get);


/**
 * @swagger
 * /user/{id}:
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
//router.delete("/:id", users.delete);
protectedRouter.delete("/:id", users.delete);

module.exports = router;  

