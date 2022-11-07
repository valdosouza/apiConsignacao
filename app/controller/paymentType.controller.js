const Base = require('../controller/base.controller.js');
const ihPaymentType = require('../controller/institutionHasPaymentType.controller.js');
const db = require("../model");
const Tb = db.paymentTypes;

class PaymentTypeController extends Base {
 
    
    static async getbyDescription (descripton) {
      
      const promise = new Promise((resolve, reject) => {        
        Tb.sequelize.query(
          'Select id ' +
          'from tb_payment_types '+
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
    
    static async insert(paymentType) {
      
      const promise = new Promise(async (resolve, reject) => {
        const exist  = await this.getbyDescription(paymentType.description);   
        
        if (exist === '0'){        
          //Se não encontrou grava a Forma de pagamento
          Tb.create(paymentType)
            .then((data) => {
              //com este retorno gravo a forma de pagamento no Institution
              const dataihpayment = {
                 tb_institution_id: paymentType.tb_institution_id,
                 tb_payment_types_id: data.id,
                 active: paymentType.active,
              };               
              ihPaymentType.insert (dataihpayment)
              .then((_) =>{
                paymentType.id = data.id;
                resolve(paymentType);
              });              
            })
            .catch(err => {
              reject("Erro:"+ err);
            });
        }else{
          //Se a forma de pagamento já existe fazer outro tratamento
          //Finalizado 20/10/2022
          resolve(paymentType);
        }
      });
      return promise;        
    }    

    static getList(institutionId) {
        const promise = new Promise((resolve, reject) => {
          Tb.sequelize.query(
            'select  pt.id, ihp.tb_institution_id, pt.description, ihp.active ' +
            'from tb_payment_types pt '+
            '  inner join tb_institution_has_payment_types ihp '+
            '  on (pt.id = ihp.tb_payment_types_id) '+
            'where (ihp.tb_institution_id =? ) ',
            {
              replacements: [institutionId],
              type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {
              resolve(data);
            })
            .catch(err => {
              reject(new Error("PaymentType:" + err));
            });
        });
        return promise;
    }

    static get(institutionId,id) {
      const promise = new Promise((resolve, reject) => {
        Tb.sequelize.query(
          'select  pt.id, ihp.tb_institution_id, pt.description, ihp.active ' +
          'from tb_payment_types pt '+
          '  inner join tb_institution_has_payment_types ihp '+
          '  on (pt.id = ihp.tb_payment_types_id) '+
          'where (ihp.tb_institution_id =? ) '+
          ' and (ihp.tb_payment_types_id =? )',
          {
            replacements: [institutionId,id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            resolve(data[0]);
          })
          .catch(err => {
            reject(new Error("PaymentType:" + err));
          });
      });
      return promise;
  }

    static async update(paymentType) {        
      const promise = new Promise((resolve, reject) => {
        const dataPaymentType ={
          id: paymentType.id,
          description:paymentType.description,
        }
        Tb.update(dataPaymentType,{
          where: { id: paymentType.id }
        })        
        .then(() => {
          const dataIhp = {
            tb_institution_id: paymentType.tb_institution_id,
            tb_payment_types_id : paymentType.id,
            active : paymentType.active
          }
          ihPaymentType.update(dataIhp);
          resolve(paymentType);
        })
        .catch(err => {
          reject("Erro:"+ err);
        });
      });
      return promise;        
    }        

    static async delete(paymentType) {      
        const promise = new Promise((resolve, reject) => {
          resolve("Em Desenvolvimento");
            /*
            Tb.delete(paymentType)
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
module.exports = PaymentTypeController;