const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.ordersalecard;
const orderSale = require('./orderSale.controller.js');
const orderPaid = require('./orderPaid.controller.js');

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
        .catch(error => {
          reject('getById: ' + error);
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
        .catch(error => {
          reject("OrderSaleCardController.insert:"+ error);
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
        ' 0 sale, '+
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
                sale : Number(item.sale),
                unit_value: Number(item.unit_value),
              }
            )
          }       
          resolve(resData);
        })
        .catch(error => {
          reject("OrderSaleCard.getPreListForSale: " + error);
        });
    });
    return promise;
  }

  static getOrder(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select ' +
        '  ord.id, ' +
        '  ord.tb_institution_id, ' +
        '  ord.tb_user_id, ' +
        '  ors.tb_customer_id,' +
        '  cus.name_company name_customer,' +
        '  tb_salesman_id, ' +
        '  ven.name_company name_salesman, ' +
        '  ord.dt_record, ' +
        '  total_value,'+
        '  change_value,'+
        '  ors.number, ' +
        '  ord.status, ' +
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note ' +
        'from tb_order ord  ' +
        '   inner join tb_order_sale ors ' +
        '   on (ors.id = ord.id)  ' +
        '     and (ors.tb_institution_id = ord.tb_institution_id) ' +
        '     and (ors.terminal = ord.terminal) ' +
        '   inner join tb_entity cus ' +
        '   on (cus.id = ors.tb_customer_id)  ' +
        '   inner join tb_entity ven ' +
        '   on (ven.id = ors.tb_salesman_id)  ' +
        'where (ord.tb_institution_id =? ) ' +
        ' and (ord.id =? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            resolve({
              id : data[0].id,
              tb_institution_id : data[0].tb_institution_id,
              tb_user_id : data[0].tb_user_id,
              tb_customer_id : data[0].tb_customer_id,
              name_customer : data[0].name_customer,
              tb_salesman_id : data[0].tb_salesman_id,
              name_salesman : data[0].name_salesman,
              dt_record : data[0].dt_record,
              total_value : Number(data[0].total_value),
              change_value : Number(data[0].change_value),
              number : data[0].number,
              status : data[0].status,
              note : data[0].note
            });
          } else {
            resolve({ id: 0 });
          }
        })
        .catch(error => {
          reject('orderSaleCard.getOrder: ' + error);
        });
    });
    return promise;
  }

  static getMainOrderSaleCard = (tb_institution_id, tb_order_id) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var result = {};
        const dataOrder = await this.getOrder(tb_institution_id, tb_order_id);
        result.order = dataOrder;
        const dataItems = await this.get(tb_institution_id, tb_order_id);
        result.items = dataItems;
        const dataPayments = await orderPaid.getList(tb_institution_id, tb_order_id);
        result.payments = dataPayments;

        resolve(result);
      }
      catch (error) {
        reject('OrderSaleCard.getMainOrderSaleCard: ' + error);
      }
    });
    return promise;
  }

  static get(tb_institution_id,tb_order_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select '+
        'orsc.tb_product_id,  '+
        'pdt.description name_product, '+
        'orsc.bonus, '+
        'orsc.sale,  '+
        'orsc.unit_value  '+
        'from tb_order_sale_card orsc '+
        '  inner join tb_product pdt  '+
        '  on (pdt.id = orsc.tb_product_id )  '+
        '  and (pdt.tb_institution_id = orsc.tb_institution_id)  '+
        'where orsc.tb_institution_id = ?  '+
        'and orsc.id = ? ',
        {
          replacements: [tb_institution_id,tb_order_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {   
          var resData = [];
          for (var item of data){
            resData.push(
              {
                tb_product_id: parseInt(item.tb_product_id),
                name_product: item.name_product,
                bonus: Number(item.bonus),
                sale : Number(item.sale),
                unit_value: Number(item.unit_value),
              }
            )
          }       
          resolve(resData);
        })
        .catch(error => {
          reject("OrderSaleCard.get: " + error);
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
        .catch(error => {
          reject("OrderSAleCard.delete:" + error);
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