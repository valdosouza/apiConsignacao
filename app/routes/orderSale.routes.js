
const { Router } = require("express");

const ordersale = require("../endpoint/orderSale.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

router.post("/getlist", ordersale.getList);

router.post('/save', ordersale.insert);


module.exports = router;