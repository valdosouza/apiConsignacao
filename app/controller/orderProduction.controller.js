const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderproduction;
const order = require('./order.controller.js');
const stockStatement =require('./stockStatement.controller.js');

class OrderProductionController extends Base {     
  static async getNextNumber(tb_institution_id) {      
    const promise = new Promise((resolve, reject) => {        
      Tb.sequelize.query(
        'Select max(number) lastNumber ' +
        'from tb_order_production '+
        'WHERE ( tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {             
          if (data){
            const nextNumber = data[0].lastNumber + 1;
            resolve(nextNumber);
          }else{
            resolve(1);
          }
        })
        .catch(err => {
          reject('order.getNexNumber: '+err);
        });           
    });
    return promise;
  }   
    static async insert(orderproduction) {      
      const promise = new Promise(async (resolve, reject) => {
          const dataOrder = {
            id: 0,
            tb_institution_id: orderproduction.tb_institution_id,
            terminal:0,
            tb_user_id: orderproduction.tb_user_id,
            dt_record: orderproduction.dt_record,
            note: orderproduction.note
          }
          order.insert(dataOrder)
          .then(async (data)=>{
            var nextNumber = 0;
            if (orderproduction.number == 0)
              nextNumber = await this.getNextNumber(orderproduction.tb_institution_id)
            else  
              nextNumber = orderproduction.number;            
            const dataOrderProduction = {
              id : data.id,
              tb_institution_id : data.tb_institution_id,
              terminal : 0,
              number : nextNumber,
              tb_merchandise_id : orderproduction.tb_merchandise_id,              
              qtty_forecast : orderproduction.qtty_forecast,
              tb_stock_list_id_ori: 0,
              tb_stock_list_id_des : orderproduction.tb_stock_list_id_des
            }
            Tb.create(dataOrderProduction)
            .then((data) => {  
              orderproduction.id = data.id;
              orderproduction.number = nextNumber;           
              resolve(orderproduction);
            })
            .catch(err => {
              reject("orderProduction.insert:"+ err);
            });        
          })
      });
      return promise;        
    }    

    static getList(tb_institution_id) {
        const promise = new Promise((resolve, reject) => {
          Tb.sequelize.query(
          '  select '+
          '  ord.id, '+
          '  ord.tb_institution_id, '+
          '  ord.tb_user_id, '+
          '  ord.dt_record, '+
          '  orp.number, '+
          '  ord.status, '+
          '  orp.tb_merchandise_id, '+
          '  prd.description name_merchandise, '+
          '  orp.qtty_forecast, '+
          '  orp.tb_stock_list_id_des, '+
          '  stkd.description name_stock_list_des, '+
          ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note '+
          'from tb_order ord  '+
          '   inner join tb_order_production orp '+
          '   on (orp.id = ord.id)  '+
          '     and (orp.tb_institution_id = ord.tb_institution_id) '+
          '     and (orp.terminal = ord.terminal) '+
          '   inner join tb_product prd '+
          '   on (prd.id = orp.tb_merchandise_id) '+
          '     and (prd.tb_institution_id = prd.tb_institution_id) '+
          '   inner join tb_stock_list stkd '+
          '   on (stkd.id = orp.tb_stock_list_id_des)  '+
          '     and (stkd.tb_institution_id = orp.tb_institution_id) '+
          'where (ord.tb_institution_id =? ) ', 
            {
              replacements: [tb_institution_id],
              type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {
              resolve(data);
            })
            .catch(err => {
              reject("orderproduction.getlist: " + err);
            });
        });
        return promise;
    }

    static get(tb_institution_id,id) {
      const promise = new Promise((resolve, reject) => {
        Tb.sequelize.query(
          '  select '+
          '  ord.id, '+
          '  ord.tb_institution_id, '+
          '  ord.tb_user_id, '+
          '  ord.dt_record, '+
          '  orp.number, '+
          '  ord.status, '+
          '  orp.tb_merchandise_id, '+
          '  prd.description name_merchandise, '+
          '  orp.qtty_forecast, '+
          '  orp.tb_stock_list_id_des, '+
          '  stkd.description name_stock_list_des, '+
          ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note '+
          'from tb_order ord  '+
          '   inner join tb_order_production orp '+
          '   on (orp.id = ord.id)  '+
          '     and (orp.tb_institution_id = ord.tb_institution_id) '+
          '     and (orp.terminal = ord.terminal) '+
          '   inner join tb_product prd '+
          '   on (prd.id = orp.tb_merchandise_id) '+
          '     and (prd.tb_institution_id = prd.tb_institution_id) '+
          '   inner join tb_stock_list stkd '+
          '   on (stkd.id = orp.tb_stock_list_id_des)  '+
          '     and (stkd.tb_institution_id = orp.tb_institution_id) '+
          'where (ord.tb_institution_id =? ) '+
          ' and (ord.id =? )',
          {
            replacements: [tb_institution_id,id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            resolve(data[0]);
          })
          .catch(err => {
            reject('orderproduction.get: '+err);
          });
      });
      return promise;
  }

  static async update(orderproduction) {        
    const promise = new Promise((resolve, reject) => {
      const dataOrder = {
        id: orderproduction.id,
        tb_institution_id: orderproduction.tb_institution_id,
        terminal:0,
        tb_user_id: orderproduction.tb_user_id,
        dt_record: orderproduction.dt_record,
        note: orderproduction.note
      }
      order.update(dataOrder);        
      const dataOrderProduction = {
        id : orderproduction.id,
        tb_institution_id : orderproduction.tb_institution_id,
        terminal : 0,
        number : orderproduction.number,
        tb_merchandise_id : orderproduction.tb_merchandise_id,        
        qtty_forecast : orderproduction.qtty_forecast,
        tb_stock_list_id_ori: 0,
        tb_stock_list_id_des : orderproduction.tb_stock_list_id_des
      }
      Tb.update(dataOrderProduction,{
        where: { id: dataOrderProduction.id,tb_institution_id: dataOrderProduction.tb_institution_id, terminal: dataOrderProduction.terminal }
      })
      .then((data) => {  
        resolve(orderproduction);
      })
      .catch(err => {
        reject("orderProduction.insert:"+ err);
      });        
    });
    return promise;        
  }        

  static async delete(orderproduction) {      
      const promise = new Promise((resolve, reject) => {
        resolve("Em Desenvolvimento");
          /*
          Tb.delete(orderproduction)
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
  
  static async closure(body) {      
    const promise = new Promise(async (resolve, reject) => {
      try {          
        var dataOrder = await this.get(body.tb_institution_id,body.id);        
        if (dataOrder.status == 'A'){          
          var dataItem =  {
            id : 0,
            tb_institution_id: body.tb_institution_id,
            tb_order_id: body.id,
            terminal: 0,              
            tb_order_item_id: 0,
            tb_stock_list_id: dataOrder.tb_stock_list_id_des,
            local: "web",
            kind: "Fechamento",
            dt_record: body.dt_record,
            direction: body.direction,
            tb_merchandise_id: dataOrder.tb_merchandise_id,
            quantity: dataOrder.qtty_forecast,
            operation: "Produção"
          } ;
          //Quanto o insert é mais complexo como create precisa do await no loop          
          await stockStatement.insert(dataItem);            
          await order.updateStatus(body.tb_institution_id,body.id,'F');      
          resolve("200");  
        }else{
          resolve("201");  
        }        
      } catch (err) {
        reject(err);
      }                
    });
    return promise;        
  }   

  static async reopen(body) {      
    const promise = new Promise(async (resolve, reject) => {
      try {          
        var dataOrder = await this.get(body.tb_institution_id,body.id);        
        if (dataOrder.status == 'F'){          
          var dataItem =  {
            id : 0,
            tb_institution_id: body.tb_institution_id,
            tb_order_id: body.id,
            terminal: 0,              
            tb_order_item_id: 0,
            tb_stock_list_id: dataOrder.tb_stock_list_id_des,
            local: "web",
            kind: "Fechamento",
            dt_record: body.dt_record,
            direction: "S",
            tb_merchandise_id: dataOrder.tb_merchandise_id,
            quantity: dataOrder.qtty_forecast,
            operation: "Produção"
          } ;          
          await stockStatement.insert(dataItem);            
          await order.updateStatus(body.tb_institution_id,body.id,'A');      
          resolve("200");  
        }else{
          resolve("201");  
        }        
      } catch (err) {
        reject(err);
      }                                
    });
    return promise;        
  }           
}
module.exports = OrderProductionController;