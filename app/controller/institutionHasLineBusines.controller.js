const Base = require('./base.controller.js')
const db = require("../model");
const Tb = db.institutionHasLineBusiness;

class InstitutionHasLineBusinesController extends Base {
    
    static async insert(ihLineBusiness) {
        
        const promise = new Promise((resolve, reject) => {
            
            Tb.create(ihLineBusiness)
                .then((data) => {
                    resolve(data);
                })
                .catch(err => {
                    reject("Erro:"+ err);
                });
        });
        return promise;        
    }    

    static async update(ihLineBusiness) {        
      const promise = new Promise((resolve, reject) => {
        Tb.update(ihLineBusiness,{
            where: { tb_institution_id: ihLineBusiness.tb_institution_id,
                     tb_linebusiness_id: ihLineBusiness.tb_linebusiness_id}
        })
        .then((data)=>{
            resolve(data);
        })
        .catch(err => {
          reject("Erro:"+ err);
        });
      });
      return promise;        
    }        

    static async delete(ihLineBusiness) {              
        const promise = new Promise((resolve, reject) => {
            resolve("Em Desenvolvimento");
            /*    
            Tb.delete(ihLineBusiness)
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
module.exports = InstitutionHasLineBusinesController;