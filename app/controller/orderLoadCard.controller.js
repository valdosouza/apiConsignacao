const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderloadcard;
const order = require('./order.controller.js');
const OrderSaleController = require("../controller/orderSale.controller.js");
const OrderBonusController = require("../controller/orderBonus.controller.js");
const StockBalanceControler = require('../controller/stockBalance.controller.js');

class OrderLoadCardController extends Base {

  static async getById(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select ' +
        'ord.status, '+
        'ord.id, ' +
        'ord.tb_institution_id,'+
        'ord.tb_user_id,'+
        'occ.tb_product_id, ' +
        'pd.description name_product, ' +
        'occ.stock_balance, ' +
        'occ.sale, ' +
        'occ.bonus, ' +
        'occ.adjust, ' +
        'occ.new_load ' +
        'from tb_order_load_card  occ ' +
        '  inner join tb_product pd ' +
        '    on (pd.id = occ.tb_product_id) ' +
        '    and (pd.tb_institution_id = occ.tb_institution_id)' +
        '  inner join tb_order ord ' +
        '  on (occ.id = ord.id)' +
        '    and (occ.tb_institution_id = ord.tb_institution_id)' +
        'where ( ord.id =?) ' +
        ' and (ord.tb_institution_id =?)' ,
        {
          replacements: [id, tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          
          resolve( data);
        })
        .catch(err => {
          reject('getById: ' + err);
        });
    });
    return promise;
  };

  static async getByUser(tb_institution_id, tb_user_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select ' +
        'occ.id, ' +
        'occ.tb_product_id, ' +
        'pd.description name_product, ' +
        'occ.stock_balance, ' +
        'occ.sale, ' +
        'occ.bonus, ' +
        'occ.adjust, ' +
        'occ.new_load ' +
        'from tb_order_load_card  occ ' +
        '  inner join tb_product pd ' +
        '    on (pd.id = occ.tb_product_id) ' +
        '    and (pd.tb_institution_id = occ.tb_institution_id)' +
        '  inner join tb_order ord ' +
        '  on (occ.id = ord.id)' +
        '    and (occ.tb_institution_id = ord.tb_institution_id)' +
        'where  (ord.tb_institution_id =?)' +
        ' and (ord.tb_user_id =?)' +
        ' and ( ord.status=?) ',
        {
          replacements: [tb_institution_id, tb_user_id, 'A'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject('getById: ' + err);
        });
    });
    return promise;
  };

  static async getList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select distinct '+
        'ord.tb_institution_id, '+
        'ord.id,  '+
        'ord.dt_record,  '+
        'ord.tb_user_id, '+
        'etd.name_company name_user '+
        'from tb_order_load_card  occ  '+
        '  inner join tb_order ord  '+
        '  on (occ.id = ord.id) '+
        '    and (occ.tb_institution_id = ord.tb_institution_id) '+
        '  inner join tb_entity etd '+
        '  on (etd.id = ord.tb_user_id) '+
        'where  (ord.tb_institution_id =?) '+
        ' and (ord.status =?) ',
        {
          replacements: [tb_institution_id, 'A'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
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
        var resData = [];
        var data = [];
        data = await this.getByUser(tb_institution_id, tb_user_id);
        if (data.length > 0) {
          for (var item of data) {
            resData.push(
              {
                id: item.id,
                tb_product_id: parseInt(item.tb_product_id),
                name_product: item.name_product,
                stock_balance: Number(item.stock_balance),
                sale: Number(item.sale),
                bonus: Number(item.bonus),
                adjust: Number(item.adjust),
                new_load: Number(item.new_load),
              }
            )
          }
        } else {
          var data = await StockBalanceControler.getAllBySalesman(tb_institution_id, tb_user_id);
          for (var item of data.items) {
            resData.push(
              {
                id: 0,
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