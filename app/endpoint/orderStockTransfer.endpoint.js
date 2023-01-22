const OrderStockTransferController = require("../controller/orderStockTransfer.controller.js");

class OrderStockTransferEndPoint {

  static create = (req, res) => {
    OrderStockTransferController.insert(req.body)
      .then(data => {
        res.send(data.Order);
      })
  }

  static getList(req, res) {

    OrderStockTransferController.getList(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {

    OrderStockTransferController.get(req.params.tb_institution_id, req.params.id)
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    OrderStockTransferController.update(req.body)
      .then((data) => {

        res.send(data.Order)
      })
  }

  static delete(req, res) {

    OrderStockTransferController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static closure(req, res) {

    OrderStockTransferController.closure(req.body)
      .then(data => {
        if (data == 200) {
          res.status(200).send('The OrderStockTransfer was closed');
        } else {
          if (data == 201) {
            res.status(201).send('The OrderStockTransfer is already closed');
          }
        }
      })
  }

  static reopen(req, res) {

    OrderStockTransferController.reopen(req.body)
      .then(data => {
        if (data == 200) {
          res.status(200).send('The OrderStockTransfer was open');
        } else {
          if (data == 201) {
            res.status(201).send('The OrderStockTransfer is already open');
          }
        }
      })
  }
}

module.exports = OrderStockTransferEndPoint; 