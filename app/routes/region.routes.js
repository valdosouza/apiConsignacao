const { Router } = require("express");
  
const region =  require("../endpoint/region.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     Region:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - description
 *         - tb_salesman_id 
 *         - active
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         tb_salesman_id:
 *           type: integer  
 *         salesman_name:
 *           type: string         
 *         description:
 *           type: string
 *         active:
 *           type: string
 *  
 */

 /**
  * @swagger
  * tags:
  *   name: Region
  *   description: The Region managing API
  */

/**
 * @swagger
 * /region:
 *   post:
 *     summary: Create a new region
 *     tags: [Region]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Region'
 *     responses:
 *       200:
 *         description: The Region was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Region'
 *       500:
 *         description: Some server error
 */
 router.post("/", region.create);

 /**
 * @swagger
 * /region/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the Region
 *     tags: [Region]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The region by tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the region
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Region'
 */

router.get("/getlist/:tb_institution_id", region.getList);
  

 /**
 * @swagger
 * /region/salesman/getlist/{tb_institution_id}/{tb_salesman_id}:
 *   get:
 *     summary: Returns the list of all the Region
 *     tags: [Region]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: integer
 *      - in: path
 *        name: tb_salesman_id
 *        schema:
 *          type: integer
 *        description: The region by tb_institution_id/tb_salesman_id
 *     responses:
 *       200:
 *         description: The list of the region
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Region'
 */

 router.get("/salesman/getlist/:tb_institution_id/:tb_salesman_id", region.getListBySalesman);

/**
 * @swagger
 * /region/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the Region
 *     tags: [Region]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The region by tb_institution_id and id
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The region by id
 *     responses:
 *       200:
 *         description: The SalesRoute
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Region'
 */

 router.get("/get/:tb_institution_id/:id", region.get);
 
 /**
 * @swagger
 * /region:
 *  put:
 *    summary: Update the region by the id
 *    tags: [Region]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Region'
 *    responses:
 *      200:
 *        description: The Region was updated
 *      404:
 *        description: The Region was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", region.update);


/**
 * @swagger
 * /region/{id}:
 *  delete:
 *    summary: Delete the region by the id
 *    tags: [Region]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The region id
 *    responses:
 *      200:
 *        description: The region was deleted
 *      404:
 *        description: The region was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", region.delete);

module.exports = router;