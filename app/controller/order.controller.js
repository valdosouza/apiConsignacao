const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.order;

class OrderController extends Base {
  static async getNextId(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(id) lastId ' +
        'from tb_order ' +
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
          reject('order.getNexId: ' + err);
        });
    });
    return promise;
  }

  static async insert(order) {
    const promise = new Promise(async (resolve, reject) => {
      const nextId = await this.getNextId(order.tb_institution_id);
      order.id = nextId;
      Tb.create(order)
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("order.insert:" + err);
        });
    });
    return promise;
  }

  static getList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_order ' +
        'where (tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("order.getlist: " + err);
        });
    });
    return promise;
  }

  static get(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select * ' +
        'from tb_order ' +
        'where (tb_institution_id =? ) ' +
        ' and (id =? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject('order.get: ' + err);
        });
    });
    return promise;
  }

  static async update(order) {
    const promise = new Promise((resolve, reject) => {
      if (order.validity == '') delete order.validity;      
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
          reject("order.update:" + err);
        });
    });
    return promise;
  }

  static async updateStatus(tb_institution_id, id, status) {
    const promise = new Promise(async (resolve, reject) => {
      Tb.update({ status: status }, {
        where: {
          id: id,
          tb_institution_id: tb_institution_id,
          terminal: 0
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("order.updateStatus:" + err);
        });
    });
    return promise;
  }

  static async updateNote(tb_institution_id, id, note) {
    const promise = new Promise(async (resolve, reject) => {
      Tb.update({ note: note }, {
        where: {
          id: id,
          tb_institution_id: tb_institution_id,
          terminal: 0
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("order.updateNote:" + err);
        });
    });
    return promise;
  }

  static async delete(order) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
      Tb.delete(order)
          .then((data) => {
              resolve(data);
          })
          .catch(err => {
              reject("Erro:"+ err);
          });
      */
    });
    return promise;
  }

}
module.exports = OrderController;