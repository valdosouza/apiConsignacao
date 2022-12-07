const StockBalanceController = require("../controller/stockBalance.controller.js");

class StockBalanceEndPoint {

  static getList(req, res) {
    StockBalanceController.getList(req.params.tb_institution_id,
                                   req.params.tb_stock_list_id)
    .then(data => {
      res.send(data);
    })
  }

}

module.exports = StockBalanceEndPoint;