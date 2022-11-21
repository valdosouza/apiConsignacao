const OrderBonusController = require("../controller/orderBonus.controller.js");

class OrderBonusEndPoint {

  static create = (req, res) => {
    
    OrderBonusController.insert(req.body)
      .then(data => {
        res.send(data);
    })
  }

  static getList(req, res) {
    
    OrderBonusController.getList(req.params.tb_institution_id )
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {
    
    OrderBonusController.get(req.params.tb_institution_id,req.params.id )
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    OrderBonusController.update(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static delete(req, res) {

    OrderBonusController.delete(req.params.tb_institution_id,req.params.tb_order_id,req.params.id )
      .then(data => {
        res.send(data);
      })
  }
  
}

module.exports = OrderBonusEndPoint; 