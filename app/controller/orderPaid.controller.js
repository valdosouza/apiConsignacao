const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderpaid;

class OrderPaidController extends Base {

  static async getById(id, tb_institution_id, tb_payment_type_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_order_paid ' +
        'where ( id =?) ' +
        ' and (tb_institution_id =?)' +
        ' and (tb_payment_type_id =?)',
        {
          replacements: [id, tb_institution_id, tb_payment_type_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject('OrderPaidController.getById: ' + err);
        });
    });
    return promise;
  };

  static async save(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var resultOrder = [];
        resultOrder = await this.getById(body.id, body.tb_institution_id, body.tb_payment_type_id);
        if (resultOrder.length == 0) {
          this.insert(body)
            .then(data => {
              resolve(data);
            })
        } else {
          this.update(body)
            .then(data => {
              resolve(data);
            })
        }
        resolve(body);
      } catch (err) {
        reject('OrderPaidController.save: ' + err);
      }
    });
    return promise;
  }

  static async insert(body) {
    const promise = new Promise(async (resolve, reject) => {
      Tb.create(body)
        .then(async (data) => {
          resolve(data);
        })
        .catch(err => {
          reject("OrderPaidController.insert:" + err);
        });
    });
    return promise;
  }

  //Lembrar que está vinculada a Consignação
  static getList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select ' +
        '  ord.id, ' +
        '  ord.tb_institution_id, ' +
        '  ord.tb_user_id, ' +
        '  ora.tb_entity_id,' +
        '  etd.name_company name_entity,' +
        '  ord.dt_record, ' +
        '  ora.number, ' +
        '  ord.status, ' +
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note ' +
        'from tb_order ord  ' +
        '   inner join tb_order_consignment ora ' +
        '   on (ora.id = ord.id)  ' +
        '     and (ora.tb_institution_id = ord.tb_institution_id) ' +
        '     and (ora.terminal = ord.terminal) ' +
        '   inner join tb_entity etd ' +
        '   on (etd.id = ora.tb_entity_id)  ' +
        'where (ord.tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("OrderPaidController.getlist: " + err);
        });
    });
    return promise;
  }


  static async update(body) {
    const promise = new Promise((resolve, reject) => {
      const dataOrder = {
        value: body.value,
      }

      Tb.update(dataOrder, {
        where: {
          id: body.tb_order_id,
          tb_institution_id: body.tb_institution_id,
          terminal: 0,
          tb_payment_type_id_id: body.tb_payment_type_id,
          kind: dataOrder.kind
        }
      })
        .then(() => {
          resolve(body);
        })
        .catch(err => {
          reject("OrderPaidController.update:" + err);
        });
    });
    return promise;
  }

  static async delete(order) {
    const promise = new Promise((resolve, reject) => {
      Tb.destroy({
        where: {
          id: order.id,
          tb_institution_id: order.tb_institution_id,
          terminal: order.terminal,
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("OrderPaid.delete:" + err);
        });
    });
    return promise;
  }

  static async cleanUp(tb_institution_id, id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const order = {
          tb_institution_id: tb_institution_id,
          id: id,
          terminal: 0,
        }
        await this.delete(order);
        resolve("clenUp executado com sucesso!");
      } catch (error) {
        reject('orderPaid.cleanUp ' + error);
      }
    });
    return promise;
  }
}
module.exports = OrderPaidController;