
  const { Router } = require("express");
  
  const users = require("../endpoint/user.endpoint.js");

  const { withJWTAuthMiddleware } = require("express-kun");
  const router = Router();
  
  const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
  
  
  // Create a new user

  router.post("/", users.create);

  // Retrieve all users
  protectedRouter.get("/", users.findAll);
  //router.get("/", users.findAll);

  // Retrieve a single user with id
  //protectedRouter.get("/:id", users.findOne);
  //router.get("/:id", users.findOne);

  // Update a user with id
  router.put("/:id", users.update);

  // Delete a user with id
  router.delete("/:id", users.delete);

  // Authenticate
  router.post("/authenticate", users.authenticate);
  
  router.get("/authorization", users.authorization);

  module.exports = router;  

