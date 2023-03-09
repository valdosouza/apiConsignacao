const CustomerController = require("../controller/customer.controller.js");

class CustomerEndPoint {

  static save = (req, res) => {
    try {
      var docNumber = "";
      if (req.body.person) {
        docNumber = req.body.person.cpf;
      }
      if (docNumber == "") {
        docNumber = req.body.company.cnpj;
      }
      console.log(docNumber);
      CustomerController.getByDocNumber(req.body.customer.tb_institution_id, docNumber)
        .then(dataDocnumber => {
          console.log(dataDocnumber);
          if (dataDocnumber.tb_salesman_id == req.body.customer.tb_salesman_id) {
            
            CustomerController.save(req.body)
              .then(data => {
                var dataRes = {
                  id: data.entity.id,
                  name_company: data.entity.name_company,
                  nick_trade: data.entity.nick_trade,
                  doc_kind: "",
                  doc_number: "",
                };
                if (data.person) {
                  if (data.person.id > 0) {
                    dataRes.doc_kind = "F";
                    dataRes.doc_number = data.person.cpf;
                  }
                }
                if (data.company) {
                  if (data.company.id > 0) {
                    dataRes.doc_kind = "J";
                    dataRes.doc_number = data.company.cnpj;
                  }
                }
                res.send(dataRes);
              })
          } else {
            res.status(201).json({ response: "Este Cliente pertence a outro vendedor."});
            
          }
        });

    } catch (err) {
      res.send(err);
    }
  }

  static getCustomer = (req, res) => {
    CustomerController.getCustomer(req.params.tb_institution_id, req.params.id)
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

  static getListSalesRoute = (req, res) => {

    CustomerController.getListSalesRoute(req.params.tb_institution_id, req.params.tb_sales_route_id, req.params.tb_salesman_id)
      .then(data => {
        res.send(data);
      })
  };

  static getListBySalesman = (req, res) => {

    CustomerController.getListBySalesman(req.params.tb_institution_id, req.params.tb_salesman_id)
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