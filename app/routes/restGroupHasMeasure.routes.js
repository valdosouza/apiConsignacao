module.exports = app => {
  const Route = require("../controller/restGroupHasMeasure.controller.js");

  var router = require("express").Router();

  // Retrieve all 
  router.get("/", Route.findAll);

  // Retrieve a list Institution
  router.post("/getlist/", Route.getlist);
  

  
  app.use('/restGhMea', router);
};
