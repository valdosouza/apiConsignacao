const CustomerController = require("../controller/customer.controller.js");

class CustomerEndPoint {

  static create = (req, res) => {
    try{
      CustomerController.save(req.body)
        .then(data => {        
          res.send(data);
      })
    } catch (err) {
      res.send(err);
    }
  }

  static getCustomer = (req, res) => {
    const id = req.params.id;
    CustomerController.getCustomer(id)
      .then(data => {
        res.send(data);
      })
  };

  static delete(req, res) {
    CustomerController.delete(req.body).then(data => {
      res.send(data);
    })
  }   
}

module.exports = CustomerEndPoint;