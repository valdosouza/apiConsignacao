const Controller = require("./controller.js");

class SalesmanEndPoint { 

  static getlist = (req, res) => {
    Controller.getlist(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  };
  
}

module.exports = SalesmanEndPoint;

