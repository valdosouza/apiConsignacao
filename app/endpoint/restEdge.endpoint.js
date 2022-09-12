const RestEdgeController = require("../controller/restEdge.controller.js");

class RestEdgeEndPoint {

  static create = (req, res) => {

    RestEdgeController.create(req.body).then(data => {
      res.send(data);
    })
  }

  static update = (req, res) => {
    const id = req.params.id;

    RestEdgeController.update(req.body).then(data => {
      res.send(data);
    })
  }

  static getList(req, res) {

    RestEdgeController.getList(req.body).then(data => {
      res.send(data);
    })
  }
}
module.exports =  RestEdgeEndPoint; 