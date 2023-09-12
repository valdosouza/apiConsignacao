const AuditLogOrcSupplying = require("../controller/auditLogOrcSupplying.controller.js");
const AuditLogOrcCheckout  = require("../controller/auditLogOrcCheckout.controller.js");
const AuditLogOrderSaleCard = require("../controller/auditLogOrderSaleCard.controller.js");
const AuditLogOrcSale = require("../controller/auditLogOrcSale.controller.js");


class AuditLogEndPoint {

  static orderConsignmentSupplying = (req, res) => {
    
    AuditLogOrcSupplying.doExecute()
    .then(data => {      
      res.send(data);
    })
  }

  static orderConsignmentCheckout = (req, res) => {
    
    AuditLogOrcCheckout.doExecute()
    .then(data => {      
      res.send(data);
    })
  }

  static orderSaleCardCheckItems = (req, res) => {
    
    AuditLogOrderSaleCard.doExecute(req.body)
    .then(data => {      
      res.send(data);
    })
    
  }

  static orderConsignmentSaveSale = (req, res) => {    
    
    AuditLogOrcSale.doExecute()
    .then(data => {      
      res.send(data);
    })    
  }

}

module.exports = AuditLogEndPoint; 
