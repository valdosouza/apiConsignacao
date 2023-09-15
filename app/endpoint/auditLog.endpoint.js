const AuditLogOrcSupplying = require("../controller/auditLogOrcSupplying.controller.js");
const AuditLogOrcCheckout = require("../controller/auditLogOrcCheckout.controller.js");
const AuditLogOrderSaleCard = require("../controller/auditLogOrderSaleCard.controller.js");
const AuditLogOrcCardToSale = require("../controller/auditLogOrcCardToSale.controller.js");
const AuditLogOrcCardToStockTransfer = require("../controller/auditLogOrcCardToStockTransfer.controller.js");
const AuditLogOrcCardToConsignment = require("../controller/auditLogOrcCardToConsignment.controller.js");
const AuditLogOrcCardToBonus = require("../controller/auditLogOrcCardToBonus.controller.js");
const AuditLogStockSatementOrderSale = require("../controller/auditLogStockStatementOrderSale.controller.js");
const AuditLogStockSatementOrderConsginment = require("../controller/auditLogStockStatementOrderConsignment.controller.js");
const AuditLogStockSatementOrderStockTransfer = require("../controller/auditLogStockStatementOrderStockTransfer.controller.js");
const AuditLogStockSatementStockBalance = require("../controller/auditLogStockStatementStockBalance.controller.js");

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

  static orderConsignmentCardToSale = (req, res) => {

    AuditLogOrcCardToSale.doExecute()
      .then(data => {
        res.send(data);
      })
  }

  static orderConsignmentCardToStockTransfer = (req, res) => {
    AuditLogOrcCardToStockTransfer.doExecute()
      .then((data) => {
        res.send(data);
      });
  }

  static orderConsignmentCardToConsignment = (req, res) => {
    AuditLogOrcCardToConsignment.doExecute()
      .then((data) => {
        res.send(data);
      });
  }

  static orderConsignmentCardToBonus = (req, res) => {
    AuditLogOrcCardToBonus.doExecute()
      .then((data) => {
        res.send(data);
      });
  }

  static stockSatementOrderSale = (req, res) => {
    AuditLogStockSatementOrderSale.doExecute()
      .then((data) => {
        res.send(data);
      });
  }

  static stockSatementOrderConsignment = (req, res) => {
    AuditLogStockSatementOrderConsginment.doExecute()
      .then((data) => {
        res.send(data);
      });
  }  

  static stockSatementOrderStockTransfer = (req, res) => {
    AuditLogStockSatementOrderStockTransfer.doExecute()
      .then((data) => {
        res.send(data);
      });
  }    
  
  static stockSatementStockBalance = (req, res) => {
    AuditLogStockSatementStockBalance.doExecute()
      .then((data) => {
        res.send(data);
      });
  }    


}

module.exports = AuditLogEndPoint; 
