const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.ordersaleitem;

class OrderSaleItemController extends Base {     

  static async getById(id,tb_institution_id,tb_product_id) {    
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * '+        
        'from tb_order_sale_item  oci '+
        'where ( ct.id =?) '+
        ' and (tb_institution_id =?)'+
        ' and (tb_product_id =?)' , 
        {
          replacements: [id,tb_institution_id,tb_product_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
            resolve(data[0]);
        })
        .catch(err => {
          reject('getById: ' + err);
        });
    });
    return promise;
  };

  static async insert(body) {      
    const promise = new Promise(async (resolve, reject) => {         
      Tb.create(body)
        .then(async (data)=>{
          resolve(data);
        })            
        .catch(err => {
          reject("OrderSaleItemController.insert:"+ err);
        });        
    });
    return promise;        
  }    

  
  static getPreListForSale(tb_institution_id,tb_price_list_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select '+
        'pdt.id tb_product_id, '+
        'pdt.description name_product, '+
        'osi.bonus, '+
        'osi.sale, '+
        'prc.price_tag unit_value '+
        'from tb_product pdt '+
        '  left outer join tb_order_sale_item osi '+
        '  on (pdt.id = osi.tb_product_id) '+
        '     and (pdt.tb_institution_id = osi.tb_institution_id) '+
        '  inner join tb_price prc '+
        '  on (prc.tb_product_id = pdt.id ) '+
        '     and (pdt.tb_institution_id = prc.tb_institution_id) '+
        'where pdt.tb_institution_id  =? '+
        'and prc.tb_price_list_id = ? ',
        {
          replacements: [tb_institution_id,tb_price_list_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {   
          var resData = [];
          for (var item of data){
            resData.push(
              {
                id: parseInt(item.tb_product_id),
                name_product: item.name_product,
                bonus: Number(item.bonus),
                sale:Number(item.sale),
                unit_value: Number(item.unit_value),
              }
            )
          }       
          resolve(resData);
        })
        .catch(err => {
          reject("OrderSaleItem.getPreListForSale: " + err);
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
  
}
module.exports = OrderSaleItemController;