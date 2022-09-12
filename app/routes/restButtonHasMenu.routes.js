const { Router } = require("express");
  
const restBHM =  require("../endpoint/resButtonHasMenu.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

  router.post("/getList", restBHM.getList);
  
module.exports = router;  