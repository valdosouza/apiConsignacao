const AuditLog = require("./auditLog.controller.js");
const db = require("../model/index.js");
const Tb = db.auditlog;

const OrderConsignmentController = require("../controller/orderConsignment.controller.js");
const StockStatement = require('./stockStatement.controller.js');

const entityHasStockList = require("../controller/entityHasStockList.controller.js");
const OrderBonusController = require('../controller/orderBonus.controller.js');
const OrderStockTransferController = require('../controller/orderStockTransfer.controller.js');
const OrderSaleController = require('../controller/orderSale.controller.js');
const OrderItemSaleController = require('../controller/orderItemSale.controller.js');
const OrderAttendaceController = require('../controller/orderAttendance.controller.js');


class AuditLogOrderAttendanceController extends AuditLog {

  static async doExecute() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var orderList = await this.getList();
        var dataREsult = {};
        for (var item of orderList) {
          //await this.hasOrderBonus();
          await this.hasOrderConsignment(item.tb_institution_id, item.id);
          //await this.hasOrderSale();
          //await this.hasOrderStockTransfers();
          //await this.hasOrderAttendance();

        }
        resolve(dataREsult);
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
          .query('select * ' +
            'from tb_order_attendance ' +
            'where ( tb_institution_id =? )' +
            ' and ( id = ?) ',
            {
              replacements: [1, 10609],
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


  static async hasOrderBonus() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        //var bonus = await OrderBonusController.get(tb_institution_id, id);

        resolve("ok");
      } catch (error) {
        reject("AuditLog.hasOrderBonus: " + error);
      }
    });
    return promise;
  }

  static async hasOrderStockTransfers() {
    const promise = new Promise((resolve, reject) => {
      try {
        resolve("OK");

      } catch (error) {
        reject("AuditLog.hasOrderStockTransfers: " + error);
      }
    });
    return promise;
  }

  
  static async hasOrderSale() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var order = await OrderSaleController.getOrder(id, tb_institution_id);
        var itemList = await OrderItemSaleController.getList(tb_institution_id, id);
        var params = {};
        var idStockStatement = 0;
        var dataItem = {};
        var stockSalesman = {};
        var stockCustomer = {};
        for (var item of itemList) {
          params = {
            tb_institution_id: item.tb_institution_id,
            terminal: item.terminal,
            tb_order_id: item.tb_order_id,
            tb_order_item_id: item.id,
            operation: 'Sale'
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
            dataItem['direction'] = 'E';

            await StockStatement.insert(dataItem);
          }
        }
      } catch (error) {
        reject("AuditLog.hasOrderSale: " + error);
      }
    });
    return promise;
  }

  static async hasOrderAttendance(recorId) {
    const promise = new Promise((resolve, reject) => {
      try {
        var dataLog = {
          tb_user_id: 1,
          kind: 'Existencia de Registro',
          table_name: 'tb_order_attendance',
          record_id: recorId,
          result: "OK",
          note: "",
        }
        this.create(dataLog)
          .then(() => {
            resolve("Registro Efetuado");
          })

      } catch (error) {
        reject("AuditLog.hasOrderSale: " + error);
      }
    });
    return promise;
  }

}
module.exports = AuditLogOrderAttendanceController;
