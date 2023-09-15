const AuditLog = require("./auditLog.controller.js");
const db = require("../model/index.js");
const Tb = db.auditlog;
const StockBalance = require('./stockBalance.controller.js');

class AuditLogStockStatementStockBalance extends AuditLog {

  static async doExecute() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var list = await this.getList();
        var dataUpdate = {};
        if (list.length > 0) {
          for (var item of list) {
            dataUpdate = {
              tb_institution_id: 1,
              tb_stock_list_id: item.tb_stock_list_id,
              tb_merchandise_id: item.tb_merchandise_id,
              quantity: item.quantity
            }
            await StockBalance.update(dataUpdate);
          }
        }
        resolve({
          result: true,
          message: 'AuditLogStockStatementStockBalance efetuada com Sucesso'
        });
      } catch (error) {
        reject("AuditLogStockStatementStockBalance: " + error);
      }
    });
    return promise;
  }

  static async getList() {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.sequelize
          .query(
            'select tb_stock_list_id, tb_merchandise_id, sum(saldo) quantity ' +
            'from ( ' +
            '    select stt.tb_stock_list_id, stt.tb_merchandise_id, stt.direction, sum(stt.quantity) saldo ' +
            '    from tb_stock_statement stt ' +
            '    where stt.direction  = ? ' +
            '    group by 1,2,3 ' +
            '    UNION ' +
            '    select stt.tb_stock_list_id, stt.tb_merchandise_id, stt.direction, (sum(stt.quantity) * -1) saldo ' +
            '    from tb_stock_statement stt ' +
            '    where stt.direction  = ? ' +
            '    group by 1,2,3 ' +
            ')saldo_geral ' +
            'group by 1,2 ' ,
            {
              replacements: ['E', 'S'],
              type: Tb.sequelize.QueryTypes.SELECT,
            }
          )
          .then((data) => {
            resolve(data);
          })
      } catch (error) {
        reject("AuditLogStockStatementStockBalance.getList: " + error);
      }
    });
    return promise;
  }
}

module.exports = AuditLogStockStatementStockBalance;
