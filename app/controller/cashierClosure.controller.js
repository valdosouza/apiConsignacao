const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.cashierclosure;
const CashierController = require("../controller/cashier.controller.js");
const dateFunction = require('../util/dateFunction.js');

class CashierClosureController extends Base {
  static async create(body) {
    const promise = new Promise(async (resolve, reject) => {
      try{
        var idCashier = await CashierController.getLastIdOpen(body.tb_institution_id,body.tb_user_id);
        if (idCashier > 0){
          var dataClosure ={};
          var idCashierClosure = 0;
          for (var item of body.items){
            idCashierClosure += 1;
            dataClosure = {
              id : idCashierClosure,
              tb_institution_id: body.tb_institution_id,              
              terminal: 0,
              tb_cashier_id : idCashier,
              description: item.description,
              kind : item.kind,
              tag_value: item.tag_value,            
            } ;
            await Tb.create(dataClosure);
          }       
          CashierController.close(body.tb_institution_id,idCashier);
          resolve("Fechamento Executado com Sucesso!");      
        }else{
          resolve("Não foi encontrado caixa aberto para este usuário!");
        }
      } catch(err) {            
        reject('CashierClosure.closure: '+err);
      }                        
                     
    });
    return promise;
  }
  
}
module.exports =  CashierClosureController;
