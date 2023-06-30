const FinancialStatemenController = require("../controller/financialStatement.controller");

class FinancialEndPoint {

  static getByday(req, res) {            
    FinancialStatemenController.getByDay(req.params.tb_institution_id,
                                          req.params.tb_user_id,
                                          0,
                                          req.params.date,
                                          0)
      .then(data => {
        res.send(data);
      })
  }

  static getByMonth(req, res) {    
    FinancialStatemenController.getByMonth(req.params.tb_institution_id,
                                    req.params.tb_user_id,
                                    req.params.date )
      .then(data => {
        res.send(data);
      })
  }

  static getByDayByCustomer(req, res) {    
    FinancialStatemenController.getByCustomer(req.params.tb_institution_id,
                                    req.params.tb_user_id,
                                    req.params.tb_customer_id,
                                    req.params.date,
                                    0 )
      .then(data => {
        res.send(data);
      })
  }
  
  static getByOrder(req, res) {     
    FinancialStatemenController.getByOrder(req.params.tb_institution_id,
                                    req.params.tb_user_id,
                                    req.params.date,                                    
                                    req.params.tb_order_id )
      .then(data => {
        res.send(data);
      })
  }

  static getListCustomerCharge(req, res) {    
    FinancialStatemenController.getListCustomerCharged(req.params.tb_institution_id,
                                    req.params.tb_user_id,
                                    req.params.date,
                                    'D' )
      .then(data => {
        res.send(data);
      })
  }  

  static getListSalesmanCustomerCharge(req, res) {    
    FinancialStatemenController.getListSalesmanCustomerCharged(req.params.tb_institution_id,
                                    req.params.date,
                                    'D' )
      .then(data => {
        res.send(data);
      })
  }    
}

module.exports = FinancialEndPoint; 