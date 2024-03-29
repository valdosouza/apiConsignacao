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
        .catch(error => {
          reject('orderStockTransfer.getNexNumber: ' + error);
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
          tb_stock_list_id_ori: body.order.tb_stock_list_id_ori,
          tb_stock_list_id_des: body.order.tb_stock_list_id_des,
        }

        this.create(dataOrder)
          .then(() => {
            resolve(body);
          })
      } catch (error) {
        reject("orderStockTransfer.insertOrder:" + error);
      }

    });
    return promise;
  }

  static async create(dataOrder) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        Tb.create(dataOrder)
          .then((data) => {
            resolve(data);
          })
      } catch (error) {
        reject('create' + error);
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
            kind: 'StockTransfer',
          };
          //Quanto o insert é mais complexo como getNext precisa do await no loop          
          await orderItem.insert(dataItem);
        };
        resolve("Items Adicionados");
      } catch (error) {
        reject("orderStockTransfer.insertOrderItem:" + error);
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
              reject("orderStockTransfer.insert:" + error);
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
        .catch(error => {
          reject("orderstocktransfer.getlist: " + error);
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
          if (data.length > 0) {
            resolve(data[0]);
          } else {
            resolve({ id: 0 });
          }
        })
        .catch(error => {
          reject('orderstocktransfer.get: ' + error);
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
        resultitems = dataItems;

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
        .then((data) => {
          resolve(data);
        })
        .catch(error => {
          reject("orderStockTransfer.updateOrder:" + error);
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
        reject("orderStockTransfer.updateOrderItem:" + error);
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
          reject("orderStockTransfer.update:" + error);
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
          reject("OrderStockTransfer.delete:" + error);
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
              tb_stock_list_id: 0,
              local: "web",
              kind: "Fechamento",
              dt_record: body.dt_record,
              direction: "S",
              tb_merchandise_id: item.tb_product_id,
              quantity: item.quantity,
              operation: "StockTransfer"
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
      } catch (error) {
        reject(error);
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
              operation: "StockTransfer"
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
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }



  static async saveDevolutionByCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var qtde = 0;
        for (var item of body.items) {
          qtde += item.devolution;
        }
        if (qtde > 0) {
          body.order['number'] = 0;
          //Inverter direção do estoque por que o cliente vai devolver para o Vendedor
          var _order = {
            id: body.order.id,
            tb_institution_id: body.order.tb_institution_id,
            terminal: 0,
            number: body.order.number,
            tb_entity_id: body.order.tb_customer_id,
            dt_record: body.order.dt_record,
            tb_stock_list_id_ori: body.StockDestiny.tb_stock_list_id,//estoque invertiro devido a devolução
            tb_stock_list_id_des: body.StockOrigen.tb_stock_list_id,//estoque invertiro devido a devolução
          }
          body.order['tb_stock_list_id_ori'] = body.StockDestiny.tb_stock_list_id;//estoque invertiro devido a devolução
          body.order['tb_stock_list_id_des'] = body.StockOrigen.tb_stock_list_id;//estoque invertiro devido a devolução
          var _body = {};
          _body["order"] = _order;
          await this.insertOrder(_body);
          await this.insertOrderItemDevolutionByCard(body, "StockTransfer");
          await this.closurebyCard(body, "StockTransfer");
        }
        resolve(body);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }


  static async saveLoadCardByCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var qtde = 0;
        for (var item of body.items) {
          qtde += item.new_load;
        }
        if (qtde > 0) {
          var _order = {
            id: body.order.id,
            tb_institution_id: body.order.tb_institution_id,
            terminal: 0,
            number: body.order.number,
            tb_entity_id: body.order.tb_user_id,
            dt_record: body.order.dt_record,
            number: 0,
            tb_stock_list_id_ori: body.StockOrigen.tb_stock_list_id,
            tb_stock_list_id_des: body.StockDestiny.tb_stock_list_id,
          }
          body.order['tb_stock_list_id_ori'] = body.StockOrigen.tb_stock_list_id;
          body.order['tb_stock_list_id_des'] = body.StockDestiny.tb_stock_list_id;
          var _body = {};
          _body["order"] = _order;
          await this.insertOrder(_body);
          await this.insertOrderItemLoadCardByCard(body, "StockTransfer");
          await this.closurebyCard(body, "StockTransfer");
        }
        resolve(body);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  static async insertOrderItemDevolutionByCard(body, kind) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {};
        for (var item of body.items) {
          if (item.devolution > 0) {
            dataItem = {
              id: 0,
              tb_institution_id: body.order.tb_institution_id,
              tb_order_id: body.order.id,
              terminal: 0,
              tb_stock_list_id: body.order.tb_stock_list_id_ori,
              tb_product_id: item.tb_product_id,
              quantity: item.devolution,
              unit_value: item.unit_value,
              kind: kind,
            };
            //Quanto o insert é mais complexo como getNext precisa do await no loop          
            await orderItem.insert(dataItem);
          }
        };
        resolve("Items Adicionados");
      } catch (error) {
        reject("orderTransfer.insertOrderItem:" + error);
      }

    });
    return promise;
  }

  static async insertOrderItemLoadCardByCard(body, kind) {
    const promise = new Promise(async (resolve, reject) => {
      try {

        var dataItem = {};
        var quantity = 0;
        for (var item of body.items) {
          quantity = 0;
          if (item.new_load > 0) {
            dataItem = {
              id: 0,
              tb_institution_id: body.order.tb_institution_id,
              tb_order_id: body.order.id,
              terminal: 0,
              tb_stock_list_id: body.order.tb_stock_list_id_ori,
              tb_product_id: item.tb_product_id,
              quantity: item.new_load,
              unit_value: item.unit_value,
              kind: kind,
            };
            //Quanto o insert é mais complexo como getNext precisa do await no loop          
            await orderItem.insert(dataItem);
          }
        };
        resolve("Items Adicionados");
      } catch (error) {
        reject("orderTransfer.insertOrderItem:" + error);
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
          //Sempre Entra no Destino
          dataItem['tb_stock_list_id'] = body.order.tb_stock_list_id_des;
          dataItem['direction'] = 'E';
          await stockStatement.insert(dataItem);

        };
        await order.updateStatus(body.order.tb_institution_id, body.order.id, 'F');
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
        reject('orderStockTransfer.cleanUp ' + error);
      }
    });
    return promise;
  }
}
module.exports = OrderStockTransferController;