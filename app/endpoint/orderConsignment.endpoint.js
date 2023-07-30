const OrderConsignmentController = require("../controller/orderConsignment.controller.js");
const entityHasStockList = require("../controller/entityHasStockList.controller.js");
const OrderBonusController = require('../controller/orderBonus.controller.js');
const OrderStockTransferController = require('../controller/orderStockTransfer.controller.js');
const OrderSaleController = require('../controller/orderSale.controller.js');
const OrderAttendaceController = require('../controller/orderAttendance.controller.js');
const FinancialController = require('../controller/financial.controller.js');
const FinancialPaymentController = require('../controller/financialPayment.controller.js');
const FinancialStatementController = require('../controller/financialStatement.controller.js');
const { order } = require("../model/index.js");

class OrderConsignmentEndPoint {

  static saveCheckpoint = (req, res) => {
    var valida = true;
    if (req.body.order.id == 0) {
      valida = false;
      res.status(400).send("Id não encontrado");
    }
    if (req.body.order.tb_institution_id == 0) {
      valida = false;
      res.status(400).send("Estabelecimento não encontrado");
    }
    if (req.body.order.tb_customer_id == 0) {
      valida = false;
      res.status(400).send("Cliente não encontrado não encontrado");
    }
    if (req.body.order.tb_salesman_id == 0) {
      valida = false;
      res.status(400).send("Vendedor não encontrado");
    }

    if (valida) {

      OrderConsignmentController.saveCheckpoint(req.body)
        .then(async data => {
          //Retorna do estoque do Cliente - Venda direta pelo estoque do Cliente ....lembrar da venda direta pelo estoque do Vendedor
          var StockDestiny = await entityHasStockList.getByEntity(req.body.order.tb_institution_id, req.body.order.tb_customer_id);
          //Usar o grupo estoque manager por que pode ser usado tanto customer quanto o salesman 
          req.body['StockOrigen'] = StockDestiny[0];

          await OrderSaleController.saveByCard(req.body);

          await FinancialController.saveByCard(req.body);

          //cliente definiu que tudo será condiderado como recebido
          //await FinancialPaymentController.saveByCard(req.body);

          //cliente definiu que tudo será condiderado como recebido
          //await FinancialStatementController.saveByCard(req.body);

          res.send(data);
        })
    }
  }

  static saveSupplying = (req, res) => {
    OrderConsignmentController.saveSupplying(req.body)
      .then(async data => {
        //Verificar se já existe um Estoque para o cliente
        var dataEntityHasStockList = {
          tb_institution_id: data.order.tb_institution_id,
          tb_entity_id: data.order.tb_customer_id,
          name_entity: data.order.name_customer,
        }
        //Cria o estoque do cliente ou retorna o estoque do cliente
        var StockDestiny = await entityHasStockList.createAuto(dataEntityHasStockList)
        req.body['StockDestiny'] = StockDestiny;
        //Retorna do estoque do vendedor
        var stockSalesman = await entityHasStockList.getByEntity(req.body.order.tb_institution_id, req.body.order.tb_salesman_id);
        req.body['StockOrigen'] = stockSalesman[0];

        await OrderBonusController.saveByCard(req.body);

        await OrderConsignmentController.saveByCard(req.body);

        await OrderStockTransferController.saveDevolutionByCard(req.body);

        await OrderAttendaceController.finished(req.body);

        res.send("Supplying recorded successfully.");
      })
  }

  static getCheckpoint(req, res) {
    OrderConsignmentController.getCheckpoint(req.params.tb_institution_id, req.params.id)
      .then(data => {
        if (data.order.id > 0) {
          res.send(data);
        } else {
          res.status(400).json({ error: 'Ordem não encontrada' });

        }
      })
  }

  static getSupplying(req, res) {
    OrderConsignmentController.getSupplying(req.params.tb_institution_id, req.params.id)
      .then(data => {
        if (data.order.id > 0) {
          res.send(data);
        } else {
          res.status(400).json({ error: 'Ordem não encontrada' });

        }
      })
  }
  static getLast(req, res) {
    OrderConsignmentController.getLast(req.params.tb_institution_id, req.params.tb_customer_id)
      .then(data => {
        res.send(data);
      })
  }
  static getList(req, res) {
    OrderConsignmentController.getList(req.params.tb_institution_id, req.params.tb_customer_id)
      .then(data => {
        res.send(data);
      })
  }
}
module.exports = OrderConsignmentEndPoint; 