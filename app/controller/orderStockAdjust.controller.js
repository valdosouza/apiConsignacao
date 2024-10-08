const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderstockadjust;
const order = require('./order.controller.js');
const orderItem = require('./orderItemStockAdjust.controller.js');
const stockStatement = require('./stockStatement.controller.js');

class OrderStockAdjustController extends Base {
  static async getNextNumber(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(number) lastNumber ' +
        'from tb_order_stock_adjust ' +
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
        .catch(error => {
          reject('orderStockAdjust.getNexNumber: ' + error);
        });
    });
    return promise;
  }

  static async insertOrder(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (body.order.number == 0)
          body.order.number = await this.getNextNumber(body.order.tb_institution_id);

        const dataOrder = {
          id: body.order.id,
          tb_institution_id: body.order.tb_institution_id,
          terminal: 0,
          number: body.order.number,
          tb_entity_id: body.order.tb_entity_id,
          direction: body.order.direction
        }
        
        Tb.create(dataOrder)
          .then(() => {
            resolve(body);
          })

      } catch (error) {
        reject("orderStockAdjust.insertOrder:" + error);
      }
    });
    return promise;
  }

  static async insertOrderItem(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {};
        for (var item of body.items) {
          dataItem = {
            id: 0,
            tb_institution_id: body.order.tb_institution_id,
            tb_order_id: body.order.id,
            terminal: 0,
            tb_stock_list_id: item.tb_stock_list_id,
            tb_product_id: item.tb_product_id,
            quantity: item.quantity,
            unit_value: item.unit_value,
            kind: 'StockAdjustment',
          };
          //Quanto o insert é mais complexo como getNext precisa do await no loop          
          await orderItem.insert(dataItem);
        };
        resolve("Items Adicionados");
      } catch (error) {
        reject("orderStockAdjust.insertOrderItem:" + error);
      }

    });
    return promise;
  }

  static async insert(body) {
    const promise = new Promise(async (resolve, reject) => {
      const dataOrder = {
        id: 0,
        tb_institution_id: body.order.tb_institution_id,
        terminal: 0,
        tb_user_id: body.order.tb_user_id,
        dt_record: body.order.dt_record,
        note: body.order.note
      }
      order.insert(dataOrder)
        .then(async (data) => {
          body.order.id = data.id;
          this.insertOrder(body)
            .then(() => {
              this.insertOrderItem(body)
                .then(() => {
                  resolve(body);
                })
            })
            .catch(error => {
              reject("orderStockAdjust.insert:" + error);
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
        '  ora.tb_entity_id,' +
        '  etd.name_company name_entity,' +
        '  ord.dt_record, ' +
        '  ora.number, ' +
        '  ord.status, ' +
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note ' +
        'from tb_order ord  ' +
        '   inner join tb_order_stock_adjust ora ' +
        '   on (ora.id = ord.id)  ' +
        '     and (ora.tb_institution_id = ord.tb_institution_id) ' +
        '     and (ora.terminal = ord.terminal) ' +
        '   inner join tb_entity etd ' +
        '   on (etd.id = ora.tb_entity_id)  ' +
        'where (ord.tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);

        })
        .catch(error => {
          reject("orderstockadjust.getlist: " + error);
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
        '  ora.tb_entity_id,' +
        '  etd.name_company name_entity,' +
        '  ord.dt_record, ' +
        '  ora.direction,' +
        '  ora.number, ' +
        '  ord.status, ' +
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note ' +
        'from tb_order ord  ' +
        '   inner join tb_order_stock_adjust ora ' +
        '   on (ora.id = ord.id)  ' +
        '     and (ora.tb_institution_id = ord.tb_institution_id) ' +
        '     and (ora.terminal = ord.terminal) ' +
        '   inner join tb_entity etd ' +
        '   on (etd.id = ora.tb_entity_id)  ' +
        'where (ord.tb_institution_id =? ) ' +
        ' and (ord.id =? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(error => {
          reject('orderstockadjust.get: ' + error);
        });
    });
    return promise;
  }

  static async getStatus(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select ' +
        '  ord.status ' +
        'from tb_order ord  ' +
        '   inner join tb_order_stock_adjust ora ' +
        '   on (ora.id = ord.id)  ' +
        '     and (ora.tb_institution_id = ord.tb_institution_id) ' +
        '     and (ora.terminal = ord.terminal) ' +
        '   inner join tb_entity etd ' +
        '   on (etd.id = ora.tb_entity_id)  ' +
        'where (ord.tb_institution_id =? ) ' +
        ' and (ord.id =? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0].status);
        })
        .catch(error => {
          reject('orderstockadjust.getStatus: ' + error);
        });
    });
    return promise;
  }

  static get = (tb_institution_id, id) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var result = {};
        const dataOrder = await this.getOrder(tb_institution_id, id);
        result.order = dataOrder;
        const dataItems = await orderItem.getList(tb_institution_id, id);
        result.items = dataItems;

        resolve(result);
      }
      catch (error) {
        reject('collaborator.get: ' + error);
      }
    });
    return promise;
  }

  static async updateOrder(body) {
    const promise = new Promise(async (resolve, reject) => {
      const dataOrderStockAdjust = {
        id: body.order.id,
        tb_institution_id: body.order.tb_institution_id,
        terminal: 0,
        tb_user_id: body.order.tb_user_id,
        dt_record: body.order.dt_record,
        note: body.order.note
      }
      Tb.update(dataOrderStockAdjust, {
        where: {
          id: dataOrderStockAdjust.id,
          tb_institution_id: dataOrderStockAdjust.tb_institution_id,
          terminal: dataOrderStockAdjust.terminal
        }

      })
        .then(() => {
          resolve(dataOrderStockAdjust);
        })
        .catch(error => {
          reject("orderStockAdjust.updateOrder:" + error);
        });
    });
    return promise;
  }

  static async updateOrderItem(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {};
        for (var item of body.items) {
          dataItem = {
            id: item.id,
            tb_institution_id: body.order.tb_institution_id,
            tb_order_id: body.order.id,
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
      } catch (error) {
        reject("orderStockAdjust.updateOrderItem:" + error);
      }

    });
    return promise;
  }

  static async update(body) {
    const promise = new Promise((resolve, reject) => {
      const dataOrder = {
        id: body.order.id,
        tb_institution_id: body.order.tb_institution_id,
        terminal: 0,
        tb_user_id: body.order.tb_user_id,
        dt_record: body.order.dt_record,
        note: body.order.note
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
        .catch(error => {
          reject("orderStockAdjust.update:" + error);
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
          reject("OrderStockAdjust.delete:" + error);
        });
    });
    return promise;
  }

  static async closure(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var status = await this.getStatus(body.tb_institution_id, body.id);
        if (status == 'A') {
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
              direction: body.direction,
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "Ajuste"
            };
            //Quanto o insert é mais complexo como create precisa do await no loop          
            await stockStatement.insert(dataItem);
          };
          await order.updateStatus(body.tb_institution_id, body.id, 'F');
          resolve("200");
        } else {
          resolve("201");
        }
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  static async reopen(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var status = await this.getStatus(body.tb_institution_id, body.id);
        if (status == 'F') {
          var items = await orderItem.getList(body.tb_institution_id, body.id);
          var direction = 'S';
          if (body.direction == 'S') {
            direction = 'E'
          }
          else {
            direction = 'S'
          };
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
              kind: "Reabertura",
              dt_record: body.dt_record,
              direction: direction,
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "Ajuste"
            };
            //Quanto o insert é mais complexo como create precisa do await no loop          
            await stockStatement.insert(dataItem);
          };
          await order.updateStatus(body.tb_institution_id, body.id, 'A');
          resolve("200");
        } else {
          resolve("201");
        }

      } catch (error) {
        reject(error);
      }

    });
    return promise;
  }

  static async saveByCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var qtde = 0;
        for (var item of body.items) {
          qtde += item.adjust;
        }
        /*
          Aqui muito cuidado por que o estoque é invertido mesmo...
          O ajuste é uma devolução do vendedor que deve sair do Estoque do vendedor
          Mas como temos outra operação de transferencia onde o esoque fabrica é a origem e o vendedor é o destino.
          Precisamos aqui informar que o estoque vendedor é a origem para que o produto seja retirado do estoque dele.
        */
        if (qtde > 0) {
          var _order = {
            id: body.order.id,
            tb_institution_id: body.order.tb_institution_id,
            terminal: 0,
            number: 0,
            tb_entity_id: body.order.tb_entity_id,
            dt_record: body.order.dt_record,
            tb_stock_list_id_ori: body.StockDestiny.tb_stock_list_id,
            tb_stock_list_id_des: body.StockOrigen.tb_stock_list_id,
            direction: body.order.direction,
          }

          body.order['tb_stock_list_id_ori'] = body.StockDestiny.tb_stock_list_id;
          body.order['tb_stock_list_id_des'] = body.StockOrigen.tb_stock_list_id;
          var _body = {};
          _body["order"] = _order;
          await this.insertOrder(_body);
          await this.insertOrderItemByCard(body, "StockAdjustment");

          await this.closurebyCard(body, "StockAdjustment");
        }
        resolve(body);
      } catch (error) {
        reject(error);
      }


    });
    return promise;
  }

  static async insertOrderItemByCard(body, kind) {
    const promise = new Promise(async (resolve, reject) => {
      try {

        var dataItem = {};
        var quantity = 0;
        for (var item of body.items) {
          quantity = 0;
          if (item.adjust > 0) {
            quantity = item.adjust

            if (quantity > 0) {
              dataItem = {
                id: 0,
                tb_institution_id: body.order.tb_institution_id,
                tb_order_id: body.order.id,
                terminal: 0,
                tb_stock_list_id: body.order.tb_stock_list_id_des,
                tb_product_id: item.tb_product_id,
                quantity: item.adjust,
                unit_value: 0,
                kind: kind,
              };
              //Quanto o insert é mais complexo como getNext precisa do await no loop          
              await orderItem.insert(dataItem);
            };
          }
        };
        resolve("Items Adicionados");
      } catch (error) {
        reject("orderStockAdjust.insertOrderItemByCard:" + error);
      }

    });
    return promise;
  }

  static async closurebyCard(body, operation) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var items = await orderItem.getList(body.order.tb_institution_id, body.order.id);
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
            dt_record: body.order.dt_record,
            direction: "S",
            tb_merchandise_id: item.tb_product_id,
            quantity: item.quantity,
            operation: operation,
          };
          //Sempre sai da Origem 
          dataItem['tb_stock_list_id'] = body.order.tb_stock_list_id_ori;
          dataItem['direction'] = 'S';
          await stockStatement.insert(dataItem);
        };
        resolve("200");
      } catch (error) {
        reject(error);
      }
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
        reject('orderStockadjust.cleanUp ' + error);
      }
    });
    return promise;
  }
}
module.exports = OrderStockAdjustController;