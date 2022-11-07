const CompanyController = require("../controller/company.controller.js");

class CompanyEndPoint {

  static create = (req, res) => {
    const company = req.body;
    CompanyController.insert(company).then(data => {
      res.send(data);
    })
  }

  static getList(req, res) {

    CompanyController.getList(req.body).then(data => {
      res.send(data);
    })
  }
  static update = (req, res) => {
    const id = req.params.id;
    const company = req.body;
    CompanyController.update(company).then(data => {
      res.send(data);
    })
  }

  static delete(req, res) {

    CompanyController.delete(req.body).then(data => {
      res.send(data);
    })
  }
  
  static getbycnpj(req, res) {            
    const cnpj = req.params.cnpj;  
    CompanyController.getByCNPJ(cnpj).then(data => {
      res.send(data);
    })
    
  }  
}

module.exports = CompanyEndPoint; 