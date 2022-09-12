module.exports = app => {
  const route = require("../controller/restGroupHasAttribute.controller.js");

  var router = require("express").Router();

  // Retrieve all 
  router.get("/", route.findAll);

  // Retrieve a list Institution
  router.post("/getlist/", route.getlist);
  

  
  app.use('/restGhAtt', router);
};
