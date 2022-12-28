const FinancialStatemenController = require("../controller/financialStatement.controller");

class FinancialEndPoint {

  static getbyday(req, res) {
    
    FinancialStatemenController.get(req.params.tb_institution_id,
                                    req.params.tb_user_id,
                                    req.params.date )
      .then(data => {
        res.send(data);
      })
  }

  
}

module.exports = FinancialEndPoint; 