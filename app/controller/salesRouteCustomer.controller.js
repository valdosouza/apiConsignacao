const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.salesroutecustomer;

class SalesRouteCustomerController extends Base {

  static async insert(salesroutecustomer) {
    const promise = new Promise(async (resolve, reject) => {
      Tb.create(salesroutecustomer)
        .then((data) => {
          resolve(data);
        })
        .catch(error => {
          reject("salesrouteCustomer.insert:" + error);
        });
    });
    return promise;
  }

  static getByCustomer(tb_institution_id, tb_customer_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select * , sr.description ' +
        'from tb_sales_route_customer src ' +
        '  inner join tb_sales_route sr ' +
        '  on (sr.id = src.tb_sales_route_id) ' +
        '  and (sr.tb_institution_id = src.tb_institution_id) ' +
        'where (src.tb_institution_id =? ) ' +
        ' and (src.tb_customer_id =? )',
        {
          replacements: [tb_institution_id, tb_customer_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0)
            resolve(data[0])
          else
            resolve(data);
        })
        .catch(error => {
          reject('salesroute.get: ' + error);
        });
    });
    return promise;
  }

  static getListOrderSequence(tb_institution_id, tb_sales_route_id,tb_region_id,tb_customer_id, sequence) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select src.tb_institution_id, src.tb_sales_route_id, '+
        'src.tb_customer_id, src.default_seq, src.sequence, ctm.tb_region_id  '+
        'from tb_sales_route_customer src  '+
        '   inner join tb_customer ctm  '+
        '   on (ctm.id = src.tb_customer_id) '+
        '   and (ctm.tb_institution_id = src.tb_institution_id) '+
        'where (src.tb_institution_id =? )  '+
        ' and (src.tb_sales_route_id =? ) '+
        ' and (ctm.tb_region_id = ?) '+   
        ' and (src.tb_customer_id <> ?) '+
        ' and (sequence >= ?) '+        
        'order by sequence ',
        {
          replacements: [tb_institution_id, tb_sales_route_id, tb_region_id,tb_customer_id, sequence],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(error => {
          reject('salesroute.getListOrderSequence: ' + error);
        });
    });
    return promise;
  }

  static getListOrderDefaultSeq(tb_institution_id, tb_sales_route_id, tb_region_id, default_seq) {
    const promise = new Promise((resolve, reject) => {
      var sqltxt = '';
      sqltxt = sqltxt.concat(
        'select src.tb_institution_id, src.tb_sales_route_id, '+
        'src.tb_customer_id, src.default_seq, src.sequence, ctm.tb_region_id  '+
        'from tb_sales_route_customer src  '+
        '   inner join tb_customer ctm  '+
        '   on (ctm.id = src.tb_customer_id) '+
        '   and (ctm.tb_institution_id = src.tb_institution_id) '+
        'where (src.tb_institution_id =? )  '+
        ' and (src.tb_sales_route_id =? ) '+
        ' and (ctm.tb_region_id = ?) '+
        ' and (default_seq >= ?)'+
        'order by default_seq '
      )
      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [tb_institution_id, tb_sales_route_id, tb_region_id, default_seq],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(error => {
          reject('salesroute.get: ' + error);
        });
    });
    return promise;
  }

  static getListByRegion(tb_institution_id, tb_sales_route_id, tb_region_id) {
    const promise = new Promise((resolve, reject) => {
      var sqltxt = '';
      sqltxt = sqltxt.concat(
        'select src.tb_institution_id, src.tb_sales_route_id, '+
        'src.tb_customer_id, src.default_seq, src.sequence, ctm.tb_region_id  '+
        'from tb_sales_route_customer src  '+
        '   inner join tb_customer ctm  '+
        '   on (ctm.id = src.tb_customer_id) '+
        '   and (ctm.tb_institution_id = src.tb_institution_id) '+
        'where (src.tb_institution_id =? )  '+
        ' and (src.tb_sales_route_id =? ) '+
        ' and (ctm.tb_region_id = ?) ',        
        )
      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [tb_institution_id, tb_sales_route_id, tb_region_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(error => {
          reject('salesroute.getListByRegion: ' + error);
        });
    });
    return promise;
  }

  static async update(body) {
    const promise = new Promise(async (resolve, reject) => {
      const route = await this.getByCustomer(body.tb_institution_id,
        body.tb_customer_id);

      if (route['tb_sales_route_id'] != body.tb_sales_route_id) {
        Tb.destroy({
          where: {
            tb_institution_id: body.tb_institution_id,
            tb_customer_id: body.tb_customer_id
          }
        })
          .then(() => {
            Tb.create(body, {
              where: {
                tb_sales_route_id: body.tb_sales_route_id,
                tb_institution_id: body.tb_institution_id,
                tb_customer_id: body.tb_customer_id
              }
            })
              .then(data => {
                resolve(data);
              })
          })
          .catch(error => {
            reject("salesrouteCustomer.delete:" + error);
          });
      } else {
        resolve("Rotas Informada é igual a atual");
      }
    });
    return promise;
  }

  static async updateSequence(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataUpdate = {
          sequence: body.sequence
        };
        Tb.update(dataUpdate, {
          where: {
            tb_institution_id: body.tb_institution_id,
            tb_sales_route_id: body.tb_sales_route_id,
            tb_customer_id: body.tb_customer_id
          }
        })
          .then(data => {
            resolve(data);
          })
      } catch (error) {
        reject("salesrouteCustomer.updateSequence:" + error);
      }
    });
    return promise;
  }
  static async updateDefaultSeq(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataUpdate = {
          default_seq: body.default_seq
        };
        Tb.update(dataUpdate, {
          where: {
            tb_institution_id: body.tb_institution_id,
            tb_sales_route_id: body.tb_sales_route_id,
            tb_customer_id: body.tb_customer_id
          }
        })
          .then(data => {
            resolve(data);
          })
      } catch (error) {
        reject("salesrouteCustomer.updateDefaultSeq:" + error);
      }
    });
    return promise;
  }

  static async applyDefault(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataUpdate = {
          sequence: default_seq
        };
        Tb.update(dataUpdate, {
          where: {
            tb_institution_id: body.tb_institution_id,
            tb_sales_route_id: body.tb_sales_route_id            
          }
        })
          .then(data => {
            resolve(data);
          })
      } catch (error) {
        reject("salesrouteCustomer.applyDefault:" + error);
      }
    });
    return promise;
  }

  static async setTurnBack(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        Tb.update(body, {
          where: {
            tb_institution_id: body.tb_institution_id,
            tb_sales_route_id: body.tb_sales_route_id,
            tb_customer_id: body.tb_customer_id
          }
        })
          .then(data => {
            resolve(data);
          })
      } catch (error) {
        reject("salesrouteCustomer.updateSequence:" + error);
      }
    });
    return promise;
  }

  static async setRecall(data) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var recall = {};
        if (data.recall == "S") {
          recall = { active: 'N' };
        } else {
          recall = { active: 'S' };
        }
        Tb.update(recall, {
          where: {
            tb_institution_id: data.tb_institution_id,
            tb_customer_id: data.tb_customer_id
          }
        })
          .then(data => {
            resolve(data);
          })

      } catch (error) {
        reject("salesrouteCustomer.updateSequence:" + error);
      }
    });
    return promise;
  }
}
module.exports = SalesRouteCustomerController;