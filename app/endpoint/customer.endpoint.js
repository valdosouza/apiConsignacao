const CustomerController = require("../controller/customer.controller.js");

class CustomerEndPoint {
  static _saveReturn(data) {
    var dataRes = {
      id: data.entity.id,
      name_company: data.entity.name_company,
      nick_trade: data.entity.nick_trade,
      doc_kind: "",
      doc_number: "",
      error: "",
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
    return dataRes;
  }

  static _saveWithoutReturn(data) {
    var docNumber = "";
    var docKind = "";
    if (data.person) {
      docNumber = data.person.cpf;
      docKind = "F";
    }
    if (docNumber == "") {
      docNumber = data.company.cnpj;
      docKind = "J";
    }
    var dataRes = {
      id: 0,
      name_company: data.entity.name_company,
      nick_trade: data.entity.nick_trade,
      doc_kind: docKind,
      doc_number: docNumber,
      error: "Não foi possivel salva este Cliente.",
    };
    return dataRes;
  }

  static save = (req, res) => {
    try {
      if (req.body.customer.id > 0) {
        CustomerController.getById(req.body.customer.tb_institution_id, req.body.customer.id)
          .then(dataById => {
            if (dataById) {
              CustomerController.update(req.body)
                .then(data => {
                  res.send(this._saveReturn(data));
                })
            } else {
              res.status(201).json(this._saveWithoutReturn(req.body));
            }
          });
      } else {
        var docNumber = "";
        var docKind = "";
        if (req.body.person) {
          docNumber = req.body.person.cpf;
          docKind = "F";
        }
        if (docNumber == "") {
          docNumber = req.body.company.cnpj;
          docKind = "J";
        }
        CustomerController.getByDocNumber(req.body.customer.tb_institution_id, docNumber)
          .then(dataDocnumber => {            
            if (dataDocnumber.length == 0) {
              CustomerController.insert(req.body)
                .then(data => {
                  res.send(this._saveReturn(data));
                })
            } else {
              CustomerController.update(req.body)
                .then(data => {
                  res.send(this._saveReturn(data));
                })
            }
          });
      }

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
    switch (req.params.kind) {
      case 'Todos':
        CustomerController.getListSalesRouteTodos(
          req.params.tb_institution_id,
          req.params.tb_sales_route_id,
          req.params.tb_region_id)
          .then(data => {
            res.send(data);
          })
        break;
      case 'Atendidos':
        CustomerController.getListSalesRouteAtendido(
          req.params.tb_institution_id,
          req.params.tb_sales_route_id,
          req.params.tb_region_id,
          req.params.dt_record)
          .then(data => {
            res.send(data);
          })
        break;
      case 'Retorno':
        CustomerController.getListSalesRouteRetorno(
          req.params.tb_institution_id,
          req.params.tb_sales_route_id,
          req.params.tb_region_id)
          .then(data => {
            res.send(data);
          })
        break;
      case 'Recolhido':
        CustomerController.getListSalesRouteRecolhido(
          req.params.tb_institution_id,
          req.params.tb_sales_route_id,
          req.params.tb_region_id)
          .then(data => {
            res.send(data);
          })
        break;
      default://Atender
        CustomerController.getListSalesRouteAtender(
          req.params.tb_institution_id,
          req.params.tb_sales_route_id,
          req.params.tb_region_id,
          req.params.dt_record)
          .then(data => {
            res.send(data);
          })

        break;
    }
  };

  static getListByRegion = (req, res) => {

    CustomerController.getListByRegion(req.params.tb_institution_id, req.params.tb_region_id)
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