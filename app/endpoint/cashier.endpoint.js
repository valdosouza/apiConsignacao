const CashierController = require("../controller/cashier.controller.js");
const CashierClosureController = require("../controller/cashierClosure.controller.js");
const FinancialStatementController = require("../controller/financialStatement.controller.js");

class CashierEndPoint {

  static open = (req, res) => {
    
    CashierController.open(req.body.tb_institution_id,req.body.tb_user_id)
    .then(data => {
      res.send(data);
    })
  }

  static isOpen = (req, res) => {
    
    CashierController.getLastIdOpen(req.params.tb_institution_id,req.params.tb_user_id)
    .then(data => {
      res.send(data);
    })
  }

  static closure(req, res) {
    CashierClosureController.create(req.body)
    .then(data => {
      res.send(data);
    })
  }

  static getForClosure(req, res) {    
    CashierClosureController.getForClosure(req.params.tb_institution_id,
                                            req.params.tb_user_id,
                                            req.params.dt_record)
    .then(data => {
      res.send(data);
    })
  }

  static get(req, res) {    
    CashierClosureController.get(req.params.tb_institution_id,
                                            req.params.tb_user_id,
                                            req.params.dt_record)
    .then(data => {
      res.send(data);
    })
  }

  static getlist(req, res) {    
    CashierClosureController.getlist(req.params.tb_institution_id,
                                    req.params.tb_user_id)
    .then(data => {
      res.send(data);
    })
  }  

  static getBalance(req, res) {    
    FinancialStatementController.getBalance(req.params.tb_institution_id,
                                        req.params.tb_user_id,
                                        req.params.dt_record)
    .then(data => {
      res.send(data);
    })
  }  
}  
module.exports = CashierEndPoint; 