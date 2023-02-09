const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderitem;
const orderitem = require("./orderItem.controller.js");

class OrderItemStockTransferController extends Base {     
       
    static async insert(item) {      
      const promise = new Promise(async (resolve, reject) => {
        orderitem.insert(item)
        .then(data => {
          resolve(data);
        })          
        .catch(err => {
          reject("itemStockTransfer.insert:"+ err);
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
            'ori.tb_product_id,'+
            'pdt.description,'+
            'ori.quantity '+
            'from tb_order_item ori '+
            '  inner join tb_product pdt '+
            '  on (pdt.id = ori.tb_product_id)'+
            'where (ori.tb_institution_id =? ) '+
            ' and (ori.tb_order_id =?) '+
            ' and (ori.kind =?)',                      
            {
              replacements: [tb_institution_id,tb_order_id,'StockTransfer'],
              type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {              
              resolve(data);
            })
            .catch(err => {
              reject("itemStockTransfer.getlist: " + err);
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
            reject('itemStockTransfer.get: '+err);
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
          reject("itemStockTransfer.update:"+ err);
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
            reject("itemStockTransfer.delete:"+ err);
          });
        });
        return promise;        
    }        
    
}
module.exports = OrderItemStockTransferController;