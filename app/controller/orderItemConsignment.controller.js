const Base = require('./base.controller.js');
const db = require("../model/index.js");
const Tb = db.orderitem;
const orderitem = require("./orderItem.controller.js");

class OrderItemConsignmentController extends Base {     
       
    static async insert(item) {      
      const promise = new Promise(async (resolve, reject) => {
        orderitem.insert(item)
        .then(data => {
          resolve(data);
        })          
        .catch(err => {
          reject("itemConsignment.insert:"+ err);
        });
      });
      return promise;        
    }    

    static getList(tb_institution_id,tb_order_id, order_kind, item_kind) {
        const promise = new Promise((resolve, reject) => {
          Tb.sequelize.query(
            'select '+
            'ori.id,'+
            'ori.tb_institution_id,'+
            'ori.terminal, '+
            'ori.tb_order_id,'+
            'ori.tb_stock_list_id,'+
            'stl.description name_stock_list,'+
            'ori.tb_product_id,'+
            'pdt.description,'+
            'ori.quantity '+
            'from tb_order_item ori '+
            '  inner join tb_order_consignment orc '+
            '  on (orc.id = ori.tb_order_id)'+
            '    and (orc.tb_institution_id = ori.tb_institution_id)'+   
            '    and (orc.terminal = ori.terminal) ' +         
            '  inner join tb_product pdt '+
            '  on (pdt.id = ori.tb_product_id)'+
            '  inner join tb_stock_list stl '+
            '  on (stl.id = ori.tb_stock_list_id)'+
            '    and (stl.tb_institution_id = ori.tb_institution_id)'+            
            'where (ori.tb_institution_id =? ) '+
            ' and (ori.tb_order_id =?) '+
            ' and (orc.kind = ?)'+
            ' and (ori.kind =?)',            
            {
              replacements: [tb_institution_id,tb_order_id,order_kind,item_kind],
              type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {                
              resolve(data);
            })
            .catch(err => {
              reject("itemConsignment.getlist: " + err);
            });
        });
        return promise;
    }

    static get(tb_institution_id,tb_order_id,id,kind) {
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
          ' and (id =? )'+
          ' and (kind =?)',
          {
            replacements: [tb_institution_id,tb_order_id,id,kind],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            resolve(data);
          })
          .catch(err => {
            reject('itemConsignment.get: '+err);
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
          reject("itemConsignment.update:"+ err);
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
            reject("itemConsignment.delete:"+ err);
          });
        });
        return promise;        
    }        
    
}
module.exports = OrderItemConsignmentController;