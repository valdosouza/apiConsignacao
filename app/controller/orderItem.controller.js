const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderitem;

class OrderItemController extends Base {
  static async getNextId(tb_institution_id, tb_order_id, kind) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(id) lastId ' +
        'from tb_order_item ' +
        'WHERE ( tb_institution_id =? ) ' +
        ' and (tb_order_id =?)' +
        ' and ( kind =? ) ',
        {
          replacements: [tb_institution_id, tb_order_id, kind],
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
          reject('orderItem.getNexId: ' + err);
        });
    });
    return promise;
  }

  static async insert(item) {
    const promise = new Promise(async (resolve, reject) => {
      const nextId = await this.getNextId(item.tb_institution_id, item.tb_order_id, item.kind);
      item.id = nextId;
      Tb.create(item)
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("item.insert:" + err);
        });
    });
    return promise;
  }

  static getList(tb_institution_id, tb_order_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_order_item ' +
        'where (tb_institution_id =? ) ' +
        ' and (tb_order_id =?) ',
        {
          replacements: [tb_institution_id, tb_order_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("item.getlist: " + err);
        });
    });
    return promise;
  }

  static get(tb_institution_id, tb_order_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select * ' +
        'from tb_order_item ' +
        'where (tb_institution_id =? ) ' +
        ' and (tb_order_id =?) ' +
        ' and (id =? )',
        {
          replacements: [tb_institution_id, tb_order_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject('item.get: ' + err);
        });
    });
    return promise;
  }

  static async update(item) {
    const promise = new Promise((resolve, reject) => {
      Tb.update(item, {
        where: { id: item.id, tb_institution_id: item.tb_institution_id, tb_order_id: item.tb_order_id }
      })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("item.update:" + err);
        });
    });
    return promise;
  }

  static async delete(item) {
    const promise = new Promise((resolve, reject) => {
      Tb.destroy({
        where: {
          id: item.id,
          tb_institution_id: item.tb_institution_id,
          tb_order_id: item.tb_order_id,
          terminal: item.terminal,
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("Erro:" + err);
        });
    });
    return promise;
  }

  static async cleanUp(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.destroy({
        where: {
          tb_institution_id: tb_institution_id,
          tb_order_id: id,
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("orderItem.CleanUp:" + err);
        });
    });
    return promise;
  }  
}
module.exports = OrderItemController;