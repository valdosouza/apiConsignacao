const FinancialStatemenController = require("../controller/financialStatement.controller");

class FinancialEndPoint {

  static getbyday(req, res) {
    FinancialStatemenController.get(req.params.tb_institution_id,
                                    req.params.tb_user_id,
                                    0,
                                    req.params.date,
                                    'D',
                                    0)
      .then(data => {
        res.send(data);
      })
  }

  static getbymonth(req, res) {    
    FinancialStatemenController.get(req.params.tb_institution_id,
                                    req.params.tb_user_id,
                                    0,
                                    req.params.date,                                    
                                    'M',
                                    0 )
      .then(data => {
        res.send(data);
      })
  }

  static getbyDaybyCustomer(req, res) {    
    FinancialStatemenController.get(req.params.tb_institution_id,
                                    req.params.tb_user_id,                                    
                                    req.params.tb_customer_id,
                                    req.params.date,
                                    'D',
                                    0 )
      .then(data => {
        res.send(data);
      })
  }
  
  static getbyDaybyOrder(req, res) {    
    FinancialStatemenController.get(req.params.tb_institution_id,
                                    req.params.tb_user_id,                                    
                                    0,
                                    req.params.date,
                                    'D',
                                    req.params.tb_order_id )
      .then(data => {
        res.send(data);
      })
  }

  static getlistCustomercharge(req, res) {    
    FinancialStatemenController.getListCustomerCharged(req.params.tb_institution_id,
                                    req.params.tb_user_id,                                                                        
                                    req.params.date,
                                    'D' )
      .then(data => {
        res.send(data);
      })
  }  
}

module.exports = FinancialEndPoint; 