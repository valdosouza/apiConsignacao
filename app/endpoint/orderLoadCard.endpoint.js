const OrderStockAjustController = require('../controller/orderStockAdjust.controller.js');
const OrderStockTransferController = require('../controller/orderStockTransfer.controller.js');
const OrderLoadCardController = require("../controller/orderLoadCard.controller.js");
const entityHasStockList = require("../controller/entityHasStockList.controller.js");
const OrderStockAdjustController = require('../controller/orderStockAdjust.controller.js');

class OrderLoadEndPoint {

  static create = (req, res) => {
    OrderLoadCardController.insert(req.body)
      .then(async data => {
        //Retorna do estoque do vendedor - Venda direta pelo estoque do vendedor ....lembrar da venda direta pelo estoque do cliente
        var stockSalesman = await entityHasStockList.getByEntity(req.body.tb_institution_id,req.body.tb_user_id);    
        //Usar o grupo estoque manager por que pode ser usado tanto salesman quanto o customer    
        req.body['StockDestiny'] = stockSalesman[0];          
        //Retorna do estoque do Estabelecimento-
        var stockInstitution = await entityHasStockList.getByEntity(req.body.tb_institution_id,req.body.tb_institution_id);    
        //Usar o grupo estoque manager por que pode ser usado tanto salesman quanto o customer    
        req.body['StockOrigen'] = stockInstitution[0];          

        req.body['Order'] = {
          id: data.id,
          tb_institution_id: req.body.tb_institution_id,          
          tb_user_id : req.body.tb_user_id,
          tb_entity_id : req.body.tb_user_id,
          dt_record : req.body.dt_record,
          note :"",
          direction : "S",
        };
        await OrderStockAdjustController.saveByCard(req.body);
        await OrderStockTransferController.saveLoadCardByCard(req.body);
        res.send({ result: "LoadCard saved" });       
      })
  }

  
  static getNewOrderLoadCard(req, res) {

    OrderLoadCardController.getNewOrderLoadCard(req.params.tb_institution_id, req.params.tb_user_id,req.params.dt_record)
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
module.exports = OrderLoadEndPoint; 