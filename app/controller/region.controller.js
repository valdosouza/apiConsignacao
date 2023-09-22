const Base = require('./base.controller.js');
const db = require("../model/index.js");
const Tb = db.region;


class RegionController extends Base {
  
  static async insert(region) {
    const promise = new Promise(async (resolve, reject) => {

      Tb.create(region)
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("region.insert:" + err);
        });
    });
    return promise;
  }

  static getList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  rg.id, ' +
        'rg.tb_institution_id,'+
        ' rg.description, '+
        ' rg.tb_salesman_id,'+
        ' et.nick_trade salesman_name,'+
        ' rg.active '+
        'from tb_region rg ' +
        '  inner join tb_entity et '+
        '  on (et.id = rg.tb_salesman_id) '+
        'where (rg.tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("region.getlist: " + err);
        });
    });
    return promise;
  }

  static getListBySalesman(tb_institution_id,tb_salesman_id) {
    const promise = new Promise((resolve, reject) => {
      var sqlTxt = 
      'select '+
      ' rg.id, ' +
      ' rg.tb_institution_id,'+
      ' rg.description, '+
      ' rg.tb_salesman_id,'+
      ' et.nick_trade salesman_name,'+
      ' rg.active '+
      'from tb_region rg ' +
      '  inner join tb_entity et '+
      '  on (et.id = rg.tb_salesman_id) '+
      'where (rg.tb_institution_id =? ) ';
      if (tb_salesman_id > 0){
        sqlTxt += ' and ( rg.tb_salesman_id =? )';
      }else{
        sqlTxt += ' and ( rg.tb_salesman_id <> ? )';        
      }
      
      Tb.sequelize.query(
         sqlTxt, 
        {
          replacements: [tb_institution_id,tb_salesman_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("region.getlisBySalesman: " + err);
        });
    });
    return promise;
  }

  static get(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select * ' +
        'from tb_region pl ' +
        'where (pl.tb_institution_id =? ) ' +
        ' and (pl.id =? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject('region.get: ' + err);
        });
    });
    return promise;
  }

  static async update(region) {
    const promise = new Promise((resolve, reject) => {
      if (region.validity == '') delete region.validity;
      Tb.update(region, {
        where: { id: region.id, 
                tb_institution_id: region.tb_institution_id }
      })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("region.update:" + err);
        });
    });
    return promise;
  }
 
  
  static async delete(region) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
      Tb.delete(region)
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
module.exports = RegionController;