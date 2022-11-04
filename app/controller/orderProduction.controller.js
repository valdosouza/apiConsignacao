const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderproduction;
const order = require('./order.controller.js');

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
            note: orderproduction.note,
            status: orderproduction.status
          }
          order.insert(dataOrder)
          .then(async (data)=>{
            var nextNumber = 0;
            if (orderproduction.number == 0)
              nextNumber = await this.getNextNumber(orderproduction.tb_institution_id)
            else  
              nextNumber = orderproduction.number;
            var situationId = 0;
            if (order.status = 'A'){ situationId = 1} else{  situationId = 2};
            const dataOrderProduction = {
              id : data.id,
              tb_institution_id : data.tb_institution_id,
              terminal : 0,
              number : nextNumber,
              tb_merchandise_id : orderproduction.tb_merchandise_id,
              tb_situation_id : situationId,
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
          note: orderproduction.note,
          status: orderproduction.status
        }
        order.update(dataOrder);
        var situationId = 0;
        if (order.status = 'A'){ situationId = 1} else{  situationId = 2};
        const dataOrderProduction = {
          id : orderproduction.id,
          tb_institution_id : orderproduction.tb_institution_id,
          terminal : 0,
          number : orderproduction.number,
          tb_merchandise_id : orderproduction.tb_merchandise_id,
          tb_situation_id : situationId,
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
    
}
module.exports = OrderProductionController;