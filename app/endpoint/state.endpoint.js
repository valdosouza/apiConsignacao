const StateController = require("../controller/state.controller.js");

class StateEndPoint { 

  static getlist = (req, res) => {
    StateController.getlist()
      .then(data => {
        res.send(data);
      })
  };
  
  static get = (req, res) => {
    const abbreviation = req.params.abbreviation;
    
    StateController.get(abbreviation)
      .then(data => {
      res.send(data);
    })
  };
}

module.exports = StateEndPoint;

