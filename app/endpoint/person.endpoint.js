const PersonController = require("../controller/person.controller.js");

class PersonEndPoint {

  static create = (req, res) => {

    PersonController.create(req.body).then(data => {
      res.send(data);
    })
  }

  static update = (req, res) => {
    const id = req.params.id;

    PersonController.update(req.body).then(data => {
      res.send(data);
    })
  }

  static getByCPF(req, res) {

    PersonController.getByCPF(req.body.cpf).then(data => {
      res.send(data);
    })
  }
}
module.exports =  PersonEndPoint; 