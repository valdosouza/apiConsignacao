const Base = require('./base.controller.js')
const db = require("../model");
const Tb = db.institutionHasPaymentType;

class InstitutionHasPaymentTypeController extends Base {
    
    static async insert(ihPaymentType) {
        
        const promise = new Promise((resolve, reject) => {            
            Tb.create(ihPaymentType)
                .then((data) => {
                    resolve(data);
                })
                .catch(err => {
                    reject("Erro:"+ err);
                });
        });
        return promise;        
    }    

    static async update(ihPaymentType) {        
      const promise = new Promise((resolve, reject) => {
        Tb.update(ihPaymentType,{
            where: { tb_institution_id: ihPaymentType.tb_institution_id,
                tb_payment_types_id : ihPaymentType.tb_payment_types_id }
          })
        .catch(err => {
          reject("Erro:"+ err);
        });
      });
      return promise;        
    }        

    static async delete(ihPaymentType) {              
        const promise = new Promise((resolve, reject) => {
            resolve("Em Desenvolvimento");
            /*    
            Tb.delete(ihPaymentType)
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
module.exports = InstitutionHasPaymentTypeController;