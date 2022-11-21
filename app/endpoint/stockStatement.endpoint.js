const StockStatementController = require("../controller/stockStatement.controller.js");

class StockStatementEndPoint {

  static create = (req, res) => {
    const stockStatement = req.body;
    StockStatementController.insert(stockStatement)
      .then(data => {
        res.send(data);
    })
  }

  static getList(req, res) {
    const tb_institution_id = req.params.tb_institution_id;
    
    StockStatementController.getList(tb_institution_id).then(data => {
      res.send(data);
    })
  }

}

module.exports = StockStatementEndPoint;