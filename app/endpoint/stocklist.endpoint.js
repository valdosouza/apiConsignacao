const StockListController = require("../controller/stockList.controller.js");

class StockListEndPoint {

  static create = (req, res) => {
    const stockList = req.body;
    StockListController.insert(stockList)
      .then(data => {
        res.send(data);
    })
  }

  static getList(req, res) {
    const tb_institution_id = req.params.tb_institution_id;
    
    StockListController.getList(tb_institution_id).then(data => {
      res.send(data);
    })
  }
  static update = (req, res) => {    
    const stockList = req.body;
    StockListController.update(stockList)
      .then((data) => {
        res.send(data);
      })
  }

  static delete(req, res) {
    StockListController.delete(req.body).then(data => {
      res.send(data);
    })
  }   
}

module.exports = StockListEndPoint;