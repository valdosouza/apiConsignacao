const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.salesroute;
const SalesRouteCustomerController = require('./salesRouteCustomer.controller.js');

class SalesRouteController extends Base {
  static async getNextId(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(id) lastId ' +
        'from tb_sales_route ' +
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
          reject('salesroute.getNexId: ' + err);
        });
    });
    return promise;
  }

  static async insert(salesroute) {
    const promise = new Promise(async (resolve, reject) => {
      const nextId = await this.getNextId(salesroute.tb_institution_id);
      salesroute.id = nextId;
      if (salesroute.validity == '') delete salesroute.validity;
      Tb.create(salesroute)
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("salesroute.insert:" + err);
        });
    });
    return promise;
  }

  static getList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_sales_route ' +
        'where (tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("salesroute.getlist: " + err);
        });
    });
    return promise;
  }

  static get(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select * ' +
        'from tb_sales_route pl ' +
        'where (pl.tb_institution_id =? ) ' +
        ' and (pl.id =? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject('salesroute.get: ' + err);
        });
    });
    return promise;
  }

  static async update(salesroute) {
    const promise = new Promise((resolve, reject) => {
      if (salesroute.validity == '') delete salesroute.validity;
      Tb.update(salesroute, {
        where: { id: salesroute.id, tb_institution_id: salesroute.tb_institution_id }
      })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("salesroute.update:" + err);
        });
    });
    return promise;
  }

  static async sequence(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataRoute = await SalesRouteCustomerController.getListByRoute(body.tb_institution_id,
          body.tb_sales_route_id,
          body.sequence,
          body.tb_customer_id);
        var seqRoute = body.sequence;
        var dataSequence = {};
        dataSequence = {
          tb_institution_id: body.tb_institution_id,
          tb_sales_route_id: body.tb_sales_route_id,
          tb_customer_id: body.tb_customer_id,
          sequence: seqRoute,
        };
        await SalesRouteCustomerController.updateSequence(dataSequence);

        if (dataRoute.length > 0) {
          for (var item of dataRoute) {
            seqRoute = seqRoute + 1;
            dataSequence = {
              tb_institution_id: item.tb_institution_id,
              tb_sales_route_id: item.tb_sales_route_id,
              tb_customer_id: item.tb_customer_id,
              sequence: seqRoute,
            };
            await SalesRouteCustomerController.updateSequence(dataSequence);
          }
        }
        resolve("Sequência da rota atualizada!!");
      } catch (err) {
        reject("salesroute.sequence:" + err);
      }
    });
    return promise;
  }

  static async delete(salesroute) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
      Tb.delete(salesroute)
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
module.exports = SalesRouteController;