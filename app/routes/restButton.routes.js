const { Router } = require("express");
  
const restButton =  require("../endpoint/resButton.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

router.post("/getList", restButton.getList);

router.post("/getListImage", restButton.getListImage);
  
module.exports = router;  