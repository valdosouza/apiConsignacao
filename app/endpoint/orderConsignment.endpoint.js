const OrderConsignmentController = require("../controller/orderConsignment.controller.js");

class OrderConsignmentEndPoint {

  static saveCheckpoint = (req, res) => {
    
    OrderConsignmentController.saveCheckpoint(req.body)
      .then(data => {
        res.send(data);
    })
  }

  static saveSupplying = (req, res) => {
    
    OrderConsignmentController.saveSupplying(req.body)
      .then(data => {
        res.send(data);
    })
  }

  static getcheckpoint(req, res) {
    
    OrderConsignmentController.get(req.params.tb_institution_id,req.params.tb_order_id,req.params.id )
      .then(data => {
        res.send(data);
      })
  }
  
  static getsupplying(req, res) {
    
    OrderConsignmentController.get(req.params.tb_institution_id,req.params.tb_order_id,req.params.id )
      .then(data => {
        res.send(data);
      })
  }  
}
module.exports = OrderConsignmentEndPoint; 