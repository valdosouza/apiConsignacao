const Base = require('./base.controller.js');
const db = require("../model");

const Tb = db.financial;

class FinancialController extends Base {

  static async insert(order) {
    const promise = new Promise(async (resolve, reject) => {
      Tb.create(order)
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("financial.insert:" + err);
        });
    });
    return promise;
  }

  static getList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_financial ' +
        'where (tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("financial.getlist: " + err);
        });
    });
    return promise;
  }

  static get(tb_institution_id, tb_order_id, parcel) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select * ' +
        'from tb_financial ' +
        'where (tb_institution_id =? ) ' +
        ' and (tb_order_id =? )',
        ' and (parcel =? )',
        {
          replacements: [tb_institution_id, tb_order_id, parcel],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject('financial.get: ' + err);
        });
    });
    return promise;
  }

  static async update(order) {
    const promise = new Promise((resolve, reject) => {
      Tb.update(order, {
        where: {
          id: order.id,
          tb_institution_id: order.tb_institution_id,
          terminal: order.terminal
        }
      })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("financial.update:" + err);
        });
    });
    return promise;
  }

  static async delete(financial) {
    const promise = new Promise((resolve, reject) => {
      Tb.destroy({
        where: {
          parcel: financial.parcel,
          tb_order_id: financial.tb_order_id,
          tb_institution_id: financial.tb_institution_id,
          terminal: financial.terminal,
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("Financial.delete:" + err);
        });
    });
    return promise;
  }

  static async deletebyOrder(financial) {
    const promise = new Promise((resolve, reject) => {
      Tb.destroy({
        where: {
          tb_order_id: financial.tb_order_id,
          tb_institution_id: financial.tb_institution_id,
          terminal: financial.terminal,
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("Financial.delete:" + err);
        });
    });
    return promise;
  }

  static async saveByCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataFinancial = {
          tb_institution_id: body.Order.tb_institution_id,
          tb_order_id: body.Order.id,
          terminal: 0,
          parcel: 1,
          tb_entity_id: body.Order.tb_customer_id,
          dt_record: body.Order.dt_record,
          number: 0,
          dt_expiration: body.Order.dt_record,
          tb_payment_types_id: 0,
          tag_value: 0,
          tb_financial_plans_id: 0,
          kind: "RA",
          situation: "D",
          operation: "C",
        }
        for (var item of body.Payments) {
          if (item.value > 0) {
            dataFinancial.parcel += dataFinancial.parcel;
            dataFinancial.tb_payment_types_id = item.tb_payment_type_id;
            if ((item.name_payment_type = 'DINHEIRO') && (body.Order.change_value > 0)) {
              dataFinancial.tag_value = item.value - body.Order.change_value;
            } else {
              dataFinancial.tag_value = item.value;
            }
            await this.insert(dataFinancial);
          }
        }
        resolve(body);
      } catch (error) {
        reject('financial.SaveBycard: ' + error)
      }

    });
    return promise;
  }

  static async cleanUp(tb_institution_id, id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const financial = {
          tb_institution_id: tb_institution_id,
          tb_order_id: id,
          terminal: 0,
        }
        await this.deletebyOrder(financial);
        resolve("clenUp executado com sucesso!");
      } catch (error) {
        reject('financial.cleanUp ' + error);
      }
    });
    return promise;
  }
}
module.exports = FinancialController;