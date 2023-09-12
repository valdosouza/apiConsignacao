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
 * /auditlog/orderconsigment/saveordersale:
 *   post:
 *     summary: Create a new audit log
 *     tags: [AuditLog]
 *     responses:
 *      200:
 *        description: The auditLog was executed
 */
 router.post("/orderconsigment/saveordersale", auditlog.orderConsignmentSaveSale);

module.exports = router;  