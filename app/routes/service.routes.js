const { Router } = require("express");

const services = require("../endpoint/services.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

router.post("/distance", services.distance);

router.post("/deliveryValue", services.deliveryValue);

router.post("/existWord", services.existWord);

router.get("/teste", services.teste);

module.exports = router;
