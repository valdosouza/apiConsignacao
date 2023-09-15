const AuditLog = require("./auditLog.controller.js");
const db = require("../model/index.js");
const Tb = db.auditlog;
const OrderConsignmentController = require("./orderConsignment.controller.js");
const OrderItemConsignmentController = require("./orderItemConsignment.controller.js");
const StockStatement = require('./stockStatement.controller.js');
const entityHasStockList = require("./entityHasStockList.controller.js");

class AuditLogOrcCardToConsignmentController extends AuditLog {

  static async doExecute() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var orderList = await this.getList();
        var order = {};
        if (orderList.length > 0) {
          for (var item of orderList) {
            await this.autoCreateOrderConsignmentItem(item);

          }
        }
        resolve({
          result: true,
          message: 'AuditLogOrcCardToConsignment efetuada com Sucesso'
        });
      } catch (error) {
        reject("AuditLogOrcCardToConsignmentController: " + error);
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
            ' orcd.new_consignment, orcd.unit_value, ori.id ' +
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
            'and orcd.new_consignment > 0 ' +
            'and ori.id is null ',
            {
              replacements: ['Consignment', 'supplying','supplying'],
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

  static async autoCreateOrderConsignmentItem(item) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {
          id: 0,
          tb_institution_id: item.tb_institution_id,
          tb_order_id: item.tb_order_id,
          terminal: 0,
          tb_stock_list_id: 0,//Neste caso via card na consignação deve informar o estoque do vendedor 
          tb_product_id: item.tb_product_id,
          quantity: item.devolution,
          unit_value: item.unit_value,
          kind: 'Consignment',
        };
        
        var stockList = await entityHasStockList.getByEntity(item.tb_institution_id, item.tb_salesman_id, 'salesman');
        dataItem.tb_stock_list_id = stockList[0].tb_stock_list_id;        
        OrderItemConsignmentController.insert(dataItem)
        .then(()=>{
          resolve(dataItem);
        });        
      } catch (error) {
        reject('autoCreateOrderConsignmentItem'+error);
      }
    });
    return promise;
  }
}

module.exports = AuditLogOrcCardToConsignmentController;
