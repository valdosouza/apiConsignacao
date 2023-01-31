const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderloadcard;
const order = require('./order.controller.js');
const OrderSaleController = require("../controller/orderSale.controller.js");
const OrderBonusController = require("../controller/orderBonus.controller.js");
const StockBalanceControler = require('../controller/stockBalance.controller.js');

class OrderLoadCardController extends Base {

  static async getById(id, tb_institution_id, tb_product_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_order_load_card  occ ' +
        'where ( id =?) ' +
        ' and (tb_institution_id =?)' +
        ' and (tb_product_id =?)',
        {
          replacements: [id, tb_institution_id, tb_product_id],
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
      const dataOrder = {
        id: 0,
        tb_institution_id: body.tb_institution_id,
        terminal: 0,
        tb_user_id: body.tb_user_id,
        dt_record: body.dt_record,
      }
      order.insert(dataOrder)
        .then(async (data) => {
          body.id = data.id;
          for (var item of body.Items) {
            try {
              item['id'] = body.id;
              item['tb_institution_id'] = body.tb_institution_id;
              item['terminal'] = data.terminal;
              await Tb.create(item);
            } catch (err) {
              reject("OrderLoadCardController.insert:" + err);
            }
          }
          resolve(body);
        })
        .catch(err => {
          reject("OrderLoadCardController.insert:" + err);
        });
    });
    return promise;
  }


  static getNewOrderLoadCard(tb_institution_id, tb_user_id, dt_record) {
    const promise = new Promise(async (resolve, reject) => {


      try {
        var data = await StockBalanceControler.getAllBySalesman(tb_institution_id, tb_user_id);
        var resData = [];
        for (var item of data.items) {
          resData.push(
            {
              tb_product_id: parseInt(item.tb_merchandise_id),
              name_product: item.name_merchandise,
              stock_balance: Number(item.quantity),
              sale: await OrderSaleController.getQttyByDay(tb_institution_id, tb_user_id, dt_record, item.tb_merchandise_id),
              bonus: await OrderBonusController.getQttyByDay(tb_institution_id, tb_user_id, dt_record, item.tb_merchandise_id),
              adjust: Number(0),
              new_load: Number(0),
            }
          )
        }
        resolve(resData);
      } catch (err) {
        reject("OrderLoadCard.getNewOrderLoadCard: " + err);
      }

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
module.exports = OrderLoadCardController;