
  const { Router } = require("express");
  
  const city = require("../endpoint/city.endpoint.js");

  const { withJWTAuthMiddleware } = require("express-kun");
  const router = Router();
  
  const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
  
  /**
 * @swagger
 * components:
 *   schemas:
 *     City:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         tb_state_id:
 *           type: string
 *         name:
 *           type: string
 *         aliq_iss:
 *           type: string
 *         population:
 *           type: string
 *         density:
 *           type: string 
 *         area:
 *           type: string  
 */  
   
 /**
  * @swagger
  * tags:
  *   name: City
  *   description: The City managing API
  */

/**
 * @swagger
 * /city/getlist/{tb_state_id}:
 *  get:
 *    summary: Return City by the UF
 *    tags: [City]
 *    parameters:
 *      - in: path
 *        name: tb_state_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Cities of State
 *    responses:
 *      200:
 *        description: The Cities was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/City'
 *      404:
 *        description: The Cities was not found
 *      500:
 *        description: Some error happened
 */
//protectedRouter.get("/", users.findAll);
router.get("/getlist/:tb_state_id", city.getlist);

 /**
 * @swagger
 * /city/get/{ibge}:
 *  get:
 *    summary: Return City by the IBGE
 *    tags: [City]
 *    parameters:
 *      - in: path
 *        name: ibge
 *        schema:
 *          type: string
 *        required: true
 *        description: The IBGE city
 *    responses:
 *      200:
 *        description: The City was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/City'
 *      404:
 *        description: The City was not found
 *      500:
 *        description: Some error happened
 */
  //protectedRouter.get("/:id", users.findOne);
  router.get("/get/:ibge", city.getbyIbge);

/**
 * @swagger
 * /city/get/{state_sigla}/{city_name}:
 *  get:
 *    summary: Return City by the State Abreviation and City Name
 *    tags: [City]
 *    parameters:
 *      - in: path
 *        name: state_sigla
 *      - in: path
 *        name: city_name  
 *        schema:
 *          type: string
 *        required: true
 *        description: The State Abreviation and City Name
 *    responses:
 *      200:
 *        description: The City was Listed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/City'
 *      404:
 *        description: The City was not found
 *      500:
 *        description: Some error happened
 */
  //protectedRouter.get("/:id", users.findOne);
  router.get("/get/:state_sigla/:city_name", city.getbyStateName);

module.exports = router;  

