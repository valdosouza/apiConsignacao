const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderconsignment;
const order = require('./order.controller.js');
const consignmentItem =require('./orderConsignmentItem.controller.js');
const consignementPaid =require('./orderConsignmentPaid.controller.js');
const { entity } = require('../model');
const enityController = require('./entity.controller.js');
const EntityController = require('./entity.controller.js');

class OrderConsignmentController extends Base {     
  static async getById(id,tb_institution_id) {    
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * '+        
        'from tb_order_consignment '+
        'where ( id =?) '+
        ' and (tb_institution_id =?)', 
        {
          replacements: [id,tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
            resolve(data);
        })
        .catch(err => {
          reject('getById: ' + err);
        });
    });
    return promise;
  };

  static async saveCheckpoint(body) {
    const promise = new Promise(async (resolve, reject) => {
      try{                    
        var dataOrder  = {
          id:body.Order.id,
          tb_institution_id:body.Order.tb_institution_id,
          terminal:0,
          tb_customer_id:body.Order.tb_customer_id,   
          dt_record: body.Order.dt_record,                 
          kind: "checkpoint",          
          number:0,
          total_value:body.Order.total_value,
          change_value:body.Order.change_value,
          previous_debit_balance:body.Order.previous_debit_balance,
          current_debit_balance:body.Order.current_debit_balance,
        };                   

        this.insert(dataOrder)
        .then(async () => {
          await this.insertCheckpointItems(body);
          await this.insertCheckpointPaid(body);            
          resolve(body);
        })
      } catch(err) {            
        reject('OrderConsignmentController.saveCheckpoint: '+err);
      }                  
    });
    return promise;
  }

  static async saveSupplying(body) {
    const promise = new Promise(async (resolve, reject) => {
      try{                
        var dataOrder  = {
          id:body.Order.id,
          tb_institution_id:body.Order.tb_institution_id,
          terminal:0,
          tb_customer_id:body.Order.tb_customer_id,   
          dt_record: body.Order.dt_record,                 
          kind: "supplying",          
          number:0,
          current_debit_balance:body.Order.current_debit_balance,
        };     
        this.insert(dataOrder)
        .then(async () => {
          await this.insertSupplyngItems(body);            
        })
        resolve(body);
      } catch(err) {            
        reject('OrderConsignmentController.saveSupplying: '+err);
      }                  
    });
    return promise;
  }

  static async insert(data) {      
    const promise = new Promise(async (resolve, reject) => {         
      if (data.number == 0)
        data.number = await this.getNextNumber(data.tb_institution_id);
      Tb.create(data)
        .then((data)=>{
          resolve(data);
        })                                              
        .catch(err => {
          reject("OrderConsignmentController.insert:"+ err);        
        })

    });
    return promise;        
  }    

  static async insertCheckpointItems(body) {      
    const promise = new Promise(async (resolve, reject) => {
      try{
        var dataItem = {};        
        for(var item of body.Items) {              
          dataItem = {
            id : body.Order.id,
            tb_institution_id: body.Order.tb_institution_id,            
            terminal: 0,
            tb_product_id : item.tb_product_id,
            kind : 'checkpoint',
            bonus : item.bonus,
            qty_consigned : item.qty_consigned,
            leftover : item.leftover,
            qty_sold : item.qty_sold,
            unit_value : item.unit_value
           
          };          
          //Quanto o insert é mais complexo como getNext precisa do await no loop          
          await consignmentItem.insert(dataItem);
        };
        resolve("Items Adicionaos");       
      } catch(err) {            
        reject("OrderConsignmentController.insertCheckpointItems:"+ err);
      }          
      
    });
    return promise;        
  }     

  static async insertSupplyngItems(body) {      
    const promise = new Promise(async (resolve, reject) => {
      try{
        var dataItem = {};        
        for(var item of body.Items) {              
          dataItem = {
            id : body.Order.id,
            tb_institution_id: body.Order.tb_institution_id,            
            terminal: 0,
            tb_product_id : item.tb_product_id,
            bonus : item.bonus,
            kind : 'supplying',
            leftover : item.leftover,
            devolution: item.devolution,
            new_consignment: item.new_consignment,
            qty_consigned: item.qty_consigned, 
            unit_value : item.unit_value,
          };    
          //Quanto o insert é mais complexo como getNext precisa do await no loop          
          await consignmentItem.insert(dataItem);
        };
        resolve("Items Adicionaos");       
      } catch(err) {            
        reject("OrderConsignmentController.insertSupplyngItems:"+ err);
      }          
      
    });
    return promise;        
  }     

  static async insertCheckpointPaid(body) {      
    const promise = new Promise(async (resolve, reject) => {
      try{
        var dataPayment = {};        
        for(var item of body.Payments) {              
          dataPayment = {
            id : body.Order.id,
            tb_institution_id: body.Order.tb_institution_id,            
            terminal: 0,
            tb_payment_type_id : item.tb_payment_type_id,
            value : item.value
           
          } ;
          //Quanto o insert é mais complexo como getNext precisa do await no loop          
          await consignementPaid.insert(dataPayment);
        };
        resolve("Pagamentos Adicionaos");       
      } catch(err) {            
        reject("OrderConsignmentController.insertCheckpointPaid:"+ err);
      }          
      
    });
    return promise;        
  }     


  static async getNextNumber(tb_institution_id) {      
    const promise = new Promise((resolve, reject) => {        
      Tb.sequelize.query(
        'Select max(number) lastNumber ' +
        'from tb_order_consignment '+
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
          reject('orderConsignment.getNexNumber: '+err);
        });           
    });
    return promise;
  }   

  static async insertOrderPaid(body) {      
    const promise = new Promise(async (resolve, reject) => {
      
      if (body.Order.number == 0)
        body.Order.number = await this.getNextNumber(body.Order.tb_institution_id);

      const dataOrder = {
        id : body.Order.id,
        tb_institution_id : body.Order.tb_institution_id,
        terminal : 0,
        number : body.Order.number,
        tb_customer_id : body.Order.tb_customer_id,
        total_value : body.Order.total_value,
        change_value : body.Order.change_value,
        debit_balance : body.Order.debit_balance
      }
      Tb.create(dataOrder)
      .then(() => {          
        resolve(body);
      })
      .catch(err => {
        reject("orderConsignment.insertOrderPaid:"+ err);
      });        
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
          '  orc.tb_customer_id,'+
          '  etd.name_company name_entity,'+
          '  ord.dt_record, '+
          '  orc.number, '+
          '  ord.status, '+          
          ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note '+
          'from tb_order ord  '+
          '   inner join tb_order_consignment ora '+
          '   on (orc.id = ord.id)  '+
          '     and (orc.tb_institution_id = ord.tb_institution_id) '+
          '     and (orc.terminal = ord.terminal) '+
          '   inner join tb_entity etd '+
          '   on (etd.id = orc.tb_customer_id)  '+
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
            'select '+
            'ord.id,  '+
            'ord.tb_institution_id,  '+
            'ord.tb_user_id,  '+
            'orc.tb_customer_id, '+
            'etd.name_company name_customer, '+
            'orc.dt_record,'+
            'orc.total_value,'+
            'orc.change_value,'+            
            'orc.debit_balance,'+            
            'ord.dt_record,  '+
            'orc.number,  '+
            'ord.status, '+
            'CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note  '+
            'from tb_order ord '+
            '   inner join tb_order_consignment orc '+
            '   on (orc.id = ord.id) '+
            '     and (orc.tb_institution_id = ord.tb_institution_id) '+
            '     and (orc.terminal = ord.terminal)  '+
            '   inner join tb_entity etd '+
            '   on (etd.id = orc.tb_customer_id) '+
            'where (ord.tb_institution_id =? ) '+
            ' and (ord.id =? )',
            {
            replacements: [tb_institution_id,id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {  
            if (data.length > 0)          
              resolve(data[0])
            else
              resolve(data);
          })
          .catch(err => {
            reject('orderstockadjust.get: '+err);
          });
      });
      return promise;
  }

  static getLastOrderByCustomer(tb_institution_id,tb_customer_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select '+
        'ord.id, '+
        'ord.tb_institution_id, '+
        'ord.tb_user_id, '+
        'orc.tb_customer_id, '+
        'etd.name_company name_customer, '+
        'orc.total_value, '+
        'orc.change_value,  '+
        'orc.current_debit_balance, '+
        'ord.dt_record, '+
        'orc.number, '+
        'ord.status, '+
        'CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note  '+
        'from tb_order ord '+
        '   inner join tb_order_consignment orc '+
        '   on (orc.id = ord.id)  '+
        '     and (orc.tb_institution_id = ord.tb_institution_id) '+
        '     and (orc.terminal = ord.terminal)  '+
        '   inner join tb_entity etd  '+
        '   on (etd.id = orc.tb_customer_id) '+
        'where (ord.tb_institution_id =? )  '+
        ' and (orc.tb_customer_id =? ) '+
        ' and (orc.kind ="supplying") '+
        ' and (ord.dt_record  = ( '+
        '    select max(ord.dt_record) dt_record '+
        '    from tb_order ord  '+
        '       inner join tb_order_consignment orc  '+
        '       on (orc.id = ord.id)  '+
        '         and (orc.tb_institution_id = ord.tb_institution_id)  '+
        '         and (orc.terminal = ord.terminal)   '+
        '    where (ord.tb_institution_id =? )  '+
        '     and (orc.tb_customer_id =? ) '+
        ' and (orc.kind ="supplying") '+
        '    )) '+
        'limit 1 ',        
        {
          replacements: [tb_institution_id,tb_customer_id,tb_institution_id,tb_customer_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject('OrderConsignment.getLastOrderByCustomer: '+err);
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
        '   inner join tb_order_consignment ora '+
        '   on (orc.id = ord.id)  '+
        '     and (orc.tb_institution_id = ord.tb_institution_id) '+
        '     and (orc.terminal = ord.terminal) '+
        '   inner join tb_entity etd '+
        '   on (etd.id = orc.tb_customer_id)  '+
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

  static getCheckpoint (tb_institution_id,id) {
    const promise = new Promise(async (resolve, reject) => {
      try{
        var result = {};
        this.getOrder(tb_institution_id,id)
        .then(async data => {
          var dataOrder ={            
                id : data.id,
                tb_institution_id : data.tb_institution_id,
                tb_customer_id : data.tb_customer_id,
                name_customer : data.name_customer,
                dt_record:data.dt_record,
                total_value : data.total_value,
                change_value : data.change_value,
                debit_balance : data.debit_balance,
              };
          result.Order = dataOrder;
          const dataItems = await consignmentItem.getCheckpointList(tb_institution_id,id);
          result.Items = dataItems;                    
          resolve(result);      
        })
      } 
      catch(err){
        reject('OrderConsignment.getCheckpoint: ' + err);
      } 
    });
    return promise;
  }

  static getSupplying (tb_institution_id,id) {
    const promise = new Promise(async (resolve, reject) => {
      try{
        var result = {};
        this.getOrder(tb_institution_id,id)
        .then(async data => {
          if (data.length > 0){
            var dataOrder ={            
                  id : data.id,
                  tb_institution_id : data.tb_institution_id,
                  tb_customer_id : data.tb_customer_id,
                  dt_record: data.dt_record,
                  name_customer : data.name_customer
                };
            result.Order = dataOrder;
            const dataItems = await consignmentItem.getSupplyingList(tb_institution_id,id);
            result.Items = dataItems;                    
            resolve(result);
          }else{
            resolve({result: "Ordem não encontrada"});
          }
        })
      } 
      catch(err){
        reject('OrderConsignment.getCheckpoint: ' + err);
      } 
    });
    return promise;
  }
   
  static getLast (tb_institution_id,tb_customer_id) {
    const promise = new Promise(async (resolve, reject) => {
      try{
        var result = {};
        this.getLastOrderByCustomer (tb_institution_id,tb_customer_id)
        .then(async data => {
          if (data){
            var dataOrder ={            
                  id : data.id,
                  tb_institution_id : data.tb_institution_id,
                  tb_customer_id : data.tb_customer_id,
                  name_customer : data.name_customer,
                  dt_record:data.dt_record,
                  current_debit_balance : data.current_debit_balance,
                };
            result.Order = dataOrder;
            const dataItems = await consignmentItem.getSupplyingList(tb_institution_id,data.id);
            if (dataItems.length > 0)
              result.Items = dataItems;
              resolve(result);
          }else{
            EntityController.getById(tb_customer_id)
            .then(async (data) => {
              var dataOrder ={            
                id : 0,
                tb_institution_id : parseInt(tb_institution_id),
                tb_customer_id : data.id,
                name_customer : data.name_company,                
                current_debit_balance : "0.00",
              };
              result.Order = dataOrder;
              const dataItems = await consignmentItem.getSupplyingNewList(tb_institution_id);
              if (dataItems.length > 0)
              result.Items = dataItems;
              resolve(result);              
            });
          }
          
        })
      } 
      catch(err){
        reject('OrderConsignment.getLast: ' + err);
      } 
    });
    return promise;
  }

  static async update(body) {        
    const promise = new Promise((resolve, reject) => {
      const dataOrder = {
        total_value : body.total_value,
        change_value : body.change_value,
        debit_balance:body.debit_balance       
      }
      Tb.update(dataOrder,{
        where: { id: body.id, tb_institution_id: body.tb_institution_id, terminal :0,tb_customer_id:body.tb_customer_id }
      })            
      .then(() => {  
        this.updateOrderItem(body)
        .then(() => {  
          this.updateOrderItem(body)
          .then(() => {          
            resolve(body);
          }) 
        })               
        resolve(body);
      })
      .catch(err => {
        reject("orderConsignment.update:"+ err);
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
            id : 0,
            tb_institution_id: body.Order.tb_institution_id,
            tb_order_id: body.Order.id,
            terminal: 0,
            tb_stock_list_id: item.tb_stock_list_id,
            tb_product_id: item.tb_product_id,
            quantity: item.quantity,
            unit_value: item.unit_value                  
          } ;
          //Quanto o insert é mais complexo como getNext precisa do await no loop          
          await orderItem.update(dataItem);
        };
        resolve("Items Alterados");       
      } catch(err) {            
        reject("orderConsignment.updateOrderItem:"+ err);
      }          
      
    });
    return promise;        
  }      

  static async updateOrderPaid(body) {      
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
      .catch(err => {
        reject("orderConsignment.updateOrder:"+ err);
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
            //Quanto o insert é mais complexo como create precisa do await no loop          
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
            //Quanto o insert é mais complexo como create precisa do await no loop          
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
module.exports = OrderConsignmentController;