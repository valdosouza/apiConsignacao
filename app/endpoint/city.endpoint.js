const CityController = require("../controller/city.controller.js");

class CityEndPoint { 

  static getlist = (req, res) => {
    const stateID = req.params.tb_state_id;
           
    CityController.getlist(stateID)
      .then(data => {
        res.send(data);
      })
  };
  
  static get = (req, res) => {
    const ibge = req.params.ibge;
       
    CityController.get(ibge)
      .then(data => {
      res.send(data);
    })
  };
}

module.exports = CityEndPoint;

