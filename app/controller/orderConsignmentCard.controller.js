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
          resolve(data);
        })
        .catch(err => {
          reject("OrderConsignmentCard.getCheckpointList: " + err);
        });
    });
    return promise;
  }

  static getSupplyingList(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select ' +
        '  occ.tb_product_id, ' +
        '  pdt.description name_product, ' +
        '  occ.bonus, ' +
        '  occ.leftover, ' +
        '  occ.devolution, ' +
        '  occ.new_consignment,' +
        '  occ.qtty_consigned, ' +
        '  occ.unit_value ' +
        'from tb_product pdt ' +
        '    left outer join tb_order_consignment_card occ ' +
        '    on (pdt.id = occ.tb_product_id) ' +
        '       and (pdt.tb_institution_id = occ.tb_institution_id) ' +
        'where pdt.tb_institution_id  =? ' +
        ' and occ.id =? ' +
        ' and kind =? ',
        {
          replacements: [tb_institution_id, id, 'supplying'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
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
          resolve(data);
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