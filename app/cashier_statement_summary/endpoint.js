const SummaryController = require("./controller.js");

class CashierEndPoint {

  static get(req, res) {    
    SummaryController.get(req.body.tb_institution_id,
                          req.body.month,
                          req.body.year,
                          req.body.tb_salesman_id)
    .then(data => {
      res.send(data);
    })
  }

}  
module.exports = CashierEndPoint; 