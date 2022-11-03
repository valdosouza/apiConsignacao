const LineBusinessController = require("../controller/lineBusiness.controller.js");

class LineBusinessEndPoint {

  static create = (req, res) => {
    
    LineBusinessController.insert(req.body)
      .then(data => {
        res.send(data);
    })
  }

  static getList(req, res) {
    
    LineBusinessController.getList(req.params.tb_institution_id )
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {
    
    LineBusinessController.get(req.params.tb_institution_id,req.params.id )
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    LineBusinessController.update(req.body)
    .then(data => {
      if (data)
        res.send(req.body)
      else
        res.send(data);
    })
  }

  static delete(req, res) {

    LineBusinessController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }
  
}

module.exports = LineBusinessEndPoint; 