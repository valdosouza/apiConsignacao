const AddressController = require("../controller/address.controller.js");

class AddressEndPoint {

  static create = (req, res) => {
    const address = req.body;
    AddressController.insert(address).then(data => {
      res.send(data);
    })
  }

  static getList(req, res) {

    AddressController.getList(req.body).then(data => {
      res.send(data);
    })
  }
  static update = (req, res) => {
    const id = req.params.id;
    const address = req.body;
    AddressController.update(address).then(data => {
      res.send(data);
    })
  }

  static delete(req, res) {

    AddressController.delete(req.body).then(data => {
      res.send(data);
    })
  }   
}

module.exports = AddressEndPoint; 
