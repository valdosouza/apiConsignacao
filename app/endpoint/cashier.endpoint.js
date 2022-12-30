const CashierController = require("../controller/cashier.controller.js");
const CashierClosureController = require("../controller/cashierClosure.controller.js");

class CashierEndPoint {

  static open = (req, res) => {
    
    CashierController.open(req.body.tb_institution_id,req.body.tb_user_id)
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

}  
module.exports = CashierEndPoint; 