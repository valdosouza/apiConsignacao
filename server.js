const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const corsOptions ={
	"origin": "*",
	"methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
	"preflightContinue": false,
	"optionsSuccessStatus": 200
  }
const cookieParser = require('cookie-parser');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API - Consignação",
			version: "1.0.0",
			description: "API para sistema de Consignação",
		},
		servers: [
			{
				//url: "http://localhost:3000"
				url: "https://api.industriadechocolatesamor.com.br"
			},
		],
	},
	apis: ["./app/routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());



//app.use(cors());
app.use(cors(corsOptions)) 
app.options('*', cors()) 

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Bem vindo a API do Sistema de Consignação." });
});

const userRouter = require("./app/routes/user.routes");
app.use("/user", userRouter);

const mailingRouter = require("./app/routes/mailing.routes");
app.use("/mailing", mailingRouter);

const entity = require("./app/routes/entity.routes");
app.use("/entity", entity);

const company = require("./app/routes/company.routes");
app.use("/company", company);

const person = require("./app/routes/person.routes");
app.use("/person", person);

const address = require("./app/routes/address.routes");
app.use("/address", address);

const phone = require("./app/routes/phone.routes");
app.use("/phone", phone);

const institution = require("./app/routes/institution.routes");
app.use("/institution", institution);



const stockList = require("./app/routes/stock_list.routes");
app.use("/stocklist", stockList);

const PORT = process.env.PORT || 3000;

app.use("/doc", swaggerUI.serve, swaggerUI.setup(specs));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}. \nAPI documentation: http://localhost:3000/doc`)
})
