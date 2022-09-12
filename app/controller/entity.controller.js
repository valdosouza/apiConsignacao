const moment = require('moment');
const Base = require('../controller/base.controller.js')
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.entity;

class EntityController extends Base {

    static async getIdNext() {
        const promise = new Promise((resolve, reject) => {
            Tb.sequelize.query(
                'Select max(id) maxID ' +
                'from tb_entity ' ,
                {                    
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

    static async insert(entity) {
        
        const idSeq = await this.getIdNext();        
        entity.id = idSeq;     
        
        const promise = new Promise((resolve, reject) => {
            Tb.create(entity)
                .then((data) => {
                    resolve(data);
                })
                .catch(err => {
                    reject("Erro:"+ err);
                });
        });
        return promise;
        
    }    

    static getList(body) {
        const promise = new Promise((resolve, reject) => {
          Tb.sequelize.query(
            'select  * ' +
            'from tb_entity '+
            'where id is not null',
            {
              //replacements: [body.tb_institution_id ],
              type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {
              resolve(data);
            })
            .catch(err => {
              reject(new Error("Entity:" + err));
            });
        });
        return promise;
      }    
}
module.exports = EntityController;