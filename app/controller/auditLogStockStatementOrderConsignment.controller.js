const AuditLog = require("./auditLog.controller.js");
const db = require("../model/index.js");
const Tb = db.auditlog;
const StockStatement = require('./stockStatement.controller.js');
const entityHasStockList = require("./entityHasStockList.controller.js");

class AuditLogStockStatementOrderConsignment extends AuditLog {

  static async doExecute() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var orderList = await this.getList();
        var dataItem = {};
        var stockOri = {};
        var stockDes = {};

        if (orderList.length > 0) {
          for (var item of orderList) {
            dataItem = {
              id: 0,
              tb_institution_id: item.tb_institution_id,
              tb_order_id: item.tb_order_id,
              terminal: 0,
              tb_order_item_id: item.tb_order_item_id,
              tb_stock_list_id: 0,
              local: "web",
              kind: "Fechamento",
              dt_record: item.dt_record,
              direction: "S",
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "Consignment"
            };
            //Saida do estoque do vendedor
            stockOri = await entityHasStockList.getByEntity(item.tb_institution_id, item.tb_salesman_id, 'salesman');
            dataItem.tb_stock_list_id = stockOri[0].tb_stock_list_id;
            dataItem.direction = 'S';
            await StockStatement.insert(dataItem);
            //Entrada estoque do Cliente
            stockDes = await entityHasStockList.getByEntity(item.tb_institution_id, item.tb_customer_id, 'customer');
            dataItem.tb_stock_list_id = stockDes[0].tb_stock_list_id;
            dataItem.direction = 'E';
            await StockStatement.insert(dataItem);

          }
        }
        resolve({
          result: true,
          message: 'AuditLogStockStatementOrderConsignment efetuada com Sucesso'
        });
      } catch (error) {
        reject("AuditLogStockStatementOrderConsignment: " + error);
      }
    });
    return promise;
  }

  static async getList() {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize
          .query(
            'select ori.tb_institution_id, ori.tb_order_id, ori.terminal, ori.id tb_order_item_id, ' +
            'ori.tb_stock_list_id, ord.dt_record, ori.tb_product_id, ori.quantity, orc.tb_salesman_id, orc.tb_customer_id ' +
            'from tb_order_item ori     ' +
            '    inner join tb_order_consignment orc     ' +
            '    on (orc.id =ori.tb_order_id)  ' +
            '        and (orc.tb_institution_id = ori.tb_institution_id) ' +
            '        and (orc.terminal = ori.terminal) ' +

            '    inner join tb_order ord ' +
            '    on (ord.id =orc.id)  ' +
            '      and (ord.tb_institution_id = orc.tb_institution_id) ' +
            '      and (ord.terminal = orc.terminal) ' +

            '    left outer join tb_stock_statement stt ' +
            '    on (stt.tb_order_id = ori.tb_order_id)  ' +
            '        and (stt.tb_order_item_id = ori.id) ' +
            '        and (stt.terminal = ori.terminal)  ' +
            '        and (stt.tb_institution_id = ori.tb_institution_id)  ' +
            '        and (stt.tb_merchandise_id = ori.tb_product_id) ' +
            '        and (stt.operation = ori.kind) ' +
            'where stt.id is null   ' +
            'and ori.kind = ? ' +
            'and orc.kind = ? ',
            {
              replacements: ['Consignment', 'supplying'],
              type: Tb.sequelize.QueryTypes.SELECT,
            }
          )
          .then((data) => {
            resolve(data);
          })
      } catch (error) {
        reject("AuditLogStockStatementOrderConsignment.getList: " + error);
      }
    });
    return promise;
  }
}

module.exports = AuditLogStockStatementOrderConsignment;
