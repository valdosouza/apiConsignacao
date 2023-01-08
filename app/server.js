const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
require('dotenv').config();
const cookieParser = require('cookie-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = require('./config/swaggerConfig');
const swaggerSpec = swaggerJsDoc(options);
const routes = require('./routes');


  
let api;
const server = {
  launchServer(){
    return new Promise((resolve,reject) =>{
      try{
        process.env.TZ = "America/Sao_Paulo";        
	      const app = express();
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(cookieParser());

        app.use(cors());

        // parse requests of content-type - application/json
        app.use(bodyParser.json());

        // parse requests of content-type - application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: true }));
        


          
        app.use(cors({    
            origin: "*",
              methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            preflightContinue: true,
            optionsSuccessStatus: 200
        }));

        app.use(function(req, res, next) {
          //res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
          //res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
          next();
        });

        app.get("/", (req, res) => {
            res.json({ message: "Bem vindo a API do Sistema de Consignação." });
        });
              
        app.use( routes);
        
        const PORT = process.env.PORT || 3000;
        app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        
            app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}. \nAPI documentation: ${process.env.PATH_URL_API}/doc`);			
        })
                
      } catch (error){
        console.log(error);
        this.stopServer();
        reject(error);
      }
    });
  },
  stopServer(){
    shutDownServer();
  }
};

module.exports = server;

function shutDownServer(){
  // stop server
  if(api){
    console.log("Server is shutting down...");
    api.close(()=>{
      console.log("server down.");
      process.exit(0);
    });
  } else{
    console.log("Server shutting down...");
    process.exit(0);
  }

  // forcefully shut server down
  setTimeout(()=>{
    console.log("Shutting server down forcefully...");
    process.exit(1);
  }, 3000);
}
