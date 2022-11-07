const Base = require('./base.controller.js');
const ihLineBusiness = require('./institutionHasLineBusines.controller.js');
const db = require("../model");
const Tb = db.lineBusiness;

class LineBusinessController extends Base {     
    static async getbyDescription (descripton) {      
      const promise = new Promise((resolve, reject) => {        
        Tb.sequelize.query(
          'Select id ' +
          'from tb_linebusiness '+
          'WHERE ( description =? ) ',
          {
            replacements: [descripton],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {    
            if (data[0] != null)
            resolve(data);
          else
            resolve('0');
          })
          .catch(err => {
            reject(new Error(err));
          });           
      });
      return promise;
    }
    
    static async insert(lineBusiness) {
      
      const promise = new Promise(async (resolve, reject) => {
        const exist  = await this.getbyDescription(lineBusiness.description);   
        
        if (exist === '0'){        
          //Se não encontrou grava o Cargo
          
          Tb.create(lineBusiness)
            .then((data) => {
              //com este retorno gravo a Cargo no Institution
              const dataihlineBusiness = {
                 tb_institution_id: lineBusiness.tb_institution_id,
                 tb_linebusiness_id: data.id,
                 active: lineBusiness.active,
              };               
              ihLineBusiness.insert (dataihlineBusiness)
              .then((_) =>{
                lineBusiness.id = data.id;
                resolve(lineBusiness);
              });              
            })
            .catch(err => {
              reject("Erro:"+ err);
            });
        }else{
          //Se o Cargo já existe fazer outro tratamento
          //Finalizado 20/10/2022
          resolve(lineBusiness);
        }
      });
      return promise;        
    }    

    static getList(institutionId) {
        const promise = new Promise((resolve, reject) => {
          Tb.sequelize.query(
            'select  lb.id, ihl.tb_institution_id, lb.description, ihl.active ' +
            'from tb_linebusiness lb '+
            '  inner join tb_institution_has_linebusiness ihl '+
            '  on (lb.id = ihl.tb_linebusiness_id) '+
            'where (ihl.tb_institution_id =? ) ',
            {
              replacements: [institutionId],
              type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {
              resolve(data);
            })
            .catch(err => {
              reject(new Error("LineBusiness:" + err));
            });
        });
        return promise;
    }

    static get(institutionId,id) {
      const promise = new Promise((resolve, reject) => {
        Tb.sequelize.query(
          'select  lb.id, ihl.tb_institution_id, lb.description, ihl.active ' +
          'from tb_linebusiness lb '+
          '  inner join tb_institution_has_linebusiness ihl '+
          '  on (lb.id = ihl.tb_linebusiness_id) '+
          'where (ihl.tb_institution_id =? ) '+
          ' and (ihl.tb_linebusiness_id =? )',
          {
            replacements: [institutionId,id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            resolve(data[0]);
          })
          .catch(err => {
            reject(new Error("LineBusiness:" + err));
          });
      });
      return promise;
  }

    static async update(lineBusiness) {        
      const promise = new Promise((resolve, reject) => {
        Tb.update(lineBusiness,{
          where: { id: lineBusiness.id }
        })
        .then(data => {
          const dataihlineBusiness = {
            tb_institution_id: lineBusiness.tb_institution_id,
            tb_linebusiness_id: lineBusiness.id,
            active: lineBusiness.active,
         };              
          ihLineBusiness.update (dataihlineBusiness)
          .then((_) =>{
            lineBusiness.id = data.id;
            resolve(lineBusiness);
          });      


          resolve(data);
        })        
        .catch(err => {
          reject("Erro:"+ err);
        });
      });
      return promise;        
    }        

    static async delete(lineBusiness) {      
        const promise = new Promise((resolve, reject) => {
          resolve("Em Desenvolvimento");
            /*
            Tb.delete(lineBusiness)
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
module.exports = LineBusinessController;