const Base = require('../controller/base.controller.js');
const db = require("../model");
const Tb = db.cashier;
const dateFunction = require('../util/dateFunction.js');

class CashierController extends Base {

  static async getNextId(tb_institution_id) {      
    const promise = new Promise((resolve, reject) => {        
      Tb.sequelize.query(
        'Select max(id) lastId ' +
        'from tb_cashier '+
        'WHERE ( tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {   
          if (data){
            const NextId = data[0].lastId + 1;
            resolve(NextId);
          }else{
            resolve(1);
          }
        })
        .catch(err => {
          reject('cashier.getNexId: '+err);
        });           
    });
    return promise;
  }

  static async getLastIdOpen(tb_institution_id,tb_user_id) { 
    const promise = new Promise((resolve, reject) => {        
      Tb.sequelize.query(
        'Select max(id) lastId ' +
        'from tb_cashier '+
        'WHERE ( tb_institution_id =? ) '+
        ' and (tb_user_id = ?) '+
        ' and (hr_end is null ) ',
        {
          replacements: [tb_institution_id,tb_user_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {   
          if (data){                
            resolve(data[0].lastId);
          }else{
            resolve(0);
          }
        })
        .catch(err => {
          reject('cashier.getLastIdOpen: '+err);
        });           
    });
    return promise;
  }

  static async open(tb_institution_id,tb_user_id) {    
    const promise = new Promise(async (resolve, reject) => {
      try{
        const nextId  = await this.getNextId(tb_institution_id);
        var dtRecord = dateFunction.newDate();
        var hrBegin = dateFunction.getTime();
        
        var dataCashier = {
          id: nextId,
          tb_institution_id: tb_institution_id,
          terminal:0,
          tb_user_id : tb_user_id,
          dt_record : dtRecord,
          hr_begin : hrBegin,
        };
        Tb.create(dataCashier)
        .then((data) => {             
          resolve(data);
        })               
      } catch(err) {            
        reject('Cashier.open: '+err);
      }                        
        
    });
    return promise;
  };

  static async close(tb_institution_id,id) {
    const promise = new Promise(async (resolve, reject) => {
      try{
        var hrEnd = dateFunction.getTime();
        
        var dataCashier = {
          id: id,
          tb_institution_id: tb_institution_id,
          hr_end : hrEnd,
        };
        
        Tb.update(dataCashier,{
          where: {tb_institution_id: dataCashier.tb_institution_id,id:dataCashier.id}
        })
        .then((data) => {             
          resolve(data);
        })               
      } catch(err) {            
        reject('Cashier.close: '+err);
      }                        
                     
    });
    return promise;
  }

  static async getBalance(tb_institution_id,tb_user_id,dt_record) {
    const promise = new Promise(async (resolve, reject) => {
      try{
        Tb.sequelize.query(
        '  select '+
        '  fs.dt_record, '+
        '  pt.description name_payment_type, '+
        '  sum(fs.credit_value - debit_value) balance_value '+
        'From tb_financial_statement fs '+
        '   inner join tb_payment_types pt '+
        '   on (pt.id = fs.tb_payment_types_id) '+
        'where ( fs.tb_institution_id =? ) '+
        'and ( fs.tb_user_id =? ) '+
        'and ( fs.dt_record =? ) '+
        'group by 1,2 ',
        {
          replacements: [tb_institution_id,tb_user_id,dt_record],
          type: Tb.sequelize.QueryTypes.SELECT
        })
        .then(data => {            
          if (data.length > 0) {
            var dataResult = {
              dt_record : data[0].dt_record,   
            }
            var items = [];
            var itemResult = {};
            for (var item of data){
              itemResult = {
                name_payment_type: item.name_payment_type,
                balance_value: item.balance_value
              }
              items.push(itemResult);
            }
            dataResult.items = items;
            resolve(dataResult);
          }else{
            resolve("Nenhum resultado encontrado!");
          }
        })
        
      } catch(err) {            
        reject('CashierClosure.getBalance: '+err);
      }                                             
    });
    return promise;
  }  


}
module.exports =  CashierController;
