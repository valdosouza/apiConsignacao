const OrderConsignmentController = require("../controller/orderConsignment.controller.js");
const entityHasStockList = require("../controller/entityHasStockList.controller.js");
const OrderBonusController = require('../controller/orderBonus.controller.js');
const OrderStockTransferController = require('../controller/orderItemStockTransfer.controller.js');

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
        //Cria o estoque do cliente ou retorna o estoque do cliente
        var stockCustomer = await entityHasStockList.createAuto(dataEntityHasStockList)
        req.body['StockCustomer'] = stockCustomer[0];          
        //Verificar o estoque do vendedor
        var stockSalesman = await entityHasStockList.getByEntity(req.body.Order.tb_institution_id,req.body.Order.tb_salesman_id);        
        req.body['StockSalesman'] = stockSalesman[0];          
        

        await OrderBonusController.saveByCard(req.body);

        await OrderConsignmentController.saveByCard(req.body);

        await OrderStockTransferController.saveByCard(req.body);
        
        //criar Order Bonus Vinculado a mesma ordem de atendimento e Consignment
        //Criar Order Items Bonus Vinculado a mesma ordem de atendimento e Consignment
        //Criar Order Items Consignment Vinculado a mesma ordem de atendimento e Consignment
        res.send(req.body);
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