const OrderITemTransferController = require("../controller/orderItemStockTransfer.controller.js");

class OrderItemTransferEndPoint {

  static create = (req, res) => {
    
    OrderITemTransferController.insert(req.body)
      .then(data => {
        res.send(data);
    })
  }

  static getList(req, res) {
    
    OrderITemTransferController.getList(req.params.tb_institution_id,req.params.tb_order_id )
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {
    
    OrderITemTransferController.get(req.params.tb_institution_id,req.params.tb_order_id,req.params.id )
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    OrderITemTransferController.update(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static delete(req, res) {

    OrderITemTransferController.delete(req.params.tb_institution_id,req.params.tb_order_id,req.params.id )
      .then(data => {
        res.send(data);
      })
  }  
}

module.exports = OrderItemTransferEndPoint; 