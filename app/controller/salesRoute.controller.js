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
        .catch(error => {
          reject('salesroute.getNexId: ' + error);
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
        .catch(error => {
          reject("salesroute.insert:" + error);
        });
    });
    return promise;
  }

  static getList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_sales_route ' +
        'where (tb_institution_id =? ) '+
        ' and (active = ?) ',
        {
          replacements: [tb_institution_id,'S'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(error => {
          reject("salesroute.getlist: " + error);
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
        .catch(error => {
          reject('salesroute.get: ' + error);
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
        .catch(error => {
          reject("salesroute.update:" + error);
        });
    });
    return promise;
  }

  static async sequence(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataRoute = await SalesRouteCustomerController.getListOrderSequence(body.tb_institution_id,
          body.tb_sales_route_id,
          body.tb_region_id,
          body.tb_customer_id,
          body.sequence);

        var dataSequence = {};
        dataSequence = {
          tb_institution_id: body.tb_institution_id,
          tb_sales_route_id: body.tb_sales_route_id,
          tb_customer_id: body.tb_customer_id,
          sequence: body.sequence,
        };
        await SalesRouteCustomerController.updateSequence(dataSequence);

        if (dataRoute.length > 0) {
          var seqRoute = body.sequence;
          for (var item of dataRoute) {
            seqRoute += 1;
            dataSequence = {
              tb_institution_id: item.tb_institution_id,
              tb_sales_route_id: item.tb_sales_route_id,
              tb_customer_id: item.tb_customer_id,
              sequence: seqRoute,
            };
            await SalesRouteCustomerController.updateSequence(dataSequence);
          }
        } else {
          //entra aqui quando foi seleciona um cliente para ficar depois do ultimo
          body.sequence = 0
          var dataRoute = await SalesRouteCustomerController.getListOrderSequence(body.tb_institution_id,
            body.tb_sales_route_id,
            body.tb_region_id,
            body.tb_customer_id,
            body.sequence);
          if (dataRoute.length > 0) {
            var seqRoute = body.sequence;
            for (var item of dataRoute) {
              seqRoute += 1;
              dataSequence = {
                tb_institution_id: item.tb_institution_id,
                tb_sales_route_id: item.tb_sales_route_id,
                tb_customer_id: item.tb_customer_id,
                sequence: seqRoute,
              };
              await SalesRouteCustomerController.updateSequence(dataSequence);
            }
            seqRoute += 1;
            dataSequence = {
              tb_institution_id: body.tb_institution_id,
              tb_sales_route_id: body.tb_sales_route_id,
              tb_customer_id: body.tb_customer_id,
              sequence: seqRoute,
            };
            await SalesRouteCustomerController.updateSequence(dataSequence);

          }
        }
        resolve("Sequência da rota atualizada!!");
      } catch (error) {
        reject("salesroute.sequence:" + error);
      }
    });
    return promise;
  }

  static async defaultSequence(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataRoute = await SalesRouteCustomerController.getListOrderDefaultSeq(body.tb_institution_id,
          body.tb_sales_route_id,
          body.tb_region_id,
          body.default_seq);

        var dataSequence = {};
        dataSequence = {
          tb_institution_id: body.tb_institution_id,
          tb_sales_route_id: body.tb_sales_route_id,
          tb_customer_id: body.tb_customer_id,
          default_seq: body.default_seq,
        };

        await SalesRouteCustomerController.updateDefaultSeq(dataSequence);

        if (dataRoute.length > 0) {
          var seqDefaultRoute = body.default_seq;
          for (var item of dataRoute) {
            seqDefaultRoute += 1;
            dataSequence = {
              tb_institution_id: item.tb_institution_id,
              tb_sales_route_id: item.tb_sales_route_id,
              tb_customer_id: item.tb_customer_id,
              default_seq: seqDefaultRoute,
            };
            await SalesRouteCustomerController.updateDefaultSeq(dataSequence);
          }
        }
        resolve("Sequência Padrão da rota atualizada!!");
      } catch (error) {
        reject("salesroute.defaultSequence:" + error);
      }
    });
    return promise;
  }

  static async applyDefault(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataRoute = await SalesRouteCustomerController.getListByRegion(body.tb_institution_id,
          body.tb_sales_route_id,
          body.tb_region_id);
        var dataSequence = {};
        if (dataRoute.length > 0) {
          for (var item of dataRoute) {
            dataSequence = {
              tb_institution_id: item.tb_institution_id,
              tb_sales_route_id: item.tb_sales_route_id,
              tb_customer_id: item.tb_customer_id,
              sequence: item.default_seq,
            };
            console.log("Rota: " + item.tb_sales_route_id + " - Região: " + item.tb_region_id)
            await SalesRouteCustomerController.updateSequence(dataSequence);
          }
        }
        resolve("Sequência Padrão da rota atualizada!!");
      } catch (error) {
        reject("salesroute.defaultSequence:" + error);
      }
    });
    return promise;
  }


  static async setTurnBack(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        SalesRouteCustomerController.setTurnBack(body);
        resolve("changed");
      } catch (error) {
        reject("salesroute.setTurnBack:" + error);
      }
    });
    return promise;
  }

  static async setRecall(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataRecall = {
          tb_institution_id: body.order.tb_institution_id,
          tb_customer_id: body.order.tb_customer_id,
          recall: body.order.recall,
        }
        SalesRouteCustomerController.setRecall(dataRecall);
        resolve("changed");
      } catch (error) {
        reject("salesroute.setTurnBack:" + error);
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
          .catch(error => {
              reject("Erro:"+ error);
          });
      */
    });
    return promise;
  }

}
module.exports = SalesRouteController;