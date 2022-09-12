
const { Router } = require("express");

const product = require("../endpoint/product.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

router.post("/getlist", product.getList);


module.exports = router;