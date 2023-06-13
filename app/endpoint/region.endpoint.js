const RegionController = require("../controller/region.controller.js");

class RegionEndPoint {

  static create = (req, res) => {    
    RegionController.insert(req.body)
      .then(data => {
        res.send(data);
    })
  }

  static getList(req, res) {
    
    RegionController.getList(req.params.tb_institution_id )
      .then(data => {
        
        res.send(data);
        
      })
  }

  static getListBySalesman(req, res) {
    
    RegionController.getListBySalesman(req.params.tb_institution_id,req.params.tb_salesman_id )
      .then(data => {
        
        res.send(data);
        
      })
  }

  static get(req, res) {
    
    RegionController.get(req.params.tb_institution_id,req.params.id )
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    RegionController.update(req.body)
      .then(() => {        
        res.send(req.body);
      })
  }

  static delete(req, res) {

    RegionController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }
  
}

module.exports = RegionEndPoint; 