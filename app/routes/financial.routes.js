
const { Router } = require("express");

const financial = require("../endpoint/financial.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

router.post("/getClosed", financial.getClosed);


module.exports = router;