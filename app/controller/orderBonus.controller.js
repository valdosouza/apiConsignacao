const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderbonus;
const orderitem = require("./orderItem.controller.js");

class OrderBonusController extends Base {     
       
    static async insert(item) {      
      const promise = new Promise(async (resolve, reject) => {
        orderitem.insert(item)
        .then(data => {
          resolve(data);
        })          
        .catch(err => {
          reject("orderBonus.insert:"+ err);
        });
      });
      return promise;        
    }    

    static getList(tb_institution_id,tb_order_id) {
        const promise = new Promise((resolve, reject) => {
          Tb.sequelize.query(
            'select '+
            'id,'+
            'tb_institution_id,'+
            'tb_order_id,'+
            'tb_product_id,'+
            'unit_value,'+
            'quantity '+
            'from tb_order_item '+
            'where (tb_institution_id =? ) '+
            ' and (tb_order_id =?) ',
            {
              replacements: [tb_institution_id,tb_order_id],
              type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {
              resolve(data);
            })
            .catch(err => {
              reject("orderBonus.getlist: " + err);
            });
        });
        return promise;
    }

    static get(tb_institution_id,tb_order_id,id) {
      const promise = new Promise((resolve, reject) => {
        Tb.sequelize.query(
          'select ' +
          'id,'+
          'tb_institution_id,'+
          'tb_order_id,'+
          'tb_product_id,'+
          'unit_value,'+
          'quantity '+
          'from tb_order_item '+
          'where (tb_institution_id =? ) '+
          ' and (tb_order_id =?) '+
          ' and (id =? )',
          {
            replacements: [tb_institution_id,tb_order_id,id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            resolve(data);
          })
          .catch(err => {
            reject('orderBonus.get: '+err);
          });
      });
      return promise;
  }

    static async update(item) {        
      const promise = new Promise((resolve, reject) => {
        orderitem.update(item)
        .then(data => {
          resolve(data);
        })          
        .catch(err => {
          reject("orderBonus.update:"+ err);
        });
      });
      return promise;        
    }        

    static async delete(item) {      
        const promise = new Promise((resolve, reject) => {
          orderitem.delete(item)
          .then(data => {
            resolve(data);
          })          
          .catch(err => {
            reject("orderBonus.delete:"+ err);
          });
        });
        return promise;        
    }        
    
}
module.exports = OrderBonusController