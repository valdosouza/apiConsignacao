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
          .catch(err => {
            reject('Phone.getById: ' + err);
          });
      } catch (err) {
        reject('Phone.getById: ' + err);
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
      } catch (err) {
        reject('Phone.save: ' + err);
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
          .catch(err => {
            reject("Phone.insert:" + err);
          });
      } catch (err) {
        reject('Phone.insert: ' + err);
      }
    });
    return promise;
  }

  static async update(phone) {
    const promise = new Promise((resolve, reject) => {
      Tb.update(phone, {
        where: { id: phone.id, kind: phone.kind }
      })
        .catch(err => {
          reject("Phone.update:" + err);
        });
    });
    return promise;
  }
}
module.exports = PhoneController;