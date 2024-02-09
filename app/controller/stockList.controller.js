const Base = require('./base.controller.js')
const db = require("../model");
const Tb = db.stockList;
const stockbalance = require("./stockBalance.controller.js");

class StockListController extends Base {

  static async getIdNext(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(id) maxID ' +
        'from tb_stock_list ' +
        'where tb_institution_id=?',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0].maxID + 1);
        })
        .catch(() => {
          reject(0);
        });
    });
    return promise;
  }


  static async insert(stocklist) {
    const idNext = await this.getIdNext(stocklist.tb_institution_id);
    const promise = new Promise((resolve, reject) => {
      stocklist.id = idNext;
      Tb.create(stocklist)
        .then((data) => {
          stockbalance.autoInsertByStokcList(stocklist.tb_institution_id, data.id);
          resolve(data);
        })
        .catch(error => {
          reject("Erro:" + error);
        });
    });
    return promise;
  }


  static getList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_stock_list ' +
        'where tb_institution_id=?',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(new Error("stocklist.gelist:" + error));
        });
    });
    return promise;
  }

  static get(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_stock_list ' +
        'where ( tb_institution_id =? ) ' +
        ' and ( id =? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(error => {
          reject('stocklist.get: ' + error);
        });
    });
    return promise;
  }

  static async update(stocklist) {
    const promise = new Promise((resolve, reject) => {
      Tb.update(stocklist, {
        where: { tb_institution_id: stocklist.tb_institution_id, id: stocklist.id }
      })
        .then(data => {
          resolve(data[0]);
        })
        .catch(error => {
          reject("Erro:" + error);
        });
    });
    return promise;
  }

  static async delete(stocklist) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
      Tb.delete(stocklist)
          .then((data) => {
              resolve(data);
          })
          .catch(error => {
              reject("Erro:"+ error);
          });
      */
    });
    return promise;
  }

}
module.exports = StockListController;