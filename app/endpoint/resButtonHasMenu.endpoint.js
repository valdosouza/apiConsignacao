const RestButtonHasMenu = require("../controller/restButtonHasMenu.controller.js");

class RestButtonHasMenuEndPoint {

  static create = (req, res) => {

    RestButtonHasMenu.create(req.body).then(data => {
      res.send(data);
    })
  }

  static update = (req, res) => {
    const id = req.params.id;

    RestButtonHasMenu.update(req.body).then(data => {
      res.send(data);
    })
  }

  static getList(req, res) {

    RestButtonHasMenu.getList(req.body).then(data => {
      res.send(data);
    })
  }
}
module.exports =  RestButtonHasMenuEndPoint; 