const Base = require('../controller/base.controller.js');
const db = require("../model");
const Tb = db.cashier;
const dateFunction = require('../util/dateFunction.js');

class CashierController extends Base {

  static async getNextId(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(id) lastId ' +
        'from tb_cashier ' +
        'WHERE ( tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data) {
            const NextId = data[0].lastId + 1;
            resolve(NextId);
          } else {
            resolve(1);
          }
        })
        .catch(err => {
          reject('cashier.getNexId: ' + err);
        });
    });
    return promise;
  }

  static async getLastIdOpen(tb_institution_id, tb_user_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select id,tb_institution_id,tb_user_id, dt_record, hr_end ' +
        'from tb_cashier ' +
        'WHERE ( tb_institution_id =? ) ' +
        'and id = ( ' +
        'Select max(id) lastId  ' +
        'from tb_cashier  ' +
        'WHERE ( tb_institution_id =? ) ' +
        ' and (tb_user_id = ?))  ',
        {
          replacements: [tb_institution_id, tb_institution_id, tb_user_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            if (data[0].hr_end) { var status = "F" } else { var status = "A" };
            resolve({
              id:data[0].id,
              tb_institution_id: data[0].tb_institution_id,
              tb_user_id: data[0].tb_user_id,
              dt_record: data[0].dt_record,
              status: status,
            });
          } else {
            resolve({
              id: 0,
              tb_institution_id: parseInt(tb_institution_id),
              tb_user_id: parseInt(tb_user_id),
              dt_record: "",
              status: "I",
            });
          }
        })
        .catch(err => {
          reject('cashier.getLastIdOpen: ' + err);
        });
    });
    return promise;
  }

  static async autoCreate(tb_institution_id, tb_user_id) {
    const promise = new Promise(async (resolve, reject) => {

      var cashier = await this.getLastIdOpen(tb_institution_id, tb_user_id);   
      if (cashier.status != 'A') {
        try {
          await this.open(tb_institution_id, tb_user_id);
          resolve("Caixa foi aberto");
        } catch (err) {
          reject("Erro:" + err);
        }
      }
      else {
        resolve("Caixa já estava aberto");
      }
    });
    return promise;
  }

  static async open(tb_institution_id, tb_user_id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const nextId = await this.getNextId(tb_institution_id);
        var dtRecord = dateFunction.newDate();
        var hrBegin = dateFunction.getTime();

        var dataCashier = {
          id: nextId,
          tb_institution_id: tb_institution_id,
          terminal: 0,
          tb_user_id: tb_user_id,
          dt_record: dtRecord,
          hr_begin: hrBegin,
        };
        Tb.create(dataCashier)
          .then((data) => {
            resolve(data);
          })
      } catch (err) {
        reject('Cashier.open: ' + err);
      }

    });
    return promise;
  };

  static async closure(tb_institution_id, id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var hrEnd = dateFunction.getTime();

        var dataCashier = {
          id: id,
          tb_institution_id: tb_institution_id,
          hr_end: hrEnd,
        };

        Tb.update(dataCashier, {
          where: { tb_institution_id: dataCashier.tb_institution_id, id: dataCashier.id }
        })
          .then((data) => {
            resolve(data);
          })
      } catch (err) {
        reject('Cashier.closure: ' + err);
      }

    });
    return promise;
  }



}
module.exports = CashierController;
