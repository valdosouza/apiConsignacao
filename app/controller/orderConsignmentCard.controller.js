const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderconsignmentcard;

class OrderConsignmentCardController extends Base {

  static async getById(id, tb_institution_id, tb_product_id, kind) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_order_consignment_card  occ ' +
        'where ( id =?) ' +
        ' and (tb_institution_id =?)' +
        ' and (tb_product_id =?)' +
        ' and (kind =?)',
        {
          replacements: [id, tb_institution_id, tb_product_id, kind],
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
        .then(async (data) => {
          resolve(data);
        })
        .catch(err => {
          reject("OrderConsignmentCardController.insert:" + err);
        });
    });
    return promise;
  }


  static getCheckpointList(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select ' +
        '  occ.tb_product_id, ' +
        '  pdt.description name_product, ' +
        '  occ.bonus, ' +
        '  occ.qtty_consigned, ' +
        '  occ.leftover, ' +
        '  occ.qtty_sold, ' +
        '  occ.unit_value ' +
        'from tb_product pdt ' +
        '    left outer join tb_order_consignment_card occ ' +
        '    on (pdt.id = occ.tb_product_id) ' +
        '       and (pdt.tb_institution_id = occ.tb_institution_id) ' +
        'where pdt.tb_institution_id  =? ' +
        ' and occ.id =? ' +
        ' and kind =? ',
        {
          replacements: [tb_institution_id, id, 'checkpoint'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          var dataResult = [];
          for (var item of data) {
            dataResult.push({
              tb_product_id: item.tb_product_id,
              name_product: item.name_product,
              bonus: Number(item.bonus),
              qtty_consigned: Number(item.qtty_consigned),
              leftover: Number(item.leftover),
              sale: Number(item.qtty_sold),
              unit_value: Number(item.unit_value),
            });
          }
          resolve(dataResult);
        })
        .catch(err => {
          reject("OrderConsignmentCard.getCheckpointList: " + err);
        });
    });
    return promise;
  }

  static getPayment(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select orp.tb_payment_type_id, pt.description name_payment_type, orp.dt_expiration, value ' +
        'from tb_order_paid orp ' +
        '  inner join tb_payment_types pt ' +
        '  on (pt.id = orp.tb_payment_type_id) ' +
        'where orp.tb_institution_id  =? ' +
        ' and orp.id =? ',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          var dataResult = [];
          for (var item of data) {
            dataResult.push({
              tb_payment_type_id: item.tb_payment_type_id,
              name_payment_type: item.name_payment_type,
              dt_expiration: item.dt_expiration,
              value: Number(item.value)
            });
          }
          resolve(dataResult);
        })
        .catch(err => {
          reject("OrderConsignmentCard.getPayment: " + err);
        });
    });
    return promise;
  }

  static getSupplyingList(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'SELECT '+
        'pdt.id AS tb_product_id, '+
        'pdt.description AS name_product, '+
        'COALESCE(occ.bonus, 0) AS bonus, '+
        'COALESCE(occ.leftover, 0) AS leftover, '+
        'COALESCE(occ.devolution, 0) AS devolution, '+
        'COALESCE(occ.new_consignment, 0) AS new_consignment, '+
        'COALESCE(occ.qtty_consigned, 0) AS qtty_consigned, '+
        'COALESCE(occ.unit_value, prc.price_tag) AS unit_value '+
        'from tb_product pdt      '+
        '    inner join tb_price prc '+
        '    on (prc.tb_product_id = pdt.id) '+
        '      and (prc.tb_institution_id = pdt.tb_institution_id) '+
        '      and (prc.tb_price_list_id = 1) '+
        '    left outer join tb_order_consignment_card occ      '+
        '    on (pdt.id = occ.tb_product_id)         '+
        '    and ((pdt.tb_institution_id = occ.tb_institution_id) or (occ.tb_institution_id is null)) '+
        '    and ((occ.id = ?) or (occ.id is null)) '+
        '    and ((kind =? ) or (kind is null)) '+
        'where  pdt.tb_institution_id = ? ',
        {
          replacements: [id, 'supplying',tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          var dataResult = [];
          for (var item of data) {
            dataResult.push({
              tb_product_id: item.tb_product_id,
              name_product: item.name_product,
              bonus: Number(item.bonus),
              leftover: Number(item.leftover),
              devolution: Number(item.devolution),
              qtty_consigned: Number(item.qtty_consigned),
              new_consignment: Number(item.new_consignment),
              unit_value: Number(item.unit_value),
            });
          }
          resolve(dataResult);
        })
        .catch(err => {
          reject("OrderConsignmentCard.getSupplyingList: " + err);
        });
    });
    return promise;
  }

  static getSupplyingNewList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ' +
        '"0.00" bonus, ' +
        'pdt.id tb_product_id, ' +
        'pdt.description name_product, ' +
        '"0.00" leftover, ' +
        '"0.00" devolution, ' +
        '"0.00" new_consignment, ' +
        '"0.00" qtty_consigned, ' +
        'price_tag unit_value ' +
        'from tb_product pdt ' +
        '  inner join tb_price prc ' +
        '  on (pdt.id = prc.tb_product_id) ' +
        '    and (pdt.tb_institution_id = prc.tb_institution_id) ' +
        'where pdt.tb_institution_id  =? ' +
        ' and prc.tb_price_list_id = 1 ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          var dataResult = [];
          for (var item of data) {
            dataResult.push({
              tb_product_id: item.tb_product_id,
              name_product: item.name_product,
              bonus: Number(item.bonus),
              leftover: Number(item.leftover),
              devolution: Number(item.devolution),
              qtty_consigned: Number(item.qtty_consigned),
              new_consignment: Number(item.new_consignment),
              unit_value: Number(item.unit_value),
            });
          }
          resolve(dataResult);
        })
        .catch(err => {
          reject("OrderConsignmentCard.getSupplyingList: " + err);
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
          reject("OrderConsigmentCard.delete:" + err);
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
        reject('orderConsignmentCard.cleanUp ' + error);
      }
    });
    return promise;
  }

}
module.exports = OrderConsignmentCardController;