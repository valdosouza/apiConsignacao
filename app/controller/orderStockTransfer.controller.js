const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderstocktransfer;
const order = require('./order.controller.js');
const orderItem = require('./orderItemStockTransfer.controller.js');
const stockStatement = require('./stockStatement.controller.js');

class OrderStockTransferController extends Base {
  static async getNextNumber(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(number) lastNumber ' +
        'from tb_order_stock_transfer ' +
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
          reject('orderStockTransfer.getNexNumber: ' + err);
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
        number: body.Order.number,
        tb_entity_id: body.Order.tb_entity_id,
        direction: body.Order.direction,
        tb_stock_list_id_ori: body.Order.tb_stock_list_id_ori,
        tb_stock_list_id_des: body.Order.tb_stock_list_id_des,
      }
      Tb.create(dataOrder)
        .then(() => {
          resolve(body);
        })
        .catch(err => {
          reject("orderStockTransfer.insertOrder:" + err);
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
            kind: 'StockTransfer',
          };
          //Quanto o insert é mais complexo como getNext precisa do await no loop          
          await orderItem.insert(dataItem);
        };
        resolve("Items Adicionados");
      } catch (err) {
        reject("orderStockTransfer.insertOrderItem:" + err);
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
              reject("orderStockTransfer.insert:" + err);
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
        '  ora.tb_entity_id, ' +
        '  etd.name_company name_entity, ' +
        '  tb_stock_list_id_ori, ' +
        '  sto.description name_stock_list_ori, ' +
        '  tb_stock_list_id_des, ' +
        '  std.description name_stock_list_des,   ' +
        '  ord.dt_record,  ' +
        '  ora.number,  ' +
        '  ord.status, ' +
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note ' +
        'from tb_order ord ' +
        '   inner join tb_order_stock_transfer ora ' +
        '   on (ora.id = ord.id) ' +
        '     and (ora.tb_institution_id = ord.tb_institution_id) ' +
        '     and (ora.terminal = ord.terminal) ' +
        '   inner join tb_entity etd ' +
        '   on (etd.id = ora.tb_entity_id)  ' +
        '   inner join tb_stock_list sto ' +
        '   on (sto.id  = ora.tb_stock_list_id_ori) ' +
        '     and (sto.tb_institution_id  = ora.tb_institution_id) ' +
        '   inner join tb_stock_list std ' +
        '   on (std.id  = ora.tb_stock_list_id_des) ' +
        '     and (std.tb_institution_id  = ora.tb_institution_id) ' +
        'where (ord.tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          var dataReturn = {};
          var arrayReturn = [];
          for (var item of data) {
            arrayReturn.push(item);
          }
          resolve(arrayReturn);
        })
        .catch(err => {
          reject("orderstocktransfer.getlist: " + err);
        });
    });
    return promise;
  }

  static getItemList(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select '+
        'ori.* '+
        'from tb_order ord  '+
        '  inner join tb_order_stock_transfer ort  '+
        '  on (ort.id = ord.id)  '+
        '    and (ort.tb_institution_id = ord.tb_institution_id)  '+
        '    and (ort.terminal = ord.terminal)  '+
        '  inner join tb_order_item ori  '+
        '  on (ort.id = ori.tb_ordeR_id)  '+
        '    and (ort.tb_institution_id = ori.tb_institution_id)  '+
        '    and (ort.terminal = ori.terminal)   '+
        'where (ord.tb_institution_id =? )  '+
        ' and ( ort.id = ? )  '+
        ' and ( ori.kind =? )  ',
        {
          replacements: [tb_institution_id, id, 'Transfer'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
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
        '  ora.tb_entity_id, ' +
        '  etd.name_company name_entity, ' +
        '  tb_stock_list_id_ori, ' +
        '  sto.description name_stock_list_ori, ' +
        '  tb_stock_list_id_des, ' +
        '  std.description name_stock_list_des,   ' +
        '  ord.dt_record,  ' +
        '  ora.number,  ' +
        '  ord.status, ' +
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note ' +
        'from tb_order ord ' +
        '   inner join tb_order_stock_transfer ora ' +
        '   on (ora.id = ord.id) ' +
        '     and (ora.tb_institution_id = ord.tb_institution_id) ' +
        '     and (ora.terminal = ord.terminal) ' +
        '   inner join tb_entity etd ' +
        '   on (etd.id = ora.tb_entity_id)  ' +
        '   inner join tb_stock_list sto ' +
        '   on (sto.id  = ora.tb_stock_list_id_ori) ' +
        '     and (sto.tb_institution_id  = ora.tb_institution_id) ' +
        '   inner join tb_stock_list std ' +
        '   on (std.id  = ora.tb_stock_list_id_des) ' +
        '     and (std.tb_institution_id  = ora.tb_institution_id) ' +
        'where (ord.tb_institution_id =? ) ' +
        ' and (ord.id =? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject('orderstocktransfer.get: ' + err);
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
        reject('collaborator.get: ' + err);
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
          reject("orderStockTransfer.updateOrder:" + err);
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
        reject("orderStockTransfer.updateOrderItem:" + err);
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
          reject("orderStockTransfer.update:" + err);
        });
    });
    return promise;
  }

  static async delete(body) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
      Tb.delete(orderstocktransfer)
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
              tb_stock_list_id: 0,
              local: "web",
              kind: "Fechamento",
              dt_record: body.dt_record,
              direction: "S",
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "Transfer"
            };
            //Origen
            dataItem['tb_stock_list_id'] = dataOrder.tb_stock_list_id_ori;
            dataItem['direction'] = 'S';
            await stockStatement.insert(dataItem);
            //Destiny
            dataItem['tb_stock_list_id'] = dataOrder.tb_stock_list_id_des;
            dataItem['direction'] = 'E';
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
              tb_stock_list_id: 0,
              local: "web",
              kind: "Fechamento",
              dt_record: body.dt_record,
              direction: "S",
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "Transfer"
            };
            //Origen - Inverte direção ao reabrir
            dataItem['tb_stock_list_id'] = dataOrder.tb_stock_list_id_ori;
            dataItem['direction'] = 'E';
            await stockStatement.insert(dataItem);
            //Destiny - Inverte direção ao reabrir
            dataItem['tb_stock_list_id'] = dataOrder.tb_stock_list_id_des;
            dataItem['direction'] = 'S';
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
          qtde += item.devolution;
        }
        if (qtde > 0) {
          body.Order['number'] = 0;
          var _order = {
            id: body.Order.id,
            tb_institution_id: body.Order.tb_institution_id,
            terminal: 0,
            number: body.Order.number,
            tb_entity_id: body.Order.tb_customer_id,
            direction: body.Order.direction,
            tb_stock_list_id_ori: body.StockCustomer.tb_stock_list_id,
            tb_stock_list_id_des: body.StockSalesman.tb_stock_list_id,
          }
          var _body = {};
          _body['Order'] = _order;
          await this.insertOrder(_body);
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
          if (item.devolution > 0) {
            dataItem = {
              id: 0,
              tb_institution_id: body.Order.tb_institution_id,
              tb_order_id: body.Order.id,
              terminal: 0,
              tb_stock_list_id: body.StockSalesman.tb_stock_list_id,
              tb_product_id: item.tb_product_id,
              quantity: item.devolution,
              unit_value: item.unit_value,
              kind: 'Transfer',
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
            operation: "Transfer"
          };
          //Devolve o item do estoque do vendedor
          dataItem['tb_stock_list_id'] = body.StockSalesman.tb_stock_list_id;
          dataItem['direction'] = 'E';
          await stockStatement.insert(dataItem);
          //retira o item no estoque do cliente
          dataItem['tb_stock_list_id'] = body.StockCustomer.tb_stock_list_id;
          dataItem['direction'] = 'S';
          await stockStatement.insert(dataItem);

        };
        resolve("200");
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }
}
module.exports = OrderStockTransferController;