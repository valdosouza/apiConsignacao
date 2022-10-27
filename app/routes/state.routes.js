
  const { Router } = require("express");
  
  const state = require("../endpoint/state.endpoint.js");

  const { withJWTAuthMiddleware } = require("express-kun");
  const router = Router();
  
  const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
  
  /**
 * @swagger
 * components:
 *   schemas:
 *     State:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         tb_country_id:
 *           type: string
 *         abbreviation:
 *           type: string
 *         name:
 *           type: string
 */  

 /**
  * @swagger
  * tags:
  *   name: State
  *   description: The State managing API
  */

/**
 * @swagger
 * /state/getlist/:
 *  get:
 *    summary: Return State by the UF
 *    tags: [State]
  *    responses:
 *      200:
 *        description: The States was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/State'
 *      404:
 *        description: The State was not found
 *      500:
 *        description: Some error happened
 */
//protectedRouter.get("/", users.findAll);
router.get("/getlist/", state.getlist);

 /**
 * @swagger
 * /state/get/{abbreviation}:
 *  get:
 *    summary: Return Stater by the UF
 *    tags: [State]
 *    parameters:
 *      - in: path
 *        name: abbreviation
 *        schema:
 *          type: string
 *        required: true
 *        description: The State abbreviation
 *    responses:
 *      200:
 *        description: The State was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/State'
 *      404:
 *        description: The State was not found
 *      500:
 *        description: Some error happened
 */
  //protectedRouter.get("/:id", users.findOne);
  router.get("/get/:abbreviation", state.get);

module.exports = router;  

