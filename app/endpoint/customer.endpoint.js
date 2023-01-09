const CustomerController = require("../controller/customer.controller.js");

class CustomerEndPoint {

  static save = (req, res) => {
    try{      
      
      CustomerController.save(req.body)
        .then(data => {            
          var dataRes = {
            id : data.entity.id,
            name_company : data.entity.name_company,
            nick_trade : data.entity.nick_trade,
            doc_kind : "",
            doc_number : "",
          };
          if ( data.person.id > 0) {
            dataRes.doc_kind = "F";
            dataRes.doc_number = data.person.cpf;
          }else{          
            dataRes.doc_kind = "J";
            dataRes.doc_number = data.company.cnpj;
          };
          res.send(dataRes);
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