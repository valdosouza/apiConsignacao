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
    CustomerController.getCustomer(req.params.tb_institution_id,req.params.id)
      .then(data => {
        res.send(data);
      })
  };

  static getList = (req, res) => {      
    CustomerController.getList(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  };

  static getListBySalesRoute = (req, res) => {
    
    CustomerController.getListBySalesRoute(req.params.tb_institution_id,req.params.tb_sales_route_id)
      .then(data => {
        res.send(data);
      })
  };

  static getListBySalesman = (req, res) => {
    
    CustomerController.getListBySalesman(req.params.tb_institution_id,req.params.tb_salesman_id)
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