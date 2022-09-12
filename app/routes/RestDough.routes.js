const { Router } = require("express");
  
const restDough =  require("../endpoint/restDough.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

  router.post("/getList", restDough.getList);
  
module.exports = router;  