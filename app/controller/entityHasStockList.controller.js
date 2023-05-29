const Base = require('./base.controller.js')
const db = require("../model");
const Tb = db.entityHasStockList;
const stockListcontroller = require('../controller/stockList.controller.js');
class EntityHasStockListController extends Base {


  static async createAuto(body) {
    const promise = new Promise(async (resolve, reject) => {
      var dataResult = {};
      var checkExist = await this.getByEntity(body.tb_institution_id, body.tb_entity_id);

      if (checkExist.length == 0) {
        try {
          var dataStockList = {
            id: 0,
            tb_institution_id: body.tb_institution_id,
            description: body.name_entity.substr(0,45),
            main: "N",
            active: "S",
          }
          stockListcontroller.insert(dataStockList)
            .then(data => {
              var dataEntityHasStockList = {
                tb_institution_id: body.tb_institution_id,
                tb_entity_id: body.tb_entity_id,
                tb_stock_list_id: data.id,
              }
              Tb.create(dataEntityHasStockList)
                .then((data) => {
                  dataResult = {
                    tb_institution_id: data.tb_institution_id,
                    tb_entity_id: data.tb_entity_id,
                    tb_stock_list_id: data.tb_stock_list_id,
                  }
                  resolve(dataResult);
                });
            })
        } catch (error) {
          reject("Erro:" + err);
        }
      } else {        
        resolve(checkExist[0]);
      }
    });
    return promise;
  }


  static async get(tb_institution_id, tb_entity_id, tb_stock_list_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_entity_has_stock_list  ' +
        'where ( tb_institution_id =? ) ' +
        ' and ( tb_entity_id =? ) ' +
        ' and ( tb_stock_list_id =? ) ',
        {
          replacements: [tb_institution_id, tb_entity_id, tb_stock_list_id],
          type: Tb.sequelize.QueryTypes.SELECT
        })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject('Entity.getById: ' + err);
        });
    });
    return promise;
  }

  static async getByEntity(tb_institution_id, tb_entity_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_entity_has_stock_list  ' +
        'where ( tb_institution_id =? ) ' +
        ' and ( tb_entity_id =? ) ',
        {
          replacements: [tb_institution_id, tb_entity_id],
          type: Tb.sequelize.QueryTypes.SELECT
        })
        .then(data => {          
          resolve(data);
        })
        .catch(err => {
          reject('Entity.getById: ' + err);
        });
    });
    return promise;
  }

  static async save(body) {
    const promise = new Promise(async (resolve, reject) => {
      var checkExist = await this.get(body.tb_institution_id, body.tb_entity_id, body.tb_stock_list_id)
      if (!checkExist) {
        try {
          Tb.create(model)
            .then((data) => {
              resolve("Estoque registrado na entidade!");
            })
        } catch (error) {
          reject("Erro:" + err);
        }
      }
      resolve("Entidade já tem estoque registrado");
    });
    return promise;
  }

  static async insert(model) {
    const promise = new Promise((resolve, reject) => {
      Tb.create(model)
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("Erro:" + err);
        });
    });
    return promise;
  }

  static async delete(entity) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
      Tb.delete(entity)
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
module.exports = EntityHasStockListController;