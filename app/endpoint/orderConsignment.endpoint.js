const OrderConsignmentController = require("../controller/orderConsignment.controller.js");

class OrderConsignmentEndPoint {

  static create = (req, res) => {
    
    OrderConsignmentController.insert(req.body)
      .then(data => {
        res.send(data);
    })
  }

  static getList(req, res) {
    
    OrderConsignmentController.getList(req.params.tb_institution_id,req.params.tb_order_id )
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {
    
    OrderConsignmentController.get(req.params.tb_institution_id,req.params.tb_order_id,req.params.id )
      .then(data => {
        res.send(data);
      })
  }  
}
module.exports = OrderConsignmentEndPoint; 