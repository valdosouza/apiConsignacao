const Base = require('../controller/base.controller.js')
const db = require("../model");
const Tb = db.phone;

class PhoneController extends Base {
  static async getById(id, kind) {
    const promise = new Promise((resolve, reject) => {
      try {
        var sqltxt =
          'Select * ' +
          'from tb_phone ' +
          'where ( id =?) ';
        if (kind.length > 0)
          sqltxt = sqltxt +
            ' and kind =?';
        Tb.sequelize.query(
          sqltxt,
          {
            replacements: [id, kind],
            type: Tb.sequelize.QueryTypes.SELECT
          })
          .then(data => {
            if (data.length > 0)
              resolve(data[0])
            else
              resolve(data);
          })
          .catch(error => {
            reject('Phone.getById: ' + error);
          });
      } catch (error) {
        reject('Phone.getById: ' + error);
      }
    });
    return promise;
  }

  static async save(phone) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var resultPhone = await this.getById(phone.id, phone.kind);
        if (resultPhone.length == 0) {
          this.insert(phone);
        } else {
          this.update(phone);
        }
        resolve(phone);
      } catch (error) {
        reject('Phone.save: ' + error);
      }
    });
    return promise;
  }

  static async insert(phone) {
    const promise = new Promise((resolve, reject) => {
      try {
        Tb.create(phone)
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject("Phone.insert:" + error);
          });
      } catch (error) {
        reject('Phone.insert: ' + error);
      }
    });
    return promise;
  }

  static async update(phone) {
    const promise = new Promise((resolve, reject) => {
      Tb.update(phone, {
        where: { id: phone.id, kind: phone.kind }
      })
        .catch(error => {
          reject("Phone.update:" + error);
        });
    });
    return promise;
  }
}
module.exports = PhoneController;