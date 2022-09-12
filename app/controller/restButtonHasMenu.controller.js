const Base = require('./base.controller.js')  
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.restButtonHasMenu;
class RestButtonHasMenuController extends Base {


  static create = (data) => {
    const promise = new Promise((resolve, reject) => {
      Tb.create(data)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(new Error("RestButtonHasMenu - " + err));
        });
    });
    return promise;
  }

  static update = (data) => {
    const promise = new Promise((resolve, reject) => {
      Tb.update(req.body, {
        where: { id: data.id }
      })
        .then(num => {
          if (num == 1) {
            resolve("RestButtonHasMenu foi atualizada com sucesso.");
          } else {
            resolve("Nao foi possivel atualizar com id=${id}. Talvez RestButtonHasMenu não foi encontrada ou req.body está vazio!");
          }
        })
        .catch(err => {
          reject(new Error("RestSubGrupo - " + err));
        });
    });
  }

  static getList(body) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select r.* ' +
        'from  tb_rest_subgroup r ' +
        'where (r.tb_institution_id =?) '+
        ' and (r.tb_rest_group_id =? )',
        {
          replacements: [body.tb_institution_id,body.tb_rest_group_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("RestSubGRupo:" + err));
        });
    });
    return promise;
  }
}

module.exports =  RestButtonHasMenuController; 