const OrderBonusController = require('../controller/orderBonus.controller.js');
const OrderSaleController = require("../controller/orderSale.controller.js");
const OrderSaleCardController = require("../controller/orderSaleCard.controller.js");
const entityHasStockList = require("../controller/entityHasStockList.controller.js");
const FinancialController = require('../controller/financial.controller.js');
const OrderAttendaceController = require('../controller/orderAttendance.controller.js');
const FinancialPaymentController = require('../controller/financialPayment.controller.js');
const FinancialStatementController = require('../controller/financialStatement.controller.js');

class OrderSaleEndPoint {

  static create = (req, res) => {
    OrderSaleController.insert(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static saveByCard = (req, res) => {
    
    OrderSaleController.saveCard(req.body)
      .then(async data => {
        
        //Retorna do estoque do vendedor - Venda direta pelo estoque do vendedor ....lembrar da venda direta pelo estoque do cliente
        var stockSalesman = await entityHasStockList.getByEntity(req.body.Order.tb_institution_id,req.body.Order.tb_salesman_id);    
        //Usar o grupo estoque manager por que pode ser usado tanto salesman quanto o customer    
        req.body['StockOrigen'] = stockSalesman[0];          

        await OrderBonusController.saveByCard(req.body);

        await OrderSaleController.saveByCard(req.body);

        await FinancialController.saveByCard(req.body);
        
        //cliente definiu que tudo será condiderado como recebido
        //await FinancialPaymentController.saveByCard(req.body);
      
        //cliente definiu que tudo será condiderado como recebido
        //await FinancialStatementController.saveByCard(req.body);

        await OrderAttendaceController.finished(req.body);
        res.send(data);
      })
  }

  static getList(req, res) {

    OrderSaleController.getList(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  }

  static getNewOrderSaleCard(req, res) {

    OrderSaleCardController.getNewOrderSaleCard(req.params.tb_institution_id, req.params.tb_price_list_id)
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {

    OrderSaleController.get(req.params.tb_institution_id,
      req.params.tb_order_id)
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {

    OrderSaleController.update(req.body)
      .then(data => {
        if (data)
          res.send(req.body)
        else
          res.send(data);
      })
  }

  static delete(req, res) {

    OrderSaleController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static closure(req, res) {

    OrderSaleController.closure(req.body)
      .then(data => {
        if (data == 200) {
          res.status(200).send('The OrderSale was closed');
        } else {
          if (data == 201) {
            res.status(201).send('The OrderSale is already closed');
          }
        }
      })
  }

  static reopen(req, res) {

    OrderSaleController.reopen(req.body)
      .then(data => {
        if (data == 200) {
          res.status(200).send('The OrderSale was open');
        } else {
          if (data == 201) {
            res.status(201).send('The OrderSale is already open');
          }
        }
      })
  }
}
module.exports = OrderSaleEndPoint; 