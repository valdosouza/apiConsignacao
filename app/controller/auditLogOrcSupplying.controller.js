const AuditLog = require("./auditLog.controller.js");
const db = require("../model/index.js");
const Tb = db.auditlog;
const OrderConsignmentController = require("./orderConsignment.controller.js");
const OrderItemConsignmentController = require("./orderItemConsignment.controller.js");
const StockStatement = require('./stockStatement.controller.js');
const entityHasStockList = require("./entityHasStockList.controller.js");

class AuditLogOrcSupplyingController extends AuditLog {

  static async doExecute() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var orderList = await this.getList('supplying');
        var dataLog = {};
        for (var item of orderList) {
          await this.hasOrderConsignment(item.tb_institution_id, item.id, item.kind)
            .then(async (data) => {
              dataLog = {
                tb_institution_id: data.tb_institution_id,
                tb_user_id: data.tb_user_id,
                kind: 'Estoque Consignado',
                table_name: 'tb_order_consignment',
                record_id: item.id,
                result: data.result,
                note: "",
              };
              await this.create(dataLog);
            })
        }
        resolve({
          result: true,
          message: 'Auditoria OrderConsignment efetuada com Sucesso'
        });
      } catch (error) {
        reject("AuditLog.create: " + error);
      }
    });
    return promise;
  }

  static async getList(kind) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize
          .query(
            'select orc.id, orc.tb_institution_id, orc.kind ' +
            'from tb_order_consignment orc ' +
            '  LEFT outer join tb_audit_log adl ' +
            '  on (adl.record_id = orc.id) ' +
            '  and (adl.tb_institution_id = orc.tb_institution_id) ' +
            '  and (adl.table_name = ? ) ' +
            'where  adl.id is null '+
            //' and (orc.id = 10609) '+
            ' and (orc.kind =?) ',
            {
              replacements: ['tb_order_consignment', kind],
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

  static async hasOrderConsignment(tb_institution_id, id, kind) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var order = await OrderConsignmentController.getById(id, tb_institution_id, kind)
        var itemList = await OrderItemConsignmentController.getList(tb_institution_id, id, kind,'Consignment' );
        if (itemList.length > 0) {
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
              operation: 'Consignment',
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
                operation: 'Consignment',
              };
              //Sempre sai da Origem 
              stockSalesman = await entityHasStockList.getByEntity(order.tb_institution_id, order.tb_salesman_id,'salesman');
              dataItem['tb_stock_list_id'] = stockSalesman[0].tb_stock_list_id;
              dataItem['direction'] = 'S';
              await StockStatement.insert(dataItem);
              //Sempre Entra no Destino
              stockCustomer = await entityHasStockList.getByEntity(order.tb_institution_id, order.tb_customer_id,'customer');
              dataItem['tb_stock_list_id'] = stockCustomer[0].tb_stock_list_id;
              dataItem['direction'] = 'E';

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
            tb_institution_id: order.tb_institution_id,
            tb_user_id: order.tb_user_id,
            result: 'OK',
            note:"ordem sem itens"
          });          
        }
      } catch (error) {
        reject("AuditLog.hasOrderConsignment: " + error);
      }
    });
    return promise;
  }
}
module.exports = AuditLogOrcSupplyingController;
