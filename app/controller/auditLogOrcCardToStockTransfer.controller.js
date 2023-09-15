const AuditLog = require("./auditLog.controller.js");
const db = require("../model/index.js");
const Tb = db.auditlog;
const OrderStockTransferController = require("./orderStockTransfer.controller.js");
const OrderItemStockTransferController = require("./orderItemStockTransfer.controller.js");
const StockStatement = require('./stockStatement.controller.js');
const entityHasStockList = require("./entityHasStockList.controller.js");

class AuditLogOrcCardToStockTransferController extends AuditLog {

  static async doExecute() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var orderList = await this.getList();
        var order = {};
        if (orderList.length > 0) {
          for (var item of orderList) {
            order = await OrderStockTransferController.getOrder(item.tb_institution_id, item.tb_order_id)
            if (order.id == 0) {
              await this.autoCreateOrderStockTransfer(item);
            }
            await this.autoCreateOrderStockTransferItem(item);

          }
        }
        resolve({
          result: true,
          message: 'AuditLogOrcCardToStockTransfer efetuada com Sucesso'
        });
      } catch (error) {
        reject("AuditLogOrcCardToStockTransferController: " + error);
      }
    });
    return promise;
  }

  static async getList() {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize
          .query(
            'select orc.tb_institution_id, orc.tb_salesman_id, orc.tb_customer_id, ' +
            ' orc.total_value,orc.change_value,  orc.id tb_order_id, orcd.tb_product_id, ' +
            ' orcd.devolution, orcd.unit_value, ori.id ' +
            'from tb_order_consignment_card orcd ' +
            '  inner join tb_order_consignment orc ' +
            '  on (orc.id = orcd.id) ' +
            '    and (orc.tb_institution_id = orcd.tb_institution_id) ' +
            '  left outer join tb_order_item ori ' +
            '    on (ori.tb_order_id = orc.id) ' +
            '    and (ori.tb_product_id = orcd.tb_product_id) ' +
            '    and (ori.tb_institution_id = orc.tb_institution_id)     ' +
            '     and (ori.kind = ?) ' +
            'where orc.kind = ? ' +
            'and orcd.kind = ? ' +
            'and orcd.devolution > 0 ' +
            'and ori.id is null ',
            {
              replacements: ['StockTransfer', 'supplying','supplying'],
              type: Tb.sequelize.QueryTypes.SELECT,
            }
          )
          .then((data) => {
            resolve(data);
          })
      } catch (error) {
        reject("AuditLog.getList: " + error);
      }
    });
    return promise;
  }

  static async autoCreateOrderStockTransfer(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const dataOrder = {
          id: body.tb_order_id,
          tb_institution_id: body.tb_institution_id,
          terminal: 0,
          number: 0,
          tb_entity_id: body.tb_customer_id,
          tb_stock_list_id_ori: 0,//estoque invertiro devido a devolução
          tb_stock_list_id_des: 0,//estoque invertiro devido a devolução
        }
        var stockListOri = await entityHasStockList.getByEntity(body.tb_institution_id, body.tb_customer_id, 'customer');
        dataOrder.tb_stock_list_id_ori = stockListOri[0].tb_stock_list_id;  //estoque invertiro devido a devolução
        var stockListDes = await entityHasStockList.getByEntity(body.tb_institution_id, body.tb_salesman_id, 'salesman');
        dataOrder.tb_stock_list_id_des = stockListDes[0].tb_stock_list_id;  //estoque invertiro devido a devolução
        dataOrder.number = await OrderStockTransferController.getNextNumber(body.tb_institution_id);
        OrderStockTransferController.create(dataOrder)
          .then(() => {
            resolve(dataOrder);
          })
      } catch (error) {
        reject('autoCreateOrderStockTransfer:' + error);
      }
    });
    return promise;
  }

  static async autoCreateOrderStockTransferItem(item) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {
          id: 0,
          tb_institution_id: item.tb_institution_id,
          tb_order_id: item.tb_order_id,
          terminal: 0,
          tb_stock_list_id: 0,//Neste caso via card na consignação deve informar o estoque do cliente 
          tb_product_id: item.tb_product_id,
          quantity: item.devolution,
          unit_value: item.unit_value,
          kind: 'StockTransfer',
        };
        
        var stockList = await entityHasStockList.getByEntity(item.tb_institution_id, item.tb_customer_id, 'customer');
        dataItem.tb_stock_list_id = stockList[0].tb_stock_list_id;

        OrderItemStockTransferController.insert(dataItem)
        .then(()=>{
          resolve(dataItem);
        });        
      } catch (error) {
        reject('autoCreateOrderStockTransferItem'+error);
      }
    });
    return promise;
  }
}

module.exports = AuditLogOrcCardToStockTransferController;
