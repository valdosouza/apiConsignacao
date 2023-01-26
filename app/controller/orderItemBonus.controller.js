const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderitem;
const orderitem = require("./orderItem.controller.js");

class OrderItemBonusController extends Base {     
       
    static async insert(item) {      
      const promise = new Promise(async (resolve, reject) => {
        orderitem.insert(item)
        .then(data => {
          resolve(data);
        })          
        .catch(err => {
          reject("itemBonus.insert:"+ err);
        });
      });
      return promise;        
    }    

    static getList(tb_institution_id,tb_order_id) {
        const promise = new Promise((resolve, reject) => {
          Tb.sequelize.query(
            'select '+
            'ori.id,'+
            'ori.tb_institution_id,'+
            'ori.tb_order_id,'+
            'ori.tb_stock_list_id,'+
            'stl.description name_stock_list,'+
            'ori.tb_product_id,'+
            'pdt.description,'+
            'ori.quantity '+
            'from tb_order_item ori '+
            '  inner join tb_product pdt '+
            '  on (pdt.id = ori.tb_product_id)'+
            '  inner join tb_stock_list stl '+
            '  on (stl.id = ori.tb_stock_list_id)'+
            '    and (stl.tb_institution_id = ori.tb_institution_id)'+            
            'where (ori.tb_institution_id =? ) '+
            ' and (ori.tb_order_id =?) '+
            ' and (ori.kind =?)',
            {
              replacements: [tb_institution_id,tb_order_id,'bonus'],
              type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {              
              resolve(data);
            })
            .catch(err => {
              reject("itemBonus.getlist: " + err);
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
            reject('itemBonus.get: '+err);
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
          reject("itemBonus.update:"+ err);
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
            reject("itemBonus.delete:"+ err);
          });
        });
        return promise;        
    }        
    
}
module.exports = OrderItemBonusController;