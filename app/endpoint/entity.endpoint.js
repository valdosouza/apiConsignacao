const EntityController = require("../controller/entity.controller.js");

class EntityEndPoint {

  static create = (req, res) => {
    const entity = req.body;    
    EntityController.insert(entity)
      .then(data => {
        res.send(data);
    })
  }

  static getList(req, res) {

    EntityController.getList(req.body).then(data => {
      res.send(data);
    })
  }
  static update = (req, res) => {
    const id = req.params.id;
    const entity = req.body;
    EntityController.update(entity).then(data => {
      res.send(data);
    })
  }

  static delete(req, res) {

    EntityController.delete(req.body).then(data => {
      res.send(data);
    })
  }
  
}

module.exports = EntityEndPoint; 