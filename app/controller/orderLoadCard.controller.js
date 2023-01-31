const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderloadcard;
const order = require('./order.controller.js');
const OrderSaleController = require("../controller/orderSale.controller.js");
const OrderBonusController = require("../controller/orderBonus.controller.js");

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
        tb_user_id: body.tb_salesman_id,
        dt_record: body.dt_record,
      }
      order.insert(dataOrder)
        .then(async (data) => {
          body.id = data.id;
          for (var item of body.items) {
            try {
              item['id'] = body.id;
              item['tb_institution_id'] = body.tb_institution_id;
              item['terminal'] = data.terminal;
              await Tb.create(item);
            } catch (err) {
              reject("OrderLoadCardController.insert:" + err);
            }
          }
          resolve({ result: "LoadCard saved" });
        })
        .catch(err => {
          reject("OrderLoadCardController.insert:" + err);
        });
    });
    return promise;
  }


  static getNewOrderLoadCard(tb_institution_id, tb_salesman_id, dt_record) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ' +
        'pdt.id tb_product_id, ' +
        'pdt.description name_product, ' +
        'sb.quantity stock_balance ' +
        'from tb_product pdt ' +
        '   inner join tb_stock_balance sb ' +
        '   on (sb.tb_merchandise_id = pdt.id) ' +
        '      and (pdt.tb_institution_id = sb.tb_institution_id) ' +
        '   inner join tb_entity_has_stock_list ehsl ' +
        '   on (ehsl.tb_stock_list_id = sb.tb_stock_list_id) ' +
        '      and (ehsl.tb_institution_id = sb.tb_institution_id) ' +
        'where (pdt.tb_institution_id  =?) ' +
        'and (tb_entity_id = ?)  ',
        {
          replacements: [tb_institution_id, tb_salesman_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(async data => {
          var resData = [];
          for (var item of data) {
            resData.push(
              {
                tb_product_id: parseInt(item.tb_product_id),
                name_product: item.name_product,
                stock_balance: Number(item.stock_balance),
                sale: await OrderSaleController.getQttyByDay(tb_institution_id, tb_salesman_id, dt_record, item.tb_product_id),
                bonus: await OrderBonusController.getQttyByDay(tb_institution_id, tb_salesman_id, dt_record, item.tb_product_id),
                adjust: Number(0),
                new_load: Number(0),
              }
            )
          }
          resolve(resData);
        })
        .catch(err => {
          reject("OrderLoadCard.getNewOrderLoadCard: " + err);
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
module.exports = OrderLoadCardController;