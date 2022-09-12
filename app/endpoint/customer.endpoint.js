const CustomerController = require("../controller/customer.controller.js");

class CustomerEndPoint {

  static getByPhone(req, res) {
    CustomerController.getByPhone(req.body.phone).then(data => {
      res.send(data);
    })

  }

  static saveObject(req, res) {
    CustomerController.saveObject(req.body).then(data => {
      res.send(data);
    })
  }

  static getlist(req, res) {
    CustomerController.getList(req.body)
      .then(data => {
        res.send(data);
      })
  }
}
module.exports = CustomerEndPoint; 