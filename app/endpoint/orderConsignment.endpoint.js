const OrderConsignmentController = require("../controller/orderConsignment.controller.js");
const entityHasStockList = require("../controller/entityHasStockList.controller.js");

class OrderConsignmentEndPoint {

  static saveCheckpoint = (req, res) => {

    OrderConsignmentController.saveCheckpoint(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static saveSupplying = (req, res) => {
    OrderConsignmentController.saveSupplying(req.body)
      .then(async data => {        
        //Verificar se já existe um Estoque para o cliente
        var dataEntityHasStockList = {
          tb_institution_id: data.Order.tb_institution_id,
          tb_entity_id: data.Order.tb_customer_id,
          name_entity: data.Order.name_customer,
        }
        await entityHasStockList.createAuto(dataEntityHasStockList);
        res.send(data);
      })
  }

  static getCheckpoint(req, res) {
    OrderConsignmentController.getCheckpoint(req.params.tb_institution_id, req.params.id)
      .then(data => {
        res.send(data);
      })
  }

  static getSupplying(req, res) {
    OrderConsignmentController.getSupplying(req.params.tb_institution_id, req.params.id)
      .then(data => {
        res.send(data);
      })
  }
  static getLast(req, res) {
    OrderConsignmentController.getLast(req.params.tb_institution_id, req.params.tb_customer_id)
      .then(data => {
        res.send(data);
      })
  }

}
module.exports = OrderConsignmentEndPoint; 