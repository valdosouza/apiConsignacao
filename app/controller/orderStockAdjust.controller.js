const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderstockadjust;
const order = require('./order.controller.js');
const orderItem =require('./orderItemStockAdjust.controller.js');
const stockStatement =require('./stockStatement.controller.js');

class OrderStockAdjustController extends Base {     
  static async getNextNumber(tb_institution_id) {      
    const promise = new Promise((resolve, reject) => {        
      Tb.sequelize.query(
        'Select max(number) lastNumber ' +
        'from tb_order_stock_adjust '+
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
          reject('orderStockAdjust.getNexNumber: '+err);
        });           
    });
    return promise;
  }   

  static async insertOrder(body) {      
    const promise = new Promise(async (resolve, reject) => {
      
      if (body.Order.number == 0)
        body.Order.number = await this.getNextNumber(body.Order.tb_institution_id);

      const dataOrder = {
        id : body.Order.id,
        tb_institution_id : body.Order.tb_institution_id,
        terminal : 0,
        number : body.Order.number,
        tb_entity_id : body.Order.tb_entity_id,
        direction : body.Order.direction              
      }
      Tb.create(dataOrder)
      .then(() => {          
        resolve(body);
      })
      .catch(err => {
        reject("orderStockAdjust.insertOrder:"+ err);
      });        
    });
    return promise;        
  }      

  static async insertOrderItem(body) {      
    const promise = new Promise(async (resolve, reject) => {
      try{
        var dataItem = {};        
        for(var item of body.Items) {              
          dataItem = {
            id : 0,
            tb_institution_id: body.Order.tb_institution_id,
            tb_order_id: body.Order.id,
            terminal: 0,
            tb_stock_list_id: item.tb_stock_list_id,
            tb_product_id: item.tb_product_id,
            quantity: item.quantity,
            unit_value: item.unit_value                  
          } ;
          //Quanto o insert ?? mais complexo como getNext precisa do await no loop          
          await orderItem.insert(dataItem);
        };
        resolve("Items Adicionaos");       
      } catch(err) {            
        reject("orderStockAdjust.insertOrderItem:"+ err);
      }          
      
    });
    return promise;        
  }      

  static async insert(body) {      
    const promise = new Promise(async (resolve, reject) => {         
      const dataOrder = {
        id: 0,
        tb_institution_id: body.Order.tb_institution_id,
        terminal:0,
        tb_user_id: body.Order.tb_user_id,
        dt_record: body.Order.dt_record,
        note: body.Order.note
      }
      order.insert(dataOrder)
        .then(async (data)=>{
          body.Order.id = data.id;
          this.insertOrder(body)
          .then(() => {  
            this.insertOrderItem(body)
            .then(() => {          
              resolve(body);
            })                                    
          })            
          .catch(err => {
            reject("orderStockAdjust.insert:"+ err);
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
          '  ora.tb_entity_id,'+
          '  etd.name_company name_entity,'+
          '  ord.dt_record, '+
          '  ora.number, '+
          '  ord.status, '+          
          ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note '+
          'from tb_order ord  '+
          '   inner join tb_order_stock_adjust ora '+
          '   on (ora.id = ord.id)  '+
          '     and (ora.tb_institution_id = ord.tb_institution_id) '+
          '     and (ora.terminal = ord.terminal) '+
          '   inner join tb_entity etd '+
          '   on (etd.id = ora.tb_entity_id)  '+
          'where (ord.tb_institution_id =? ) ', 
            {
              replacements: [tb_institution_id],
              type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {
              resolve(data);
            })
            .catch(err => {
              reject("orderstockadjust.getlist: " + err);
            });
        });
        return promise;
    }

    static getOrder(tb_institution_id,id) {
      const promise = new Promise((resolve, reject) => {
        Tb.sequelize.query(
          '  select '+
          '  ord.id, '+
          '  ord.tb_institution_id, '+
          '  ord.tb_user_id, '+
          '  ora.tb_entity_id,'+
          '  etd.name_company name_entity,'+
          '  ord.dt_record, '+
          '  ora.direction,'+
          '  ora.number, '+
          '  ord.status, '+          
          ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note '+
          'from tb_order ord  '+
          '   inner join tb_order_stock_adjust ora '+
          '   on (ora.id = ord.id)  '+
          '     and (ora.tb_institution_id = ord.tb_institution_id) '+
          '     and (ora.terminal = ord.terminal) '+
          '   inner join tb_entity etd '+
          '   on (etd.id = ora.tb_entity_id)  '+
          'where (ord.tb_institution_id =? ) '+
          ' and (ord.id =? )',
          {
            replacements: [tb_institution_id,id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            resolve(data[0]);
          })
          .catch(err => {
            reject('orderstockadjust.get: '+err);
          });
      });
      return promise;
  }

  static async getStatus(tb_institution_id,id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select '+        
        '  ord.status '+                  
        'from tb_order ord  '+
        '   inner join tb_order_stock_adjust ora '+
        '   on (ora.id = ord.id)  '+
        '     and (ora.tb_institution_id = ord.tb_institution_id) '+
        '     and (ora.terminal = ord.terminal) '+
        '   inner join tb_entity etd '+
        '   on (etd.id = ora.tb_entity_id)  '+
        'where (ord.tb_institution_id =? ) '+
        ' and (ord.id =? )',
        {
          replacements: [tb_institution_id,id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0].status);
        })
        .catch(err => {
          reject('orderstockadjust.getStatus: '+err);
        });
    });
    return promise;
  }

  static get = (tb_institution_id,id) => {
    const promise = new Promise(async (resolve, reject) => {
      try{
        var result = {};
        const dataOrder = await this.getOrder(tb_institution_id,id);
        result.Order = dataOrder;
        const dataItems = await orderItem.getList(tb_institution_id,id);
        result.Items = dataItems;      
        
        resolve(result);
      } 
      catch(err){
        reject('collaborator.get: ' + err);
      } 
    });
    return promise;
  }

  static async updateOrder(body) {      
    const promise = new Promise(async (resolve, reject) => {      
      const dataOrderStockAdjust = {
        id : body.Order.id,        
        tb_institution_id: body.Order.tb_institution_id,
        terminal:0,
        tb_user_id: body.Order.tb_user_id,
        dt_record: body.Order.dt_record,
        note: body.Order.note        
      }
      Tb.update(dataOrderStockAdjust,{
        where: {id: dataOrderStockAdjust.id,              
                tb_institution_id: dataOrderStockAdjust.tb_institution_id, 
                terminal: dataOrderStockAdjust.terminal }
        
      })
      .then(()=>{
        resolve(dataOrderStockAdjust);
      })
      .catch(err => {
        reject("orderStockAdjust.updateOrder:"+ err);
      });        
    });
    return promise;        
  }   

  static async updateOrderItem(body) {      
    const promise = new Promise(async (resolve, reject) => {
      try{
        var dataItem = {};        
        for(var item of body.Items) {              
          dataItem = {
            id : item.id,
            tb_institution_id: body.Order.tb_institution_id,            
            tb_order_id: body.Order.id,
            terminal: 0,
            tb_stock_list_id: item.tb_stock_list_id,
            tb_product_id: item.tb_product_id,
            quantity: item.quantity,
            unit_value: item.unit_value                  
          } ;
          //Quanto o insert ?? mais complexo como getNext precisa do await no loop          
          await orderItem.delete(dataItem);
          await orderItem.insert(dataItem);
s        };
        resolve("Items Alterados");       
      } catch(err) {            
        reject("orderStockAdjust.updateOrderItem:"+ err);
      }          
      
    });
    return promise;        
  }      

  static async update(body) {        
    const promise = new Promise((resolve, reject) => {
      const dataOrder = {
        id: body.Order.id,
        tb_institution_id: body.Order.tb_institution_id,
        terminal:0,
        tb_user_id: body.Order.tb_user_id,
        dt_record: body.Order.dt_record,
        note: body.Order.note
      }
      order.update(dataOrder)
      .then(() => {  
        this.updateOrder(body)
        .then(() => {  
          this.updateOrderItem(body)
          .then(() => {          
            resolve(body);
          }) 
        })               
        resolve(body);
      })
      .catch(err => {
        reject("orderStockAdjust.update:"+ err);
      });        
    });
    return promise;        
  }        

  static async delete(body) {      
      const promise = new Promise((resolve, reject) => {
        resolve("Em Desenvolvimento");
          /*
          Tb.delete(orderstockadjust)
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
  

  static async close(body) {      
    const promise = new Promise(async (resolve, reject) => {
      try {          
        var status = await this.getStatus(body.tb_institution_id,body.id);        
        if (status == 'A'){
          var items = await orderItem.getList(body.tb_institution_id,body.id);          
          var dataItem = {};
          for(var item of items) {              
            dataItem = {
              id : 0,
              tb_institution_id: body.tb_institution_id,
              tb_order_id: body.id,
              terminal: 0,              
              tb_order_item_id: item.id,
              tb_stock_list_id: item.tb_stock_list_id,
              local: "web",
              kind: "Fechamento",
              dt_record: body.dt_record,
              direction: body.direction,
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "Ajuste"
            } ;
            //Quanto o insert ?? mais complexo como create precisa do await no loop          
            await stockStatement.insert(dataItem);            
          };          
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
        var status = await this.getStatus(body.tb_institution_id,body.id);        
        if (status == 'F'){
          var items = await orderItem.getList(body.tb_institution_id,body.id);          
          var direction = 'S';
          if (body.direction == 'S'){
            direction = 'E'} 
          else { 
            direction = 'E'};
          var dataItem = {};
          for(var item of items) {              
            dataItem = {
              id : 0,
              tb_institution_id: body.tb_institution_id,
              tb_order_id: body.id,
              terminal: 0,              
              tb_order_item_id: item.id,
              tb_stock_list_id: item.tb_stock_list_id,
              local: "web",
              kind: "Reabertura",
              dt_record: body.dt_record,
              direction: direction,
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "Ajuste"
            } ;
            //Quanto o insert ?? mais complexo como create precisa do await no loop          
            await stockStatement.insert(dataItem);            
          };          
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
module.exports = OrderStockAdjustController;