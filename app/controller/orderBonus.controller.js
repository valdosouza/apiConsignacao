const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderbonus;
const order = require('./order.controller.js');
const orderItem = require('./orderItemBonus.controller.js');
const stockStatement = require('./stockStatement.controller.js');

class OrderBonusController extends Base {
  static async getNextNumber(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(number) lastNumber ' +
        'from tb_order_bonus ' +
        'WHERE ( tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data) {
            const nextNumber = data[0].lastNumber + 1;
            resolve(nextNumber);
          } else {
            resolve(1);
          }
        })
        .catch(err => {
          reject('orderBonus.getNexNumber: ' + err);
        });
    });
    return promise;
  }

  static async insertOrder(body) {
    const promise = new Promise(async (resolve, reject) => {

      if (body.Order.number == 0)
        body.Order.number = await this.getNextNumber(body.Order.tb_institution_id);

      const dataOrder = {
        id: body.Order.id,
        tb_institution_id: body.Order.tb_institution_id,
        terminal: 0,
        tb_salesman_id: body.Order.tb_salesman_id,
        number: body.Order.number,
        tb_customer_id: body.Order.tb_customer_id,
      }
      Tb.create(dataOrder)
        .then(() => {
          resolve(body);
        })
        .catch(err => {
          reject("orderBonus.insertOrder:" + err);
        });
    });
    return promise;
  }

  static async insertOrderItem(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {};
        for (var item of body.Items) {
          dataItem = {
            id: 0,
            tb_institution_id: body.Order.tb_institution_id,
            tb_order_id: body.Order.id,
            terminal: 0,
            tb_stock_list_id: item.tb_stock_list_id,
            tb_product_id: item.tb_product_id,
            quantity: item.quantity,
            unit_value: item.unit_value,
            kind: 'bonus',
          };
          //Quanto o insert é mais complexo como getNext precisa do await no loop          
          await orderItem.insert(dataItem);
        };
        resolve("Items Adicionados");
      } catch (err) {
        reject("orderBonus.insertOrderItem:" + err);
      }

    });
    return promise;
  }

  static async insert(body) {
    const promise = new Promise(async (resolve, reject) => {
      const dataOrder = {
        id: 0,
        tb_institution_id: body.Order.tb_institution_id,
        terminal: 0,
        tb_user_id: body.Order.tb_user_id,
        dt_record: body.Order.dt_record,
        note: body.Order.note
      }
      order.insert(dataOrder)
        .then(async (data) => {
          body.Order.id = data.id;
          this.insertOrder(body)
            .then(() => {
              this.insertOrderItem(body)
                .then(() => {
                  resolve(body);
                })
            })
            .catch(err => {
              reject("orderBonus.insert:" + err);
            });
        })
    });
    return promise;
  }

  static getList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select ' +
        '  ord.id, ' +
        '  ord.tb_institution_id, ' +
        '  ord.tb_user_id, ' +
        '  orb.tb_customer_id, ' +
        '  etd.name_company name_customer, ' +
        '  orb.tb_salesman_id,' +
        '  ord.dt_record,  ' +
        '  orb.number,  ' +
        '  ord.status, ' +
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note ' +
        'from tb_order ord ' +
        '   inner join tb_order_bonus orb ' +
        '   on (orb.id = ord.id) ' +
        '     and (orb.tb_institution_id = ord.tb_institution_id) ' +
        '     and (orb.terminal = ord.terminal) ' +
        '   inner join tb_entity etd ' +
        '   on (etd.id = orb.tb_customer_id)  ' +
        'where (ord.tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("orderBonus.getlist: " + err);
        });
    });
    return promise;
  }

  static getItemList(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ' +
        'ori.* ' +
        'from tb_order ord ' +
        '  inner join tb_order_bonus orb ' +
        '  on (orb.id = ord.id) ' +
        '    and (orb.tb_institution_id = ord.tb_institution_id) ' +
        '    and (orb.terminal = ord.terminal) ' +
        '  inner join tb_order_item ori ' +
        '  on (orb.id = ori.tb_order_id) ' +
        '    and (orb.tb_institution_id = ori.tb_institution_id) ' +
        '    and (orb.terminal = ori.terminal)  ' +
        'where (ord.tb_institution_id =? ) ' +
        'and (orb.id = ?) ' +
        ' and ori.kind =? ',
        {
          replacements: [tb_institution_id, id, 'bonus'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("orderBonus.getItemlist: " + err);
        });
    });
    return promise;
  }

  static getQttyByDay(tb_institution_id, tb_salesman_id, dt_record, tb_product_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select sum(quantity) total ' +
        'from tb_order_item ori ' +
        '  inner join tb_order_bonus orb ' +
        '  on (orb.id = ori.tb_order_id) ' +
        '    and (orb.tb_institution_id = ori.tb_institution_id) ' +
        '  inner join tb_order ord ' +
        '  on (orb.id = ord.id) ' +
        '    and (orb.tb_institution_id = ord.tb_institution_id) ' +
        'where ( ori.tb_institution_id = ?) ' +
        'and ( ori.kind =? )' +
        ' and (ori.tb_product_id =? )' +
        'and (orb.tb_salesman_id = ?) ' +
        'and ( ord.dt_record = ? ) ',
        {
          replacements: [tb_institution_id, 'bonus', tb_product_id, tb_salesman_id, dt_record],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {

          if (data.length > 0) {
            resolve(Number(data[0].total))
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject("orderSale.getItemlist: " + err);
        });
    });
    return promise;
  }


  static async getOrder(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select ' +
        '  ord.id, ' +
        '  ord.tb_institution_id, ' +
        '  ord.tb_user_id, ' +
        '  orb.tb_customer_id, ' +
        '  etd.name_company name_customer, ' +
        '  orb.tb_salesman_id,' +
        '  ord.dt_record,  ' +
        '  orb.number,  ' +
        '  ord.status, ' +
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note ' +
        'from tb_order ord ' +
        '   inner join tb_order_bonus orb ' +
        '   on (orb.id = ord.id) ' +
        '     and (orb.tb_institution_id = ord.tb_institution_id) ' +
        '     and (orb.terminal = ord.terminal) ' +
        '   inner join tb_entity etd ' +
        '   on (etd.id = orb.tb_customer_id)  ' +
        'where (ord.tb_institution_id =? ) ' +
        ' and (ord.id =? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject('orderBonus.get: ' + err);
        });
    });
    return promise;
  }

  static get = (tb_institution_id, id) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var result = {};
        const dataOrder = await this.getOrder(tb_institution_id, id);
        result.Order = dataOrder;
        const dataItems = await orderItem.getList(tb_institution_id, id);
        result.Items = dataItems;

        resolve(result);
      }
      catch (err) {
        reject('collaborbtor.get: ' + err);
      }
    });
    return promise;
  }

  static async updateOrder(body) {
    const promise = new Promise(async (resolve, reject) => {
      const dataOrderStockAdjust = {
        id: body.Order.id,
        tb_institution_id: body.Order.tb_institution_id,
        terminal: 0,
        tb_user_id: body.Order.tb_user_id,
        dt_record: body.Order.dt_record,
        note: body.Order.note
      }
      Tb.update(dataOrderStockAdjust, {
        where: {
          id: dataOrderStockAdjust.id,
          tb_institution_id: dataOrderStockAdjust.tb_institution_id,
          terminal: dataOrderStockAdjust.terminal
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(err => {
          reject("orderBonus.updateOrder:" + err);
        });
    });
    return promise;
  }

  static async updateOrderItem(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {

        var dataItem = {};
        for (var item of body.Items) {
          dataItem = {
            id: item.id,
            tb_institution_id: body.Order.tb_institution_id,
            tb_order_id: body.Order.id,
            terminal: 0,
            tb_stock_list_id: item.tb_stock_list_id,
            tb_product_id: item.tb_product_id,
            quantity: item.quantity,
            unit_value: item.unit_value
          };
          //Quanto o insert é mais complexo como getNext precisa do await no loop 
          switch (item.update_status) {
            case "I":
              await orderItem.insert(dataItem)
                .then(data => {
                  item.id = data.id;
                });
              break;
            case "E":
              await orderItem.update(dataItem);
              break;
            case "D":
              await orderItem.delete(dataItem);
              break;
          }
        };
        resolve("Items Alterados");
      } catch (err) {
        reject("orderBonus.updateOrderItem:" + err);
      }

    });
    return promise;
  }

  static async update(body) {
    const promise = new Promise((resolve, reject) => {
      const dataOrder = {
        id: body.Order.id,
        tb_institution_id: body.Order.tb_institution_id,
        terminal: 0,
        tb_user_id: body.Order.tb_user_id,
        dt_record: body.Order.dt_record,
        note: body.Order.note
      }
      order.update(dataOrder)
        .then(() => {
          this.updateOrder(body)
            .then(() => {
              this.updateOrderItem(body)
                .then(() => {
                  resolve(body);
                })
            })
          resolve(body);
        })
        .catch(err => {
          reject("orderBonus.update:" + err);
        });
    });
    return promise;
  }

  static async delete(order) {
    const promise = new Promise((resolve, reject) => {
      console.log("delete");
      console.log(order);
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
          reject("OrderBonus.delete:" + err);
        });
    });
    return promise;
  }

  static async closure(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataOrder = await this.getOrder(body.tb_institution_id, body.id);
        if (dataOrder.status == 'A') {
          var items = await orderItem.getList(body.tb_institution_id, body.id);

          var dataItem = {};
          for (var item of items) {
            dataItem = {
              id: 0,
              tb_institution_id: body.tb_institution_id,
              tb_order_id: body.id,
              terminal: 0,
              tb_order_item_id: item.id,
              tb_stock_list_id: item.tb_stock_list_id,
              local: "web",
              kind: "Fechamento",
              dt_record: body.dt_record,
              direction: "S",
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "Bonus"
            };
            await stockStatement.insert(dataItem);
          };
          await order.updateStatus(body.tb_institution_id, body.id, 'F');
          resolve("200");
        } else {
          resolve("201");
        }
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  static async reopen(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataOrder = await this.getOrder(body.tb_institution_id, body.id);
        if (dataOrder.status == 'F') {
          var items = await orderItem.getList(body.tb_institution_id, body.id);
          var dataItem = {};
          for (var item of items) {
            dataItem = {
              id: 0,
              tb_institution_id: body.tb_institution_id,
              tb_order_id: body.id,
              terminal: 0,
              tb_order_item_id: item.id,
              tb_stock_list_id: item.tb_stock_list_id,
              local: "web",
              kind: "Fechamento",
              dt_record: body.dt_record,
              direction: "S",
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "Bonus"
            };
            await stockStatement.insert(dataItem);
          };
          await order.updateStatus(body.tb_institution_id, body.id, 'A');
          resolve("200");
        } else {
          resolve("201");
        }
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  static async saveByCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var qtde = 0;
        for (var item of body.Items) {
          qtde += item.bonus;
        }
        if (qtde > 0) {
          body.Order['number'] = 0;
          await this.insertOrder(body);
          await this.insertOrderItemByCard(body)
          await this.closurebyCard(body);
        }
        resolve(body);
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  static async insertOrderItemByCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {};
        for (var item of body.Items) {
          if (item.bonus > 0) {
            dataItem = {
              id: 0,
              tb_institution_id: body.Order.tb_institution_id,
              tb_order_id: body.Order.id,
              terminal: 0,
              tb_stock_list_id: body.StockOrigen.tb_stock_list_id,
              tb_product_id: item.tb_product_id,
              quantity: item.bonus,
              unit_value: item.unit_value,
              kind: 'bonus',
            };
            //Quanto o insert é mais complexo como getNext precisa do await no loop          
            await orderItem.insert(dataItem);
          }
        };
        resolve("Items Adicionados");
      } catch (err) {
        reject("orderBonus.insertOrderItem:" + err);
      }

    });
    return promise;
  }

  static async closurebyCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var items = await this.getItemList(body.Order.tb_institution_id, body.Order.id);
        var dataItem = {};
        for (var item of items) {
          dataItem = {
            id: 0,
            tb_institution_id: item.tb_institution_id,
            tb_order_id: item.tb_order_id,
            terminal: 0,
            tb_order_item_id: item.id,
            tb_stock_list_id: item.tb_stock_list_id,
            local: "web",
            kind: "Fechamento",
            dt_record: body.Order.dt_record,
            direction: "S",
            tb_merchandise_id: item.tb_product_id,
            quantity: item.quantity,
            operation: "Bonus"
          };
          await stockStatement.insert(dataItem);
        };
        await order.updateStatus(body.Order.tb_institution_id, body.Order.id, 'F');
        resolve("200");
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  static async cleanUp(tb_institution_id, id) {
    const promise = new Promise(async (resolve, reject) =>  {
      try {
        
        const order = {
          tb_institution_id: tb_institution_id,
          id : id,
          terminal:0,
        }        
        console.log("cleanUp");
        console.log(order);
          
        await this.delete(order);  
        resolve("clenUp executado com sucesso!");
      } catch (error) {
        reject('orderBonus.cleanUp ' + error);  
      }
    });
    return promise;
  }

}
module.exports = OrderBonusController;