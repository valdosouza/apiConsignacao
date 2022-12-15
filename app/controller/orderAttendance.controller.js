const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderattendance;
const order = require('./order.controller.js');

class OrderStockTransferController extends Base {     
  static async getNextNumber(tb_institution_id) {      
    const promise = new Promise((resolve, reject) => {        
      Tb.sequelize.query(
        'Select max(number) lastNumber ' +
        'from tb_order_attendance '+
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
          reject('orderAttendance.getNexNumber: '+err);
        });           
    });
    return promise;
  }   

  static async insertOrder(body) {      
    const promise = new Promise(async (resolve, reject) => {
      
      if (body.number == 0)
        body.number = await this.getNextNumber(body.tb_institution_id);

      const dataOrder = {
        id : body.id,
        tb_institution_id : body.tb_institution_id,
        terminal : 0,
        number : body.number,
        tb_salesman_id: body.tb_salesman_id,
        tb_customer_id : body.tb_customer_id,
        visited : body.visited,
        charged : body.charged,
        longitude : body.longitude,
        latitude: body.latitude
      }
      Tb.create(dataOrder)
      .then(() => {          
        resolve(body);
      })
      .catch(err => {
        reject("orderAttendance.insertOrder:"+ err);
      });        
    });
    return promise;        
  }      
      

  static async insert(body) {      
    const promise = new Promise(async (resolve, reject) => {         
      const dataOrder = {
        id: 0,
        tb_institution_id: body.tb_institution_id,
        terminal:0,
        tb_user_id: body.tb_user_id,
        dt_record: body.dt_record,
        note: body.note
      }
      order.insert(dataOrder)
        .then(async (data)=>{
          body.id = data.id;
          this.insertOrder(body)
          .then(() => {  
            resolve(body);
          })            
          .catch(err => {
            reject("orderAttendance.insert:"+ err);
          });        
        })
    });
    return promise;        
  }    

    static getList(tb_institution_id) {
        const promise = new Promise((resolve, reject) => {
          Tb.sequelize.query(
          '  select '+
          '  oat.id, '+
          '  oat.tb_institution_id, '+
          '  ord.tb_user_id, '+
          '  oat.tb_customer_id, '+
          '  etc.name_company name_customer, '+
          '  oat.tb_salesman_id, '+
          '  ets.name_company name_salesman, '+
          '  ord.dt_record, '+
          ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note, '+                    
          '  ord.status, '+
          '  oat.visited, '+
          '  oat.charged, '+
          '  oat.latitude, '+
          '  oat.longitude '+
          'from tb_order_attendance  oat '+
          '   inner join tb_order ord '+
          '   on (ord.id = oat.id) '+
          '     and (ord.tb_institution_id = oat.tb_institution_id) '+
          '   inner join tb_entity etc '+
          '   on (etc.id = oat.tb_customer_id) '+
          '   inner join tb_entity ets '+
          '   on (ets.id = oat.tb_salesman_id)  '+
          'where (ord.tb_institution_id =? ) ', 
            {
              replacements: [tb_institution_id],
              type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {
              resolve(data);
            })
            .catch(err => {
              reject("orderattendance.getlist: " + err);
            });
        });
        return promise;
    }

    static getOrder(tb_institution_id,id) {
      const promise = new Promise((resolve, reject) => {
        Tb.sequelize.query(
          '  select  '+
          '  ord.id, '+
          '  ord.tb_institution_id, '+
          '  ord.status '+
          'from tb_order ord  '+
          'where (ord.tb_institution_id =? ) '+
          ' and (ord.id =? )',
          {
            replacements: [tb_institution_id,id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            resolve(data[0]);
          })
          .catch(err => {
            reject('orderattendance.get: '+err);
          });
      });
      return promise;
  }

  static get = (tb_institution_id,id) => {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select '+
        '  oat.id, '+
        '  oat.tb_institution_id, '+
        '  ord.tb_user_id, '+
        '  oat.tb_customer_id, '+
        '  etc.name_company name_customer, '+
        '  oat.tb_salesman_id, '+
        '  ets.name_company name_salesman, '+
        '  ord.dt_record, '+
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note, '+                    
        '  ord.status, '+
        '  oat.visited, '+
        '  oat.charged, '+
        '  oat.latitude, '+
        '  oat.longitude '+
        'from tb_order_attendance  oat '+
        '   inner join tb_order ord '+
        '   on (ord.id = oat.id) '+
        '     and (ord.tb_institution_id = oat.tb_institution_id) '+
        '   inner join tb_entity etc '+
        '   on (etc.id = oat.tb_customer_id) '+
        '   inner join tb_entity ets '+
        '   on (ets.id = oat.tb_salesman_id)  '+
        'where (ord.tb_institution_id =? ) '+
        ' and ( oat.id =? )',
        {
          replacements: [tb_institution_id,id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject('orderattendance.get: '+err);
        });
    });
    return promise;
  }

  static async updateOrder(body) {      
    const promise = new Promise(async (resolve, reject) => {      
      const dataOrder = {
        visited : body.visited,
        charged : body.charged,
        longitude : body.longitude,
        latitude: body.latitude
      };      
      Tb.update(dataOrder,{
        where: {id: body.id,              
                tb_institution_id: body.tb_institution_id, 
                terminal: 0,
                tb_salesman_id : body.tb_salesman_id }
      })
      .catch(err => {
        reject("orderAttendance.updateOrder:"+ err);
      });        
    });
    return promise;        
  }   

  static async update(body) {        
    const promise = new Promise((resolve, reject) => {
      const dataOrder = {
        id: body.id,
        tb_institution_id: body.tb_institution_id,
        terminal:0,
        tb_user_id: body.tb_user_id,
        dt_record: body.dt_record,
        note: body.note
      }
      order.update(dataOrder)
      .then(() => {  
        this.updateOrder(body)
        .then(() => {  
          resolve(body);
        })               
        resolve(body);
      })
      .catch(err => {
        reject("orderAttendance.update:"+ err);
      });        
    });
    return promise;        
  }        

  static async delete(body) {      
      const promise = new Promise((resolve, reject) => {
        resolve("Em Desenvolvimento");
          /*
          Tb.delete(orderstocktransfer)
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
        var dataOrder = await this.getOrder(body.tb_institution_id,body.id);        
        if (dataOrder.status == 'A'){       
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
        var dataOrder = await this.getOrder(body.tb_institution_id,body.id);        
        if (dataOrder.status == 'F'){
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
module.exports = OrderStockTransferController;