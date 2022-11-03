const { Router } = require("express");
  
const delivery = require("../endpoint/delivery.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

router.post("/save", delivery.save);

// Retrieve a single  with id
router.get("/:orderID/:institutionID", delivery.findOne);

router.get("/syncronize/:institutionID/:updatedAT", delivery.syncronize);
module.exports = router;  

