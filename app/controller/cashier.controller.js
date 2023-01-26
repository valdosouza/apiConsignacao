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

  static async autoCreate(tb_institution_id,tb_user_id) { 
    const promise = new Promise(async (resolve, reject) => {        
      
      var checkExist = await this.getLastIdOpen(tb_institution_id, tb_user_id);
            if (!checkExist) {
        try {
          await this.open(tb_institution_id,tb_user_id);
          resolve("Caixa foi aberto");
        } catch (err) {
          reject("Erro:" + err);
        }
      }
      else{
        resolve("Caixa já estava aberto");
      }         
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

  static async closure(tb_institution_id,id) {
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
        reject('Cashier.closure: '+err);
      }                        
                     
    });
    return promise;
  }



}
module.exports =  CashierController;
