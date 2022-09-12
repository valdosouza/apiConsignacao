  const { Router } = require("express");
  
  const person =  require("../endpoint/person.endpoint.js");

  const { withJWTAuthMiddleware } = require("express-kun");
  const router = Router();
  
  const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

  router.put("/:id", person.update);

  router.post("/getByCPF", person.getByCPF);
    
  module.exports = router;  