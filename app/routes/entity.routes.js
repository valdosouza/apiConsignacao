const { Router } = require("express");
  
const entity =  require("../endpoint/entity.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

  router.get("/getList", entity.getList);
  
module.exports = router;  