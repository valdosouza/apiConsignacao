
const Base = require('./base.controller.js')  
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.restSubgroup;
class RestSubGroupController extends Base {


  static create = (data) => {
    const promise = new Promise((resolve, reject) => {
      Tb.create(data)
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(new Error("RestSubGrupo - " + error));
        });
    });
    return promise;
  }

  static getList(body) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
          'select DISTINCT  rs.id, rs.tb_institution_id, rs.tb_rest_group_id, rs.description, rs.link_url  '+
          'from tb_rest_subgroup rs   '+
          '  INNER JOIN tb_rest_group rg  '+
          '  on (rg.id = rs.tb_rest_group_id)  '+
          '  and (rg.tb_institution_id = rs.tb_institution_id)  '+
          'where ( rs.active ="S" ) '+
          ' and rs.link_url is not null  '+
          ' and ( rs.tb_institution_id =? )  '+
          'and ( rg.description =? )   ',
        {
          replacements: [body.tb_institution_id,body.group_desc ],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(new Error("RestSubGRupo:" + error));
        });
    });
    return promise;
  }

}

module.exports =  RestSubGroupController; 