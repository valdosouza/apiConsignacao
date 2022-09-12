const { Router } = require("express");
  
const restEdge =  require("../endpoint/restEdge.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

  router.post("/getList", restEdge.getList);
  
module.exports = router;  