const { Router } = require("express");
  
const restCalzone =  require("../endpoint/restCalzone.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

  router.post("/getList", restCalzone.getList);
  
module.exports = router;  