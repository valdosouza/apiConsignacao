const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.ordersalecard;

class OrderSaleCardController extends Base {     

  static async getById(id,tb_institution_id,tb_product_id) {    
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * '+        
        'from tb_order_sale_card  occ '+
        'where ( id =?) '+
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
          reject("OrderSaleCardController.insert:"+ err);
        });        
    });
    return promise;        
  }    

  
  static getNewOrderSaleCard(tb_institution_id,tb_price_list_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select '+
        'pdt.id tb_product_id, '+
        'pdt.description name_product, '+
        ' 0 bonus, '+
        ' 0 qtty_sold, '+
        'prc.price_tag unit_value '+
        'from tb_product pdt '+
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
                tb_product_id: parseInt(item.tb_product_id),
                name_product: item.name_product,
                bonus: Number(item.bonus),
                qtty_sold:Number(item.qtty_sold),
                unit_value: Number(item.unit_value),
              }
            )
          }       
          resolve(resData);
        })
        .catch(err => {
          reject("OrderSaleCard.getPreListForSale: " + err);
        });
    });
    return promise;
  }

  static async delete(order) {
    const promise = new Promise((resolve, reject) => {
      Tb.destroy({
        where: {
          id: order.id,
          tb_institution_id: order.tb_institution_id,
          terminal: order.terminal,
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("OrderSAleCard.delete:" + err);
        });
    });
    return promise;
  }  

  static async cleanUp(tb_institution_id, id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const order = {
          tb_institution_id: tb_institution_id,
          id: id,
          terminal: 0,
        }
        await this.delete(order);
        resolve("clenUp executado com sucesso!");
      } catch (error) {
        reject('orderSaleCard.cleanUp ' + error);
      }
    });
    return promise;
  }

}
module.exports = OrderSaleCardController;