const StockBalanceController = require("../controller/stockBalance.controller.js");

class StockBalanceEndPoint {

  static getList(req, res) {
    StockBalanceController.getList(req.params.tb_institution_id,
                                   req.params.tb_stock_list_id)
    .then(data => {
      res.send(data);
    })
  }

  static getBySalesman(req, res) {
    StockBalanceController.getBySalesman(req.params.tb_institution_id,
                                            req.params.tb_salesman_id)
    .then(data => {
      res.send(data);
    })
  }
  
  static getAllCustomer(req, res) {
    StockBalanceController.getAllCustomer(req.params.tb_institution_id,
                                              req.params.tb_salesman_id)
    .then(data => {
      res.send(data);
    })
  }  

  static getAllBySalesman(req, res) {
    StockBalanceController.getAllBySalesman(req.params.tb_institution_id,
                                            req.params.tb_salesman_id)
    .then(data => {
      res.send(data);
    })
  }    
}

module.exports = StockBalanceEndPoint;