const RestPizzaController = require("../controller/restPizza.controller.js");

class RestPizzaEndPoint {

  static create = (req, res) => {

    RestPizzaController.create(req.body).then(data => {
      res.send(data);
    })
  }

  static update = (req, res) => {
    const id = req.params.id;

    RestPizzaController.update(req.body).then(data => {
      res.send(data);
    })
  }

  static getList(req, res) {

    RestPizzaController.getList(req.body).then(data => {
      res.send(data);
    })
  }
}
module.exports =  RestPizzaEndPoint; 