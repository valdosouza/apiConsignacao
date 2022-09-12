  const { Router } = require("express");
  
  const restGroup =  require("../endpoint/restGroup.endpoint.js");

  const { withJWTAuthMiddleware } = require("express-kun");
  const router = Router();
  
  const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

    router.post("/getList", restGroup.getList);
    
  module.exports = router;  