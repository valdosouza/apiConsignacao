const RestGroupController = require("../controller/restGroup.controller.js");

class RestGroupEndPoint {

  static create = (req, res) => {

    RestGroupController.create(req.body).then(data => {
      res.send(data);
    })
  }

  static update = (req, res) => {
    const id = req.params.id;

    RestGroupController.update(req.body).then(data => {
      res.send(data);
    })
  }

  static getList(req, res) {

    RestGroupController.getList(req.body).then(data => {
      res.send(data);
    })
  }
}
module.exports =  RestGroupEndPoint; 