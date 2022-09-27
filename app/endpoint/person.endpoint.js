const PersonController = require("../controller/person.controller.js");

class PersonEndPoint {

  static create = (req, res) => {
    const person = req.body;
    PersonController.insert(person).then(data => {
      res.send(data);
    })
  }

  static getList(req, res) {

    PersonController.getList(req.body).then(data => {
      res.send(data);
    })
  }
  static update = (req, res) => {
    const id = req.params.id;
    const person = req.body;
    PersonController.update(person).then(data => {
      res.send(data);
    })
  }

  static delete(req, res) {

    PersonController.delete(req.body).then(data => {
      res.send(data);
    })
  }
  
  static getbycpf(req, res) {       
    const cpf = req.params.cpf;
    
    PersonController.getByCPF(cpf).then(data => {
      res.send(data);
    })
    
  }  
}

module.exports = PersonEndPoint; 