const CityController = require("../controller/city.controller.js");

class CityEndPoint { 

  static getlist = (req, res) => {
              
    CityController.getlist(req.params.tb_state_id)
      .then(data => {
        res.send(data);
      })
  };
  
  static getbyIbge = (req, res) => {         
    CityController.getbyIbge(req.params.ibge)
      .then(data => {
      res.send(data);
    })
  };
  static getbyStateName = (req, res) => {
           
    CityController.getbyStateName(req.params.state_sigla, req.params.city_name)
      .then(data => {
      res.send(data);
    })
  };  
}

module.exports = CityEndPoint;

