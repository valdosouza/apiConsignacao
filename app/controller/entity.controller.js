const Base = require('../controller/base.controller.js')
const db = require("../model");
const Tb = db.entity;

class EntityController extends Base {

  static async getById(id) {    
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select '+
        'e.id,  '+
        'e.name_company,  '+
        'e.nick_trade,  '+
        'e.aniversary,  '+
        'e.tb_linebusiness_id,  '+
        'l.description name_linebusiness, '+
        'CAST(e.note AS CHAR(1000) CHARACTER SET utf8) note, '+
        'e.createdAt,  '+
        'e.updatedAt  '+
        'from tb_entity  e '+
        '   left outer join tb_linebusiness l '+
        '   on (l.id = e.tb_linebusiness_id) '+
        'where ( e.id =?) ', 
        {
          replacements: [id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0)          
          resolve(data[0])
        else
          resolve(data);
        })
        .catch(err => {
          reject('Entity.getById: ' + err);
        });
      });
      return promise;
    };

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
        const promise = new Promise((resolve, reject) => {            
            delete entity.name_linebusiness;
            if (entity.aniversary == '')
                delete entity.aniversary;
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

    static async update(entity) {        
      const promise = new Promise((resolve, reject) => {
        delete entity.name_linebusiness;        
        if (entity.aniversary == '')   delete entity.aniversary;
        Tb.update(entity,{
          where: { id: entity.id }
        })
        .then(data =>{
          resolve(data);
        })
        .catch(err => {
          reject("Erro:"+ err);
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
module.exports = EntityController;