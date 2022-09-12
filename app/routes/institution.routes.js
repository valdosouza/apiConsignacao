const { Router } = require("express");

const institution = require("../endpoint/institution.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);

// Create a new Tutorial
router.post("/", institution.create);

// Retrieve all 
router.get("/", institution.findAll);

router.post('/getDelivery', institution.getDelivery);


module.exports = router;  
