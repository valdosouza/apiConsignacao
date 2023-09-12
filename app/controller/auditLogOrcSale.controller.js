const AuditLog = require("./auditLog.controller.js");
const db = require("../model/index.js");
const Tb = db.auditlog;
const OrderSaleController = require("./orderSale.controller.js");
const OrderConsignmentController = require("./orderConsignment.controller.js");
const entityHasStockList = require("./entityHasStockList.controller.js");

class AuditLogOrcSaleController extends AuditLog {

  static async doExecute() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var orderList = await this.getList();
        var orderSale = {};
        var StockDestiny = {};
        var body = {};
        for (var item of orderList) {          
          orderSale = await this.getOrderSale(item.tb_institution_id, item.id, item.terminal);          
          console.log(orderSale);
          if (orderSale.id == 0) {
            body = await this.geraBody(item.tb_institution_id, item.id, item.terminal) ; 
            StockDestiny = await entityHasStockList.getByEntity(body.order.tb_institution_id, body.order.tb_customer_id,'customer');
            //Usar o grupo estoque manager por que pode ser usado tanto customer quanto o salesman 
            body['StockOrigen'] = StockDestiny[0];            
            await OrderSaleController.saveByCard(body);
          }
        }
        resolve({
          result: true,
          message: 'Auditoria OrderSale efetuada com Sucesso'
        });
      } catch (error) {
        reject("AuditLog.doExecute: " + error);
      }
    });
    return promise;
  }

  static async getList() {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize
          .query(
            'select distinct orc.id, orc.tb_institution_id, orc.terminal ' +
            'from tb_order_consignment orc ' +
            '    inner join tb_order_consignment_card orcd ' +
            '    on (orcd.id = orc.id) ' +
            '    and (orcd.tb_institution_id = orc.tb_institution_id) ' +
            'where orc.createdat >= ? ' +
            ' and orcd.kind = ? ' +
            ' and qtty_sold > 0 ',
            {
              replacements: ['2023-09-12', 'checkpoint'],
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

  static async getOrderSale(tb_institution_id, tb_order_id, terminal) {
    const promise = new Promise((resolve, reject) => {
      try {     
        Tb.sequelize
          .query(
            'select * ' +
            'from tb_order_sale ors ' +
            'where ors.tb_institution_id =? ' +
            ' and ors.id = ? ' +
            ' and ors.terminal =? ',
            {
              replacements: [tb_institution_id, tb_order_id, terminal],
              type: Tb.sequelize.QueryTypes.SELECT,
            }
          )
          .then((data) => {

            if (data.length > 0) {
              resolve(data);
            } else {
              resolve({ id: 0 });
            }
          })
      } catch (error) {
        reject("AuditLog.getOrderSale: " + error);
      }
    });
    return promise;
  }

  static async geraBody(tb_institution_id, tb_order_id, terminal) {
    const promise = new Promise((resolve, reject) => {
      try {
        OrderConsignmentController.getCheckpoint(tb_institution_id, tb_order_id)
        .then((data)=>{
          resolve(data);
        });
      } catch (error) {
        reject("AuditLog.geraBody: " + error);
      }
    });
    return promise;
  }
}

module.exports = AuditLogOrcSaleController;
