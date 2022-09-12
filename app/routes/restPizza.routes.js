const { Router } = require("express");
  
const restPizza =  require("../endpoint/restPizza.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

  router.post("/getList", restPizza.getList);
  
module.exports = router;  