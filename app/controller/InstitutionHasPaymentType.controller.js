const Base = require('./base.controller.js')
const db = require("../model");
const Tb = db.institutionHasPaymentType;

class InstitutionHasPaymentTypeController extends Base {
    
    static async insert(ihPaymentType) {
        
        const promise = new Promise((resolve, reject) => {
            console.log(ihPaymentType);
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
        Tb.update(ihPaymentType)
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