const OrderStockAjustController = require('../controller/orderStockAdjust.controller.js');
const OrderStockTransferController = require('../controller/orderStockTransfer.controller.js');
const OrderLoadCardController = require("../controller/orderLoadCard.controller.js");
const entityHasStockList = require("../controller/entityHasStockList.controller.js");
const OrderStockAdjustController = require('../controller/orderStockAdjust.controller.js');


class OrderLoadEndPoint {

  static create = (req, res) => {
    OrderLoadCardController.insert(req.body)
      .then(async data => {
        res.send({ result: "LoadCard saved" });
      })
  }

  static closure = (req, res) => {
    OrderLoadCardController.getById(req.body.tb_institution_id, req.body.id)
      .then(async data => {
        if (data[0].status = 'A') {
          var dataItems = [];
          var objItem = {};
          for (var item of data) {
            objItem = {
              tb_product_id: item.tb_product_id,
              stock_balance: item.stock_balance,
              sale: Number(item.sale),
              bonus: Number(item.bonus),
              adjust: Number(item.adjust),
              new_load: Number(item.new_load),
            }
            dataItems.push(objItem);
          }
          req.body['items'] = dataItems

          //Retorna do estoque do vendedor - Venda direta pelo estoque do vendedor ....lembrar da venda direta pelo estoque do cliente
          var stockSalesman = await entityHasStockList.getByEntity(req.body.tb_institution_id, req.body.tb_user_id,'salesman');
          //Usar o grupo estoque manager por que pode ser usado tanto salesman quanto o customer    
          req.body['StockDestiny'] = stockSalesman[0];
          //Retorna do estoque do Estabelecimento-
          var stockInstitution = await entityHasStockList.getByEntity(req.body.tb_institution_id, req.body.tb_institution_id,'institution');
          //Usar o grupo estoque manager por que pode ser usado tanto salesman quanto o customer    
          req.body['StockOrigen'] = stockInstitution[0];

          req.body['order'] = {
            id: req.body.id,
            tb_institution_id: req.body.tb_institution_id,
            tb_user_id: req.body.tb_user_id,
            tb_entity_id: req.body.tb_user_id,
            dt_record: req.body.dt_record,
            note: "",
            direction: "S",
          };

          await OrderStockAdjustController.saveByCard(req.body);
          await OrderStockTransferController.saveLoadCardByCard(req.body);
          await OrderLoadCardController.finished(req.body);
          res.send({ result: "Carregamento foi encerrado com Sucesso" });
        } else {
          res.send({ result: "Carregamento já está encerrado" });
        }
      })

  }

  static getNewOrderLoadCard(req, res) {

    OrderLoadCardController.getNewOrderLoadCard(req.params.tb_institution_id, req.params.tb_user_id, req.params.dt_record)
      .then(data => {
        res.send(data);
      })
  }

  static getlist(req, res) {    
    OrderLoadCardController.getList(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  }

  static getByOrder(req, res) {
    OrderLoadCardController.getByOrder(req.params.tb_institution_id, req.params.tb_order_id)
      .then(data => {
        res.send(data);
      })
  }

  static getByUserDate(req, res) {
    OrderLoadCardController.getByUserDate(req.params.tb_institution_id, req.params.tb_user_id,req.params.dt_record)
      .then(data => {
        res.send(data);
      })
  }

  static getlistByUser(req, res) {

    OrderLoadCardController.getListByUser(req.params.tb_institution_id, req.params.tb_user_id)
      .then(data => {
        res.send(data);
      })
  }


}
module.exports = OrderLoadEndPoint; 