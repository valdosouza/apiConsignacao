
const Base = require('./base.controller.js')  
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.restSubgroup;
class RestGroupController extends Base {


  static create = (data) => {
    const promise = new Promise((resolve, reject) => {
      Tb.create(data)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(new Error("RestGrupo - " + err));
        });
    });
    return promise;
  }

  static getList(body) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select rg.id, rg.tb_institution_id, rg.description, rg.link_url '+
        'from tb_rest_group rg '+
        'where (active = "S") ' +
        ' and  ( rg.tb_institution_id =? ) ',
        {
          replacements: [body.tb_institution_id ],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("RestGrupo:" + err));
        });
    });
    return promise;
  }

}

module.exports =  RestGroupController; 