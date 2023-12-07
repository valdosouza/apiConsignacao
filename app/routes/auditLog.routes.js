const { Router } = require("express");
  
const auditlog =  require("../endpoint/auditLog.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 * 
 */

 /**
  * @swagger
  * tags:
  *   name: AuditLog
  *   description: The AuditLog managing API
  */

 /**
 * @swagger
 * /auditlog/consignment/supplying:
 *   post:
 *     summary: Create a new audit log
 *     tags: [AuditLog]
 *     responses:
 *      200:
 *        description: The auditLog was executed
 */
 router.post("/consignment/supplying", auditlog.orderConsignmentSupplying);

 /**
 * @swagger
 * /auditlog/consignment/checkout:
 *   post:
 *     summary: Create a new audit log
 *     tags: [AuditLog]
 *     responses:
 *      200:
 *        description: The auditLog was executed
 */
 router.post("/consignment/checkout", auditlog.orderConsignmentCheckout);

 /**
 * @swagger
 * /auditlog/ordersalecard/checkitems:
 *   post:
 *     summary: Create a new audit log
 *     tags: [AuditLog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           properties:
 *             lista: string 
 *     responses:
 *      200:
 *        description: The auditLog was executed
 */
 router.post("/ordersalecard/checkitems", auditlog.orderSaleCardCheckItems);

 /**
 * @swagger
 * /auditlog/orderconsigment/cardtosale:
 *   post:
 *     summary: Create a new audit log
 *     tags: [AuditLog]
 *     responses:
 *      200:
 *        description: The auditLog was executed
 */
 router.post("/orderconsigment/cardtosale", auditlog.orderConsignmentCardToSale);

/**
 * @swagger
 * /auditlog/orderconsigment/cardtostocktransfer:
 *   post:
 *     summary: Create a new audit log
 *     tags: [AuditLog]
 *     responses:
 *      200:
 *        description: The auditLog was executed
 */
router.post("/orderconsigment/cardtostocktransfer", auditlog.orderConsignmentCardToStockTransfer);

/**
 * @swagger
 * /auditlog/orderconsigment/cardtoconsignment:
 *   post:
 *     summary: Create a new audit log
 *     tags: [AuditLog]
 *     responses:
 *      200:
 *        description: The auditLog was executed
 */
router.post("/orderconsigment/cardtoconsignment", auditlog.orderConsignmentCardToConsignment);

/**
 * @swagger
 * /auditlog/orderconsigment/cardtobonus:
 *   post:
 *     summary: Create a new audit log
 *     tags: [AuditLog]
 *     responses:
 *      200:
 *        description: The auditLog was executed
 */
router.post("/orderconsigment/cardtobonus", auditlog.orderConsignmentCardToBonus);

/**
 * @swagger
 * /auditlog/orderconsigment/tworecords:
 *   post:
 *     summary: Veirify two records by operation
 *     tags: [AuditLog]
 *     responses:
 *      200:
 *        description: The auditLog was executed
 */
router.post("/orderconsigment/tworecords", auditlog.verifyTwoRecords);


/**
 * @swagger
 * /auditlog/stockstatement/ordersale:
 *   post:
 *     summary: Create a new audit log
 *     tags: [AuditLog]
 *     responses:
 *      200:
 *        description: The auditLog was executed
 */
router.post("/stockstatement/ordersale", auditlog.stockSatementOrderSale);

/**
 * @swagger
 * /auditlog/stockstatement/orderconsignment:
 *   post:
 *     summary: Create a new audit log
 *     tags: [AuditLog]
 *     responses:
 *      200:
 *        description: The auditLog was executed
 */
router.post("/stockstatement/orderconsignment", auditlog.stockSatementOrderConsignment);

/**
 * @swagger
 * /auditlog/stockstatement/orderstocktransfer:
 *   post:
 *     summary: Create a new audit log
 *     tags: [AuditLog]
 *     responses:
 *      200:
 *        description: The auditLog was executed
 */
router.post("/stockstatement/orderstocktransfer", auditlog.stockSatementOrderStockTransfer);

/**
 * @swagger
 * /auditlog/stockstatement/stockbalance:
 *   post:
 *     summary: Create a new audit log
 *     tags: [AuditLog]
 *     responses:
 *      200:
 *        description: The auditLog was executed
 */
router.post("/stockstatement/stockbalance", auditlog.stockSatementStockBalance);

module.exports = router;  