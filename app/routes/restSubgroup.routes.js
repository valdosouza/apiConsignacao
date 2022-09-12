  const { Router } = require("express");
  
  const restSubgroup =  require("../endpoint/restSubgroup.endpoint.js");

  const { withJWTAuthMiddleware } = require("express-kun");
  const router = Router();
  
  const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

    router.post("/getList", restSubgroup.getList);
    
  module.exports = router;  