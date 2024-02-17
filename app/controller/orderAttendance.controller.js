const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderattendance;
const OrderController = require("../controller/order.controller.js");
const ControllerOrderBonus = require("../controller/orderBonus.controller.js");
const ControllerOrderConsignment = require("../controller/orderConsignment.controller.js");
const ControllerOrderItemConsignment = require("../controller/orderItemConsignment.controller.js");
const ControllerOrderConsignmentCard = require("../controller/orderConsignmentCard.controller.js");
const ControllerOrdeItem = require("../controller/orderItem.controller.js");
const ControllerOrderPaid = require("../controller/orderPaid.controller.js");
const ControllerOrderSale = require("../controller/orderSale.controller.js");
const OrderItemSale = require('../controller/orderItemSale.controller.js');
const ControllerOrderSaleCard = require("../controller/orderSaleCard.controller.js");
const ControllerOrderStockAdjust = require("../controller/orderStockAdjust.controller.js");
const ControllerOrderStockTransfer = require("../controller/orderStockTransfer.controller.js");
const OrderItemStockTransfer = require('../controller/orderItemStockTransfer.controller.js');
const ControllerStockStatement = require("../controller/stockStatement.controller.js");
const ControllerFinancial = require("../controller/financial.controller.js");
const SalesRouteCustomerController = require('../controller/salesRouteCustomer.controller.js');
const SalesRouteController = require("../controller/salesRoute.controller.js");


class OrderAttendanceController extends Base {
  static async getNextNumber(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(number) lastNumber ' +
        'from tb_order_attendance ' +
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
          reject('orderAttendance.getNexNumber: ' + error);
        });
    });
    return promise;
  }

  static async getById(id, tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_order_attendance ' +
        'where ( id =?) ' +
        ' and (tb_institution_id =?)',
        {
          replacements: [id, tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            resolve(data[0]);
          } else {
            resolve({ 'id': 0 });
          }
        })
        .catch(error => {
          reject('getById: ' + error);
        });
    });
    return promise;
  };

  static async getNotFinished(body) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ora.* ' +
        'from tb_order_attendance ora ' +
        '  inner join tb_order ord ' +
        '  on (ord.id = ora.id) ' +
        '    and (ord.tb_institution_id = ora.tb_institution_id) ' +
        'where ora.tb_institution_id = ? ' +
        'and ora.tb_salesman_id = ? ' +
        'and ord.dt_record = ? ' +
        'and ora.tb_customer_id = ? ' +
        'and ora.finished = ? ' +
        'order by ora.id ',
        {
          replacements: [body.tb_institution_id, body.tb_salesman_id, body.dt_record, body.tb_customer_id, 'N'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            resolve(data[0]);
          } else {
            resolve({ id: 0 });
          }
        })
        .catch(error => {
          reject('orderAttendance.getNexNumber: ' + error);
        });
    });
    return promise;
  }

  static async cleanUp(tb_institution_id, id) {
    const promise = new Promise(async (resolve, reject) => {
      try {

        //01 - tb_order_bonus;
        await ControllerOrderBonus.cleanUp(tb_institution_id, id);
        //02 - tb_order_consignment
        await ControllerOrderConsignment.cleanUp(tb_institution_id, id);
        //03 - tb_order_consignment_card
        await ControllerOrderConsignmentCard.cleanUp(tb_institution_id, id);
        //04 - tb_order_item
        await ControllerOrdeItem.cleanUp(tb_institution_id, id);
        //05 - tb_order_paid      
        await ControllerOrderPaid.cleanUp(tb_institution_id, id);
        //06 - tb_order_sale
        await ControllerOrderSale.cleanUp(tb_institution_id, id);
        //07 - tb_order_sale_card
        await ControllerOrderSaleCard.cleanUp(tb_institution_id, id);
        //08 - tb_order_stock_adjust
        await ControllerOrderStockAdjust.cleanUp(tb_institution_id, id);
        //09 - tb_order_stocktransfer
        await ControllerOrderStockTransfer.cleanUp(tb_institution_id, id);
        //10 - tb_stock_statement
        await ControllerStockStatement.cleanUp(tb_institution_id, id);
        //11 - financial
        await ControllerFinancial.cleanUp(tb_institution_id, id);
        resolve(`CleanUp executado com sucesso`)
      } catch (error) {
        reject(`orderAttendance.clean:${error}`)
      }
    });
    return promise;
  }

  static async insertOrder(body) {
    const promise = new Promise(async (resolve, reject) => {

      if ((body.number == 0) || (body.number == null))
        body.number = await this.getNextNumber(body.tb_institution_id);

      const dataOrder = {
        id: body.id,
        tb_institution_id: body.tb_institution_id,
        terminal: 0,
        number: body.number,
        tb_salesman_id: body.tb_salesman_id,
        tb_customer_id: body.tb_customer_id,
        tb_price_list_id: body.tb_price_list_id,
        visited: body.visited,
        charged: body.charged,
        finished: body.finished,
        longitude: body.longitude,
        latitude: body.latitude
      }
      Tb.create(dataOrder)
        .then(() => {
          resolve(body);
        })
        .catch(error => {
          reject("orderAttendance.insertOrder:" + error);
        });
    });
    return promise;
  }


  static async insert(body) {
    const promise = new Promise(async (resolve, reject) => {
      const dataOrder = {
        id: 0,
        tb_institution_id: body.tb_institution_id,
        terminal: 0,
        tb_user_id: body.tb_user_id,
        dt_record: body.dt_record,
        note: body.note
      }
      OrderController.insert(dataOrder)
        .then(async (data) => {
          body.id = data.id;
          this.insertOrder(body)
            .then(() => {
              resolve(body);
            })
            .catch(error => {
              reject("orderAttendance.insert:" + error);
            });
        })
    });
    return promise;
  }

  static getList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select ' +
        '  oat.id, ' +
        '  oat.tb_institution_id, ' +
        '  ord.tb_user_id, ' +
        '  oat.tb_customer_id, ' +
        '  etc.name_company name_customer, ' +
        '  tb_price_list_id, ' +
        '  oat.tb_salesman_id, ' +
        '  ets.name_company name_salesman, ' +
        '  ord.dt_record, ' +
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note, ' +
        '  ord.status, ' +
        '  oat.visited, ' +
        '  oat.charged, ' +
        '  oat.latitude, ' +
        '  oat.longitude ' +
        'from tb_order_attendance  oat ' +
        '   inner join tb_order ord ' +
        '   on (ord.id = oat.id) ' +
        '     and (ord.tb_institution_id = oat.tb_institution_id) ' +
        '   inner join tb_entity etc ' +
        '   on (etc.id = oat.tb_customer_id) ' +
        '   inner join tb_entity ets ' +
        '   on (ets.id = oat.tb_salesman_id)  ' +
        'where (ord.tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(error => {
          reject("orderattendance.getlist: " + error);
        });
    });
    return promise;
  }

  static getOrder(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select  ' +
        '  ord.id, ' +
        '  ord.tb_institution_id, ' +
        '  ord.status ' +
        'from tb_order ord  ' +
        'where (ord.tb_institution_id =? ) ' +
        ' and (ord.id =? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(error => {
          reject('orderattendance.get: ' + error);
        });
    });
    return promise;
  }

  static get = (tb_institution_id, id) => {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select ' +
        '  oat.id, ' +
        '  oat.tb_institution_id, ' +
        '  ord.tb_user_id, ' +
        '  oat.tb_customer_id, ' +
        '  etc.name_company name_customer, ' +
        ' tb_price_list_id,' +
        '  oat.tb_salesman_id, ' +
        '  ets.name_company name_salesman, ' +
        '  ord.dt_record, ' +
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note, ' +
        '  ord.status, ' +
        '  oat.visited, ' +
        '  oat.charged, ' +
        '  oat.latitude, ' +
        '  oat.longitude ' +
        'from tb_order_attendance  oat ' +
        '   inner join tb_order ord ' +
        '   on (ord.id = oat.id) ' +
        '     and (ord.tb_institution_id = oat.tb_institution_id) ' +
        '   inner join tb_entity etc ' +
        '   on (etc.id = oat.tb_customer_id) ' +
        '   inner join tb_entity ets ' +
        '   on (ets.id = oat.tb_salesman_id)  ' +
        'where (ord.tb_institution_id =? ) ' +
        ' and ( oat.id =? )',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(error => {
          reject('orderattendance.get: ' + error);
        });
    });
    return promise;
  }

  static async updateOrder(body) {
    const promise = new Promise(async (resolve, reject) => {
      const dataOrder = {
        number: body.number,
        visited: body.visited,
        charged: body.charged,
        longitude: body.longitude,
        latitude: body.latitude
      };
      if ((body.number == 0) || (body.number == null))
        body.number = await this.getNextNumber(body.tb_institution_id);
      Tb.update(dataOrder, {
        where: {
          id: body.id,
          tb_institution_id: body.tb_institution_id,
          terminal: 0,
          tb_salesman_id: body.tb_salesman_id
        }
      })
        .catch(error => {
          reject("orderAttendance.updateOrder:" + error);
        });
    });
    return promise;
  }

  static async update(body) {
    const promise = new Promise(async (resolve, reject) => {
      const dataOrder = {
        id: body.id,
        tb_institution_id: body.tb_institution_id,
        terminal: 0,
        tb_user_id: body.tb_user_id,
        note: body.note
      }
      OrderController.update(dataOrder)
        .then(() => {
          this.updateOrder(body)
            .then(() => {
              resolve(body);
            })
          resolve(body);
        })
        .catch(error => {
          reject("orderAttendance.update:" + error);
        });
    });
    return promise;
  }

  static async finished(body) {
    const promise = new Promise(async (resolve, reject) => {
      if (body.order.recall == "S") {
        await OrderController.updateNote(body.order.tb_institution_id, body.order.id, body.order.note);
        await SalesRouteController.setRecall(body);
      }


      Tb.update({
        recall: body.order.recall,
        finished: "S"
      }, {
        where: {
          id: body.order.id,
          tb_institution_id: body.order.tb_institution_id,
          terminal: 0
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(error => {
          reject("orderAttendance.finished:" + error);
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
          .catch(error => {
              reject("Erro:"+ error);
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
          await OrderController.updateStatus(body.tb_institution_id, body.id, 'F');
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
          await OrderController.updateStatus(body.tb_institution_id, body.id, 'A');
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

  static async detaild(tb_institution_id, tb_order_id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataResult = {};
        var orderAttendance = await this.getById(tb_order_id, tb_institution_id);
        dataResult['attendace'] = orderAttendance;

        var orderConsignmentCheckPoint = await ControllerOrderConsignment.getById(tb_order_id, tb_institution_id, 'checkpoint');
        if (orderConsignmentCheckPoint.id > 0) {
          dataResult['consignment_checkpoint'] = orderConsignmentCheckPoint;

          var orcCheckItems = await ControllerOrderItemConsignment.getList(tb_institution_id, tb_order_id, 'checkpoint', 'Sale');
          dataResult['consignment_checkpoint']['items'] = orcCheckItems;
        }

        var orderConsignmentSupplying = await ControllerOrderConsignment.getById(tb_order_id, tb_institution_id, 'supplying');
        if (orderConsignmentSupplying.id > 0) {
          dataResult['consignment_supplying'] = orderConsignmentSupplying;
          var orcSupplyItems = await ControllerOrderItemConsignment.getList(tb_institution_id, tb_order_id, 'supplying', 'Consignment');
          dataResult['consignment_supplying']['items'] = orcSupplyItems;
        }

        var orderSale = await ControllerOrderSale.getOrder(tb_institution_id, tb_order_id);
        if (orderSale.id > 0) {
          dataResult['sale'] = orderSale;
          var orsItems = await OrderItemSale.getList(tb_institution_id, tb_order_id);
          dataResult['sale']['items'] = orsItems;
        }

        var orderStockTransfer = await ControllerOrderStockTransfer.getOrder(tb_institution_id, tb_order_id);
        if (orderStockTransfer.id > 0) {
          dataResult['stock_transfer'] = orderStockTransfer;
          var orsItems = await OrderItemStockTransfer.getList(tb_institution_id, tb_order_id);
          dataResult['stock_transfer']['items'] = orsItems;
        }

        var stockStatement = await ControllerStockStatement.getListByOrder(tb_institution_id, tb_order_id);
        dataResult['stock_statement'] = stockStatement;

        resolve(dataResult);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }
}
module.exports = OrderAttendanceController;