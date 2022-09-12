const RestButtonController = require("../controller/restButton.controller.js");

class RestSubGroupEndPoint {

  static create = (req, res) => {

    RestButtonController.create(req.body).then(data => {
      res.send(data);
    })
  }

  static update = (req, res) => {
    const id = req.params.id;

    RestButtonController.update(req.body).then(data => {
      res.send(data);
    })
  }

  static getList(req, res) {

    RestButtonController.getList(req.body).then(data => {
      res.send(data);
    })
  }

  static getListImage(req, res) {

    RestButtonController.getListImage(req.body).then(data => {
      res.send(data);
    })
  }

}
module.exports =  RestSubGroupEndPoint; 