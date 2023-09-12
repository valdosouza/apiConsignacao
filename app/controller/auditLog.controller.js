const Base = require("./base.controller.js");
const db = require("../model/index.js");
const Tb = db.auditlog;

class AuditLogController extends Base {
  static async create(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        Tb.create(body)
          .then((data) => {            
            resolve(data);
          })
      } catch (error) {
        reject("AuditLog.create: " + error);
      }
    });
    return promise;
  }
}
module.exports = AuditLogController;
