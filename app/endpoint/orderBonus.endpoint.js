const OrderBonusController = require("../controller/orderBonus.controller.js");

class OrderBonusEndPoint {

  static create = (req, res) => {
    OrderBonusController.insert(req.body)
      .then(data => {
        res.send(data.Order);
      })
  }

  static getList(req, res) {

    OrderBonusController.getList(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {

    OrderBonusController.get(req.params.tb_institution_id, req.params.id)
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    OrderBonusController.update(req.body)
      .then((data) => {

        res.send(data.Order)
      })
  }

  static delete(req, res) {

    OrderBonusController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static closure(req, res) {

    OrderBonusController.closure(req.body)
      .then(data => {
        if (data == 200) {
          res.status(200).send('The OrderBonus was closed');
        } else {
          if (data == 201) {
            res.status(201).send('The OrderBonus is already closed');
          }
        }
      })
  }

  static reopen(req, res) {

    OrderBonusController.reopen(req.body)
      .then(data => {
        if (data == 200) {
          res.status(200).send('The OrderBonus was open');
        } else {
          if (data == 201) {
            res.status(201).send('The OrderBonus is already open');
          }
        }
      })
  }
}

module.exports = OrderBonusEndPoint; 