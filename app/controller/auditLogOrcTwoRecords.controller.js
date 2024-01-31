const AuditLog = require("./auditLog.controller.js");
const db = require("../model/index.js");
const Tb = db.auditlog;
const OrderConsignmentController = require("./orderConsignment.controller.js");

class AuditLogOrcTwoRecordsController extends AuditLog {

  static async doExecute() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var orderList = await this.getList();        
        for (var item of orderList) {
          await this.hasSupplying(item.tb_institution_id, item.id)
            .then(async (data) => {              
              if (data.result == false) {
               item.kind = 'supplying';
                item.total_value = 0;
                item.change_value = 0;
                item.previous_debit_balance = 0;
                await OrderConsignmentController.create(item);
              }
            })
        }
        resolve({
          result: true,
          message: 'Auditoria Two REcords  efetuada com Sucesso'
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
            'select * ' +
            'from tb_order_consignment ' +
            'where (tb_institution_id = ?) ' +
            'and (kind = ? )',
            {
              replacements: [1, 'checkpoint'],
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

  static async hasSupplying(tb_institution_id, id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        Tb.sequelize
          .query(
            'select id ' +
            'from tb_order_consignment ' +
            'where (tb_institution_id = ?) ' +
            ' and (id =?)' +
            'and (kind = ? )',
            {
              replacements: [tb_institution_id, id, 'supplying'],
              type: Tb.sequelize.QueryTypes.SELECT,
            }
          )
          .then((data) => {
            if (data.length > 0) {
              resolve({ result: true });
            } else {
              resolve({ result: false });
            }

          })
      } catch (error) {
        reject("AuditLog.getList: " + error);
      }
    });
    return promise;
  }
}
module.exports = AuditLogOrcTwoRecordsController;
