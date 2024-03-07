const AuditLog = require("./auditLog.controller.js");
const db = require("../model/index.js");
const Tb = db.auditlog;
const OrderSaleController = require("../order_sale/orderSale.controller.js");
const OrderItemSaleController = require("./orderItemSale.controller.js");
const StockStatement = require('./stockStatement.controller.js');
const entityHasStockList = require("./entityHasStockList.controller.js");

class AuditLogOrcCheckoutController extends AuditLog {

  static async doExecute() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var orderList = await this.getList();
        var dataLog = {};
        for (var item of orderList) {
          await this.hasOrderSale(item.tb_institution_id, item.id)
            .then(async (data) => {
              dataLog = {
                tb_institution_id: data.tb_institution_id,
                tb_user_id: data.tb_user_id,
                kind: 'Estoque Vendido',
                table_name: 'tb_order_sale',
                record_id: item.id,
                result: data.result,
                note: "",
              };
              await this.create(dataLog);
            })
        }
        resolve({
          result: true,
          message: 'Auditoria OrderSale efetuada com Sucesso'
        });
      } catch (error) {
        reject("AuditLog.create: " + error);
      }
    });
    return promise;
  }

  static async getList() {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize
          .query(
            'select ors.id, ors.tb_institution_id ' +
            'from tb_order_sale ors ' +
            '  LEFT outer join tb_audit_log adl ' +
            '  on (adl.record_id = ors.id) ' +
            '  and (adl.tb_institution_id = ors.tb_institution_id) ' +
            '  and (adl.table_name = ? ) ' +
            'where  adl.id is null ',
            {
              replacements: ['tb_order_sale'],
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

  static async hasOrderSale(tb_institution_id, id, kind) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var order = await OrderSaleController.getOrder(id, tb_institution_id)
        var itemList = await OrderItemSaleController.getList(tb_institution_id, id );
        if (itemList.length > 0) {
          var params = {};
          var idStockStatement = 0;
          var dataItem = {};          
          var stockCustomer = {};
          for (var item of itemList) {
            params = {
              tb_institution_id: item.tb_institution_id,
              terminal: item.terminal,
              tb_order_id: item.tb_order_id,
              tb_order_item_id: item.id,
              operation: 'Sale',
            }            
            idStockStatement = await StockStatement.getByAudit(params);
            if (idStockStatement.id == 0) {
              dataItem = {
                id: 0,
                tb_institution_id: item.tb_institution_id,
                tb_order_id: item.tb_order_id,
                terminal: 0,
                tb_order_item_id: item.id,
                tb_stock_list_id: item.tb_stock_list_id,
                local: "web",
                kind: "Auditoria",
                dt_record: order.dt_record,
                direction: "S",
                tb_merchandise_id: item.tb_product_id,
                quantity: item.quantity,
                operation: 'Sale',
              };
              stockCustomer = await entityHasStockList.getByEntity(order.tb_institution_id, order.tb_customer_id,'customer');
              dataItem['tb_stock_list_id'] = stockCustomer[0].tb_stock_list_id;
              dataItem['direction'] = 'S';

              await StockStatement.insert(dataItem);
              
              resolve({
                tb_institution_id: order.tb_institution_id,
                tb_user_id: order.tb_user_id,
                result: 'Corrigido',
                note:"Movimentação estoque adicionada"
              });
            } else {
              resolve({
                tb_institution_id: order.tb_institution_id,
                tb_user_id: order.tb_user_id,
                result: 'OK',
                note:""
              });
            }
          }
        }else{
          resolve({
            tb_institution_id: tb_institution_id,
            tb_user_id: order.tb_user_id,
            result: 'OK',
            note:"ordem sem itens"
          });          
        }
      } catch (error) {
        reject("AuditLog.hasOrderSale: " + error);
      }
    });
    return promise;
  }
}
module.exports = AuditLogOrcCheckoutController;
