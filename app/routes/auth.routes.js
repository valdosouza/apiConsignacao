const { Router } = require("express");
  
const auth = require("../endpoint/auth.endpoint.js");
const { withJWTAuthMiddleware } = require("express-kun");

const router = Router();
const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
  
/**
 * @swagger
 * components:
 *   schemas:
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
  *   name: Authorization
  *   description: The Authentication managing API
  */

 /** 
 * @swagger
 * /auth/authenticate:
 *   post:
 *     summary: Do the Authentication
 *     tags: [Authorization]
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
  router.post("/authenticate", auth.authenticate);
  
/** 
 * @swagger
 * /auth/recoverypassword:
 *   post:
 *     summary: gera uma chave de controle, cria link para a troca da senha
 *     tags: [Authorization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecoveryPassword'
 *     responses:
 *       200:
 *         description: Um e-mail será enviado com link para efetuar a troca
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespostaMensagem'
 *       500:
 *         description: Some server error
 */
 router.post("/recoverypassword", auth.recoveryPassword);

/** 
 * @swagger
 * /auth/changepassword:
 *   post:
 *     summary: Recebe um hash e um id para trocar a senha
 *     tags: [Authorization]
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
 router.post("/changepassword", auth.changePassword);

/** 
 * @swagger
 * /auth/authorization:
 *   get:
 *     summary: Verifica se o token é valido
 *     tags: [Authorization]
 *     responses:
 *       200:
 *         description: Utilizado para permancer logado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespostaMensagem'
 *       500:
 *         description: Some server error
 */
protectedRouter.get("/authorization", auth.authorization);

module.exports = router;  

