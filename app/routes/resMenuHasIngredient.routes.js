module.exports = app => {
    const Route = require("../controller/restMenuHasIngredient.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all 
    router.get("/findAll", Route.findAll);
  
    // Retrieve a list Institution
    router.post("/getlist/", Route.getlist);    
    
    app.use('/restMenuHasIngredient', router);
  };
  
