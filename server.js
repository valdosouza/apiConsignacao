const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors')
var cookieParser = require('cookie-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Bem vindo a API do Sistema de Consignação." });
});

const userRouter = require("./app/routes/user.routes");
app.use("/users", userRouter);

const delivery = require("./app/routes/delivery.routes");
app.use("/delivery", delivery);

const personRouter = require("./app/routes/person.routes");
app.use("/person", personRouter);

const payment = require("./app/routes/paymentTypes.routes");
app.use("/payment", payment);

const restGroup = require("./app/routes/restGroup.routes");
app.use("/RestGroup", restGroup);

const restSubgroup = require("./app/routes/restSubgroup.routes");
app.use("/RestSubgroup", restSubgroup);

const restButton = require("./app/routes/restButton.routes");
app.use("/RestButton", restButton);

const restPizza = require("./app/routes/restPizza.routes");
app.use("/RestPizza", restPizza);

const restEdge = require("./app/routes/RestEdge.routes");
app.use("/RestEdge", restEdge);

const restDough = require("./app/routes/RestDough.routes");
app.use("/RestDough", restDough);

const restCalzone = require("./app/routes/restCalzone.routes");
app.use("/RestCalzone", restCalzone);

const customer = require("./app/routes/customer.routes");
app.use("/customer", customer);

const entity = require("./app/routes/entity.routes");
app.use("/entity", entity);

const institution = require("./app/routes/institution.routes");
app.use("/institution", institution);

const services = require("./app/routes/service.routes");
app.use("/services", services);

const ordersale = require("./app/routes/orderSale.routes");
app.use("/ordersale", ordersale);

const product = require("./app/routes/product.routes");
app.use("/product", product);

const financial = require("./app/routes/financial.routes");
app.use("/financial", financial);

require("./app/routes/restGroupHasMeasure.routes")(app);
require("./app/routes/resMenuHasIngredient.routes")(app);
require("./app/routes/resGroupHasOptional.routes")(app);
require("./app/routes/restGroupHasAttribute.routes")(app);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
