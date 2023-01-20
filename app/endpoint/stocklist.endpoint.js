const StockListController = require("../controller/stockList.controller.js");

class StockListEndPoint {

  static create = (req, res) => {
    StockListController.insert(req.body)
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

  static get(req, res) {
    StockListController.get(req.params.tb_institution_id, req.params.id).then(data => {
      res.send(data);
    })
  }

  static update = (req, res) => {
    const stockList = req.body;
    StockListController.update(stockList)
      .then(data => {
        if (data)
          res.send(req.body)
        else
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