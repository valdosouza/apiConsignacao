const RestDoughController = require("../controller/restDough.controller.js");

class RestDoughEndPoint {

  static create = (req, res) => {

    RestDoughController.create(req.body).then(data => {
      res.send(data);
    })
  }

  static update = (req, res) => {
    const id = req.params.id;

    RestDoughController.update(req.body).then(data => {
      res.send(data);
    })
  }

  static getList(req, res) {

    RestDoughController.getList(req.body).then(data => {
      res.send(data);
    })
  }
}
module.exports =  RestDoughEndPoint; 