const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderitem;
const orderitem = require("./orderItem.controller.js");

class OrderItemSaleController extends Base {

  static async insert(item) {
    const promise = new Promise(async (resolve, reject) => {
      orderitem.insert(item)
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          reject("itemSale.insert:" + error);
        });
    });
    return promise;
  }

  static getList(tb_institution_id, tb_order_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ' +
        'ori.id, ' +
        'ori.tb_stock_list_id, ' +
        'stl.description name_stock_list, ' +
        'ori.tb_price_list_id, ' +
        'pcl.description name_price_list, ' +
        'ori.tb_product_id, ' +
        'pdt.description, ' +
        'ori.quantity,  ' +
        ' "" update_status ' +
        'from tb_order_item ori  ' +
        '  inner join tb_product pdt  ' +
        '  on (pdt.id = ori.tb_product_id) ' +
        '  inner join tb_stock_list stl ' +
        '  on (stl.id = ori.tb_stock_list_id) ' +
        '    and (stl.tb_institution_id = ori.tb_institution_id) ' +
        '  left outer join tb_price_list pcl ' +
        '  on (pcl.id = ori.tb_price_list_id) ' +
        '    and (pcl.tb_institution_id = ori.tb_institution_id) ' +
        'where ( ori.tb_institution_id =?)' +
        ' and ( ori.tb_order_id =? )' +
        ' and ( ori.kind =?) ',
        {
          replacements: [tb_institution_id, tb_order_id, 'Sale'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          var dataResult = [];
          for (var item of data) {
            dataResult.push({
              id: item.id,
              tb_stock_list_id: item.tb_stock_list_id,
              name_stock_list: item.name_stock_list,
              tb_price_list_id: item.tb_price_list_id,
              name_price_list: item.name_price_list,
              tb_product_id: item.tb_product_id,
              name_product: item.description,
              quantity: Number(item.quantity),
              update_status: item.update_status,
            });
          }
          resolve(dataResult);
        })
        .catch(error => {
          reject("itemSale.getlist: " + error);
        });
    });
    return promise;
  }

  static get(tb_institution_id, tb_order_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ' +
        'id,' +
        'tb_institution_id,' +
        'tb_order_id,' +
        'tb_stock_list_id,' +
        'tb_product_id,' +
        'quantity ' +
        'from tb_order_item ' +
        'where (tb_institution_id =? ) ' +
        ' and (tb_order_id =?) ' +
        ' and (id =? )',
        {
          replacements: [tb_institution_id, tb_order_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(error => {
          reject('itemSale.get: ' + error);
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
        .catch(error => {
          reject("itemSale.update:" + error);
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
        .catch(error => {
          reject("itemSale.delete:" + error);
        });
    });
    return promise;
  }

}
module.exports = OrderItemSaleController;