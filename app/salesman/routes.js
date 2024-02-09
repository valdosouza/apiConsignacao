
  const { Router } = require("express");
  
  const Salesman = require("./endpoint");

  const { withJWTAuthMiddleware } = require("express-kun");
  const router = Router();
  
  const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
  
  /**
 * @swagger
 * components:
 *   schemas:
 *     Salesman:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         tb_isntitution_id:
 *           type: string
 *         name:
 *           type: string
 *         nick:
 *           type: string
 */  

 /**
  * @swagger
  * tags:
  *   name: Salesman
  *   description: The Salesman managing API
  */

/**
 * @swagger
 * /salesman/getlist/{tb_institution_id}:
 *  get:
 *    summary: Return Salesman List
 *    tags: [Salesman]
 *    parameters:
 *     - in: path
 *       name: tb_institution_id
 *    responses:
 *      200:
 *        description: The Salesman was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Salesman'
 *      404:
 *        description: The Salesman was not found
 *      500:
 *        description: Some error happened
 */
protectedRouter.get("/getlist/:tb_institution_id", Salesman.getlist);


module.exports = router;  

