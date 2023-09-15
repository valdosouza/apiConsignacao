const AuditLog = require("./auditLog.controller.js");
const db = require("../model/index.js");
const Tb = db.auditlog;
const OrderSaleController = require("./orderSale.controller.js");
const OrderItemSaleController = require("./orderItemSale.controller.js");
const StockStatement = require('./stockStatement.controller.js');
const entityHasStockList = require("./entityHasStockList.controller.js");

class AuditLogOrcCardToSaleController extends AuditLog {

  static async doExecute() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var orderList = await this.getList();
        var orderSale = {};
        if (orderList.length > 0) {
          for (var item of orderList) {
            orderSale = await OrderSaleController.getOrder(item.tb_institution_id, item.tb_order_id)
            if (orderSale.id == 0) {
              await this.autoCreateOrderSale(item);
            }
            await this.autoCreateOrderSaleItem(item);

          }
        }
        resolve({
          result: true,
          message: 'AuditLogOrcCardToSale efetuada com Sucesso'
        });
      } catch (error) {
        reject("AuditLogOrcCardToSaleController: " + error);
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
            ' orcd.qtty_sold, orcd.unit_value, ori.id ' +
            'from tb_order_consignment_card orcd ' +
            '  inner join tb_order_consignment orc ' +
            '  on (orc.id = orcd.id) ' +
            '    and (orc.tb_institution_id = orcd.tb_institution_id) ' +
            '  left outer join tb_order_item ori ' +
            '    on (ori.tb_order_id = orc.id) ' +
            '    and (ori.tb_product_id = orcd.tb_product_id) ' +
            '    and (ori.tb_institution_id = orc.tb_institution_id)     ' +
            '     and (ori.kind = ?)     ' +
            'where orc.kind = ?     ' +
            ' and orcd.kind = ? ' +
            ' and orcd.qtty_sold > 0 ' +
            ' and ori.id is null ',
            //' and (orc.id = 10309) ',
            {
              replacements: ['Sale', 'checkpoint', 'checkpoint'],
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

  static async autoCreateOrderSale(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const dataOrder = {
          id: body.tb_order_id,
          tb_institution_id: body.tb_institution_id,
          terminal: 0,
          tb_salesman_id: body.tb_salesman_id,
          number: 0,
          tb_customer_id: body.tb_customer_id,
          total_value: body.total_value,
          change_value: body.change_value,
        }
        dataOrder.number = await OrderSaleController.getNextNumber(body.tb_institution_id);
        OrderSaleController.create(dataOrder)
          .then(() => {
            resolve(dataOrder);
          })
      } catch (error) {
        reject('autoCreateOrderSale:' + error);
      }
    });
    return promise;
  }

  static async autoCreateOrderSaleItem(item) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {
          id: 0,
          tb_institution_id: item.tb_institution_id,
          tb_order_id: item.tb_order_id,
          terminal: 0,
          tb_stock_list_id: 0,//Neste caso via card na consignação deve informar o estoque do cliente 
          tb_product_id: item.tb_product_id,
          quantity: item.qtty_sold,
          unit_value: item.unit_value,
          kind: 'Sale',
        };
        var stockList = await entityHasStockList.getByEntity(item.tb_institution_id, item.tb_customer_id, 'customer');
        dataItem.tb_stock_list_id = stockList[0].tb_stock_list_id;        
        OrderItemSaleController.insert(dataItem)
        .then(()=>{
          resolve(dataItem);
        });        
      } catch (error) {
        reject('autoCreateOrderSaleItem'+error);
      }
    });
    return promise;
  }
}

module.exports = AuditLogOrcCardToSaleController;
