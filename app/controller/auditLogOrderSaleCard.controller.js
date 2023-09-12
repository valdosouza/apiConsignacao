const AuditLog = require("./auditLog.controller.js");
const db = require("../model/index.js");
const Tb = db.ordersalecard;

class AuditLogOrderSaleCardController extends AuditLog {

  static async doExecute(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {

        for (var item of body) {
          await Tb.update({sale: item.sale}, {
            where: { id: item.id,
                     tb_product_id: item.tb_product_id 
                     }
          });
        };
        resolve("Iems Atualizados");
      } catch (error) {
        reject("AuditLog.create: " + error);
      }
    });
    return promise;
  }

}
module.exports = AuditLogOrderSaleCardController;
