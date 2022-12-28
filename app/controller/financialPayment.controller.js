const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.financialPayment;

class FinancialPaymnetController extends Base {     
   
    static async insert(order) {      
      const promise = new Promise(async (resolve, reject) => {
          Tb.create(order)
            .then((data) => {             
              resolve(data);
            })
            .catch(err => {
              reject("financialPaymnent.insert:"+ err);
            });        
      });
      return promise;        
    }    

    static getList(tb_institution_id) {
        const promise = new Promise((resolve, reject) => {
          Tb.sequelize.query(
            'select  * ' +
            'from tb_financial_payment '+
            'where (tb_institution_id =? ) ',
            {
              replacements: [tb_institution_id],
              type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {
              resolve(data);
            })
            .catch(err => {
              reject("financialPaymnent.getlist: " + err);
            });
        });
        return promise;
    }

    static get(tb_institution_id,tb_order_id,parcel) {
      const promise = new Promise((resolve, reject) => {
        Tb.sequelize.query(
          'select * ' +
          'from tb_financial_payment '+
          'where (tb_institution_id =? ) '+
          ' and (tb_order_id =? )',
          ' and (parcel =? )',
          {
            replacements: [tb_institution_id,tb_order_id,parcel],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            resolve(data);
          })
          .catch(err => {
            reject("financialPayment.get: "+err);
          });
      });
      return promise;
  }

    static async update(order) {        
      const promise = new Promise((resolve, reject) => {        
          Tb.update(order,{
            where: { id: order.id,
                     tb_institution_id: order.tb_institution_id, 
                     terminal:order.terminal }
          })
          .then(data => {
            resolve(data);
          })          
          .catch(err => {
           reject("financialPaymnent.update:"+ err);
          });
        });
      return promise;        
    }        

    static async delete(order) {      
        const promise = new Promise((resolve, reject) => {
          resolve("Em Desenvolvimento");
            /*
            Tb.delete(order)
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
module.exports = FinancialPaymnetController;