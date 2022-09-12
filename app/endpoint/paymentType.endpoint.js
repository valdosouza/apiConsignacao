const PaymentController = require("../controller/paymentType.controller.js");

class PaymentEndPoint {

  static findAll= (req, res) => {

    PaymentController.findAll().then(data => {
      res.send(data);
    })
  }

  static getlist = (req, res) => {
    const tb_institution_id = req.body.tb_institution_id;

    PaymentController.getlist(tb_institution_id).then(data => {
      res.send(data);
    })
  }
}
module.exports =  PaymentEndPoint; 

