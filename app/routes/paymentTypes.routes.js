const { Router } = require("express");
  
const payment =  require("../endpoint/paymentType.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

router.get("/findAll", payment.findAll);

router.post("/getlist", payment.getlist);
  
module.exports = router;  