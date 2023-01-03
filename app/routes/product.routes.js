const { Router } = require("express");
  
const product =  require("../endpoint/product.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
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
 * 
 *     PriceListPrice:
 *       type: object
 *       required:
 *         - tb_price_list_id
 *         - price_tag
 *       properties:  
 *         tb_price_list_id:
 *           type: integer
 *         name_price_list:
 *           type: string
 *         price_tag:
 *           type: number
 * 
 *     ProductMain:
 *       type: object
 *       properties:
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         priceilist:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/PriceListPrice'
 * 
 *     ProductPrice:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name_product:
 *           type: string
 *         price_tag:
 *           type: number 
 * 
 *     PriceListProductPrice:
 *       type: object
 *       properties:
 *         tb_price_list_id:
 *           type: integer
 *         name_price_list:
 *           type: string
 *         product_price:
 *           type: array
 *           items: 
 *             $ref: '#/components/schemas/ProductPrice' 
 */

 /**
  * @swagger
  * tags:
  *   name: Product
  *   description: The Product managing API
  */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductMain'
 *     responses:
 *       200:
 *         description: The Product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductMain'
 *       500:
 *         description: Some server error
 */
 router.post("/", product.create);

 /**
 * @swagger
 * /product/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the Products
 *     tags: [Product]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The product tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the payment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

router.get("/getlist/:tb_institution_id", product.getList);
  
/**
 * @swagger
 * /product/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the Product
 *     tags: [Product]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The product by tb_institution_id and....
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The product by id
 *     responses:
 *       200:
 *         description: The Product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductMain'
 */

 router.get("/get/:tb_institution_id/:id", product.get);

/**
 * @swagger
 * /product/pricelist/getall/{tb_institution_id}:
 *   get:
 *     summary: Returns the List os PriceList and Products
 *     tags: [Product]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The product and price by tb_institution_id 
 *     responses:
 *       200:
 *         description: The Product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PriceListProductPrice'
 */

router.get("/pricelist/getall/:tb_institution_id/", product.priceListGetAll);

 /**
 * @swagger
 * /product:
 *  put:
 *    summary: Update the product by the id
 *    tags: [Product]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ProductMain'
 *    responses:
 *      200:
 *        description: The Product was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProductMain'
 *      404:
 *        description: The product was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", product.update);

/**
 * @swagger
 * /product/{id}:
 *  delete:
 *    summary: Delete the product by the id
 *    tags: [Product]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The product id
 *    responses:
 *      200:
 *        description: The Product was deleted
 *      404:
 *        description: The product was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", product.delete);

module.exports = router;