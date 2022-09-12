const RestSubGroupController = require("../controller/restSubgroup.controller.js");

class RestSubGroupEndPoint {

  static create = (req, res) => {

    RestSubGroupController.create(req.body).then(data => {
      res.send(data);
    })
  }

  static update = (req, res) => {
    const id = req.params.id;

    RestSubGroupController.update(req.body).then(data => {
      res.send(data);
    })
  }

  static getList(req, res) {

    RestSubGroupController.getList(req.body).then(data => {
      res.send(data);
    })
  }
}
module.exports =  RestSubGroupEndPoint; 