const PhoneController = require("../controller/address.controller.js");

class PhoneEndPoint {

  static create = (req, res) => {
    const phone = req.body;
    PhoneController.insert(phone).then(data => {
      res.send(data);
    })
  }

  static getList(req, res) {

    PhoneController.getList(req.body).then(data => {
      res.send(data);
    })
  }
  static update = (req, res) => {
    const id = req.params.id;
    const phone = req.body;
    PhoneController.update(phone).then(data => {
      res.send(data);
    })
  }

  static delete(req, res) {

    PhoneController.delete(req.body).then(data => {
      res.send(data);
    })
  }   
}

module.exports = PhoneEndPoint; 
