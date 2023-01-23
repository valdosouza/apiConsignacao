const OrderConsignmentController = require("../controller/orderConsignment.controller.js");
const entityHasStockList = require("../controller/entityHasStockList.controller.js");
const OrderBonusController = require('../controller/orderBonus.controller.js');
const OrderStockTransferController = require('../controller/orderStockTransfer.controller.js');
const OrderSaleController = require('../controller/orderSale.controller.js');
const FinancialController = require('../controller/financial.controller.js');
const FinancialPaymentController = require('../controller/financialPayment.controller.js');
const FinancialStatementController = require('../controller/financialStatement.controller.js');

class OrderConsignmentEndPoint {

  static saveCheckpoint = (req, res) => {

    OrderConsignmentController.saveCheckpoint(req.body)
      .then( async data => {
        //Retorna do estoque do Cliente - Venda direta pelo estoque do Cliente ....lembrar da venda direta pelo estoque do Vendedor
        var stockCustomer = await entityHasStockList.getByEntity(req.body.Order.tb_institution_id,req.body.Order.tb_customer_id);
        req.body['StockManager'] = stockCustomer[0];                

        await OrderSaleController.saveByCard(req.body);
        
        await FinancialController.saveByCard(req.body);

        await FinancialPaymentController.saveByCard(req.body);

        await FinancialStatementController.saveByCard(req.body);

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
        //Retorna do estoque do vendedor
        var stockSalesman = await entityHasStockList.getByEntity(req.body.Order.tb_institution_id,req.body.Order.tb_salesman_id);        
        req.body['StockSalesman'] = stockSalesman[0];          
        

        await OrderBonusController.saveByCard(req.body);

        await OrderConsignmentController.saveByCard(req.body);       

        await OrderStockTransferController.saveByCard(req.body);
        
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