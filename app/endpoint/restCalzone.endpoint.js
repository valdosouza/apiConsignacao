const RestCalzoneController = require("../controller/restCalzone.controller.js");

class RestCalzoneEndPoint {

  static create = (req, res) => {

    RestCalzoneController.create(req.body).then(data => {
      res.send(data);
    })
  }

  static update = (req, res) => {
    const id = req.params.id;

    RestCalzoneController.update(req.body).then(data => {
      res.send(data);
    })
  }

  static getList(req, res) {

    RestCalzoneController.getList(req.body).then(data => {
      res.send(data);
    })
  }
}
module.exports =  RestCalzoneEndPoint; 