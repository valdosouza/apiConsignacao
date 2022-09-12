
const { Router } = require("express");

const customer = require("../endpoint/customer.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

router.post("/saveObject", customer.saveObject);

router.post('/getByPhone', customer.getByPhone);

router.post('/getList', customer.getlist);

module.exports = router;



