
const { Router } = require("express");

const orderconsignment = require("../endpoint/orderConsignment.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

router.post("/getlist", orderconsignment.getList);

router.post('/save', orderconsignment.insert);


module.exports = router;