const SalesRouteController = require("../controller/salesRoute.controller.js");

class SalesRouteEndPoint {

  static create = (req, res) => {    
    SalesRouteController.insert(req.body)
      .then(data => {
        res.send(data);
    })
  }

  static getList(req, res) {
    
    SalesRouteController.getList(req.params.tb_institution_id )
      .then(data => {
        
        res.send(data);
        
      })
  }

  static get(req, res) {
    
    SalesRouteController.get(req.params.tb_institution_id,req.params.id )
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    SalesRouteController.update(req.body)
      .then(() => {        
        res.send(req.body);
      })
  }

  static sequence = (req, res) => {
    SalesRouteController.sequence(req.body)
      .then(() => {        
        res.send(req.body);
      })
  }

  static delete(req, res) {

    SalesRouteController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }
  
}

module.exports = SalesRouteEndPoint; 