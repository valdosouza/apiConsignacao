const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderconsignment;
const orderController = require('./order.controller.js');
const consignmentCard = require('./orderConsignmentCard.controller.js');
const orderPaid = require('./orderPaid.controller.js');
const { entity } = require('../model');
const entityController = require('./entity.controller.js');
const orderItem = require('./orderItemConsignment.controller.js');
const stockStatement = require('./stockStatement.controller.js');
const ControllerOrderConsignmentCard = require("../controller/orderConsignmentCard.controller.js");
const ControllerOrderPaid = require("../controller/orderPaid.controller.js");
const ControllerOrderBonus = require("../controller/orderBonus.controller.js");
const ControllerOrderItemConsignment = require("../controller/orderItemConsignment.controller.js");
const ControllerOrdeItem = require("../controller/orderItem.controller.js");
const ControllerOrderSale = require("../controller/orderSale.controller.js");
const OrderItemSale = require('./orderItemSale.controller.js');
const ControllerOrderSaleCard = require("../controller/orderSaleCard.controller.js");
const ControllerOrderStockAdjust = require("../controller/orderStockAdjust.controller.js");
const ControllerOrderStockTransfer = require("../controller/orderStockTransfer.controller.js");
const OrderItemStockTransfer = require('./orderItemStockTransfer.controller.js');
const ControllerStockStatement = require("../controller/stockStatement.controller.js");
const ControllerFinancial = require("../controller/financial.controller.js");
const SalesRouteCustomerController = require('./salesRouteCustomer.controller.js');
const SalesRouteController = require("../controller/salesRoute.controller.js");




class OrderConsignmentController extends Base {
  static async getById(id, tb_institution_id, kind) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_order_consignment ' +
        'where ( id =?) ' +
        ' and (tb_institution_id =?)' +
        ' and (kind = ?) ',
        {
          replacements: [id, tb_institution_id, kind],
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

  static async getDividaVelhaBySalesman(tb_institution_id, tb_salesman_id, tb_customer_id, dt_record, tb_order_id) {
    const promise = new Promise((resolve, reject) => {
      var sqltxt =
        'select sum(current_debit_balance) dividaVelha ' +
        'from ( ' +
        'SELECT DISTINCT orc.tb_customer_id, orc.current_debit_balance, orc.id,orc.dt_record ' +
        'FROM tb_order_consignment orc ' +
        '   inner join tb_order ord ' +
        '   on (ord.id = orc.id) ' +
        '   and (ord.tb_institution_id = orc.tb_institution_id) ' +
        'WHERE orc.id = ( ' +
        '        SELECT MAX(orca.id)  ' +
        '        FROM tb_order_consignment orca ' +
        '         inner join tb_order orda ' +
        '         on (orda.id = orca.id) ' +
        '         and (orda.tb_institution_id = orca.tb_institution_id) ' +
        '        WHERE ( orca.tb_institution_id = orc.tb_institution_id ) ' +
        '        and ( orca.tb_customer_id = orc.tb_customer_id ) ' +
        '        and ( orda.tb_user_id = ord.tb_user_id ) ' +
        '        and (orda.dt_record < ?) ';

      if (tb_order_id == 0) {
        sqltxt = sqltxt + ' and (orca.id <> ?) ';
      } else {
        sqltxt = sqltxt + ' and (orca.id = ?) ';
      }

      if (tb_customer_id == 0) {
        sqltxt = sqltxt + ' and (orca.tb_customer_id <> ?) ' +
          ' GROUP BY orda.tb_user_id ';
      } else {
        sqltxt = sqltxt + ' and (orca.tb_customer_id = ?) ' +
          ' GROUP BY orca.tb_customer_id ';
      }



      sqltxt = sqltxt +
        ') and (orc.tb_institution_id = ?) ' +
        '  and (ord.tb_user_id = ?) ' +
        '  and orc.current_debit_balance > 0  ' +
        '  and (orc.kind = ? ) ' +
        ') current_debit_balance ';

      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [dt_record, tb_order_id, tb_customer_id, tb_institution_id, tb_salesman_id, 'supplying'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve({
            description: "Dívida velha",
            tag_value: Number(data[0].dividaVelha),
            kind: "totais",
            color: "red",
          },);
        })
        .catch(error => {
          reject('getDividaVelhaBySalesman: ' + error);
        });
    });
    return promise;
  };


  static async getDividaVelhaBySalesmanDetailed(body) {
    const promise = new Promise((resolve, reject) => {
      var sqlCustomerList = '';
      sqlCustomerList = sqlCustomerList.concat(
        'select ctm.id ',
        'from tb_customer ctm ',
        '    inner join tb_region rgn ',
        '    on (rgn.id = ctm.tb_region_id  ) ',
        'where (ctm.tb_institution_id = ord.tb_institution_id)  ',

      );
      if (body.tb_salesman_id > 0) {
        sqlCustomerList = sqlCustomerList.concat(
          '   and (rgn.tb_salesman_id = ?) '
        );
      } else {
        sqlCustomerList = sqlCustomerList.concat(
          '   and (rgn.tb_salesman_id <> ?) '
        )
      }      
      var sqlMaxOrder = '';
      sqlMaxOrder = sqlMaxOrder.concat(
        'SELECT MAX(orca.id) ',
        'FROM tb_order_consignment orca ',
        '    inner join tb_order orda ',
        '    on (orda.id = orca.id) ',
        '        and (orda.tb_institution_id = orca.tb_institution_id) ',
        'WHERE ( orca.tb_institution_id = orc.tb_institution_id )  ',
        '    and ( orca.tb_customer_id = orc.tb_customer_id )  ',
        'GROUP BY orca.tb_customer_id '
      );
      var sqlTxt = '';
      sqlTxt = sqlTxt.concat(
        'SELECT DISTINCT orc.tb_customer_id, etd.nick_trade name_customer, orc.tb_institution_id, orc.current_debit_balance ',
        'FROM tb_order_consignment orc ',
        '    inner join tb_order ord ',
        '    on (ord.id = orc.id) ',
        '        and (ord.tb_institution_id = orc.tb_institution_id) ',
        '    inner join tb_entity etd ',
        '    on (etd.id = orc.tb_customer_id) ',
        'WHERE orc.id = (', sqlMaxOrder, ')',
        '    and (orc.tb_institution_id = ?)  ',
        '    and (orc.current_debit_balance > 0)  ',
        '    and (orc.kind = ? )  ',
        '    and (orc.tb_customer_id in (', sqlCustomerList, '))');

      if (body.name_customer.length > 0) {
        sqlTxt = sqlTxt.concat(
          ' and (etd.nick_trade like "%', body.name_customer, '%")'
        );
      }

      sqlTxt = sqlTxt.concat(
        'order by 2 ',
        ' limit ', ((body.page - 1) * 20), ',20 '
      );

      Tb.sequelize.query(
        sqlTxt,
        {
          replacements: [body.tb_institution_id, 'supplying', body.tb_salesman_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          var dataResult = [];
          for (var item of data) {
            dataResult.push({
              dt_record: item.dt_record,
              tb_customer_id: item.tb_customer_id,
              name_customer: item.name_customer,
              current_debit_balance: Number(item.current_debit_balance),
            });
          }
          resolve(dataResult);
        })
        .catch(error => {
          reject('getDividaVelhaBySalesmanDetailed: ' + error);
        });
    });
    return promise;
  };


  static async getDividaVelhaByDay(tb_institution_id, tb_salesman_id, dt_record) {
    const promise = new Promise((resolve, reject) => {

      var sqltxt =
        'select sum(current_debit_balance) dividaVelha ' +
        'from ( ' +
        '    SELECT DISTINCT orc.tb_customer_id, orc.tb_institution_id, orc.current_debit_balance, orc.id,orc.dt_record  ' +
        '    FROM tb_order_consignment orc ' +
        '        inner join tb_order ord ' +
        '        on (ord.id = orc.id)  ' +
        '            and (ord.tb_institution_id = orc.tb_institution_id)  ' +
        '    WHERE orc.id = ( ' +
        '                    SELECT MAX(orca.id) ' +
        '                    FROM tb_order_consignment orca ' +
        '                        inner join tb_order orda ' +
        '                        on (orda.id = orca.id) ' +
        '                            and (orda.tb_institution_id = orca.tb_institution_id) ' +
        '                    WHERE ( orca.tb_institution_id = orc.tb_institution_id ) ' +
        '                        and ( orca.tb_customer_id = orc.tb_customer_id ) ' +
        '                        and (orda.dt_record < ? ) ' +
        '                    GROUP BY orca.tb_customer_id  ' +
        '                    ) ' +
        '    and (orc.tb_institution_id = ?) ' +
        '    and orc.current_debit_balance > 0  ' +
        '    and (orc.kind = ? ) ' +
        '                        and (orc.tb_customer_id in ( ' +
        '                                                      select tb_customer_id ' +
        '                                                      from tb_order_attendance oat ' +
        '                                                          inner join tb_order ord  ' +
        '                                                          on (ord.id = oat.id)  ' +
        '                                                              and (ord.tb_institution_id = oat.tb_institution_id) ' +
        '                                                      where oat.tb_institution_id = ?  ' +
        '                                                            and ord.dt_record = ?  ';
      if (tb_salesman_id == 0) {
        sqltxt = sqltxt + ' and (ord.tb_user_id <> ?) ';
      } else {
        sqltxt = sqltxt + ' and (ord.tb_user_id = ?)  ';
      };

      sqltxt = sqltxt +
        '                                                      ))  ' +
        ') current_debit_balance  ';

      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [dt_record, tb_institution_id, 'supplying', tb_institution_id, dt_record, tb_salesman_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve({
            description: "Dívida velha",
            tag_value: Number(data[0].dividaVelha),
            kind: "totais",
            color: "red",
          },);
        })
        .catch(error => {
          reject('getDividaVelhaByDay: ' + error);
        });
    });
    return promise;
  };


  static async getDividaVelhaByCustomer(tb_institution_id, tb_customer_id, dt_record) {
    const promise = new Promise((resolve, reject) => {

      var sqltxt =
        'select sum(current_debit_balance) dividaVelha ' +
        'from ( ' +
        '    SELECT DISTINCT orc.tb_customer_id, orc.current_debit_balance, orc.id,orc.dt_record ' +
        '    FROM tb_order_consignment orc ' +
        '        inner join tb_order ord  ' +
        '        on (ord.id = orc.id)  ' +
        '          and (ord.tb_institution_id = orc.tb_institution_id)  ' +
        '    WHERE orc.id is not null ' +
        '      and orc.id in (  ' +
        '            SELECT MAX(orca.id) ' +
        '            FROM tb_order_consignment orca ' +
        '              inner join tb_order orda  ' +
        '              on (orda.id = orca.id) ' +
        '                and (orda.tb_institution_id = orca.tb_institution_id)  ' +
        '            WHERE ( orca.tb_institution_id = orc.tb_institution_id ) ' +
        '              and ( orca.tb_customer_id = orc.tb_customer_id )  ' +
        '            GROUP BY orca.tb_customer_id )  ' +
        '      and (orc.tb_institution_id = ?)  ' +
        '      and (orc.tb_customer_id = ?)   ' +
        '      and orc.current_debit_balance > 0 ' +
        '      and (orc.kind = ? )  ' +
        ') current_debit_balance  ';

      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [tb_institution_id, tb_customer_id, 'supplying'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve({
            description: "Dívida velha",
            tag_value: Number(data[0].dividaVelha),
            kind: "totais",
            color: "red",
          },);
        })
        .catch(error => {
          reject('getDividaVelhaByCustomer: ' + error);
        });
    });
    return promise;
  };

  static async getDividaVelhaByOrder(tb_institution_id, tb_customer_id, tb_order_id) {
    const promise = new Promise((resolve, reject) => {

      var sqltxt =
        'select sum(current_debit_balance) dividaVelha ' +
        'from (    ' +
        '    SELECT DISTINCT orc.tb_customer_id, orc.current_debit_balance, orc.id,orc.dt_record     ' +
        '    FROM tb_order_consignment orc  ' +
        '        inner join tb_order ord   ' +
        '        on (ord.id = orc.id)   ' +
        '          and (ord.tb_institution_id = orc.tb_institution_id)   ' +
        '    WHERE orc.id is not null       ' +
        '      and orc.id in (  ' +
        '            SELECT MAX(orca.id)    ' +
        '            FROM tb_order_consignment orca   ' +
        '              inner join tb_order orda    ' +
        '              on (orda.id = orca.id)    ' +
        '                and (orda.tb_institution_id = orca.tb_institution_id)    ' +
        '            WHERE ( orca.tb_institution_id = ? )    ' +
        '              and ( orca.tb_customer_id = ? )    ' +
        '              and ( orca.id < ?) ' +
        '              and (orca.kind = ? )    ' +
        '            GROUP BY orca.tb_customer_id  ' +
        '            ) ' +
        ') current_debit_balance ';

      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [tb_institution_id, tb_customer_id, tb_order_id, 'supplying'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve({
            description: "Dívida velha",
            tag_value: Number(data[0].dividaVelha),
            kind: "totais",
            color: "red",
          },);
        })
        .catch(error => {
          reject('getDividaVelhaByOrder: ' + error);
        });
    });
    return promise;
  };

  static async getSaldoDevedor(tb_institution_id, tb_salesman_id, dt_record) {
    const promise = new Promise((resolve, reject) => {
      var sqltxt =
        'select sum(current_debit_balance) saldoDevedor ' +
        'from ( ' +
        '    SELECT DISTINCT orc.tb_customer_id, orc.tb_institution_id, orc.current_debit_balance, orc.id,orc.dt_record  ' +
        '    FROM tb_order_consignment orc ' +
        '        inner join tb_order ord ' +
        '        on (ord.id = orc.id)  ' +
        '            and (ord.tb_institution_id = orc.tb_institution_id)  ' +
        '    WHERE orc.id = ( ' +
        'SELECT MAX(orca.id) ' +
        'FROM tb_order_consignment orca ' +
        '    inner join tb_order orda ' +
        '    on (orda.id = orca.id) ' +
        '        and (orda.tb_institution_id = orca.tb_institution_id) ' +
        'WHERE ( orca.tb_institution_id = orc.tb_institution_id ) ' +
        '    and ( orca.tb_customer_id = orc.tb_customer_id ) ' +
        '    and (orda.dt_record <= ? ) ' +
        'GROUP BY orca.tb_customer_id  ' +
        ') ' +
        '    and (orc.tb_institution_id = ?) ' +
        '    and orc.current_debit_balance > 0  ' +
        '    and (orc.kind = ? ) ' +
        '                        and (orc.tb_customer_id in ( ' +
        'select ctm.id ' +
        'from  tb_customer ctm ' +
        '  inner join tb_region rgn ' +
        '  on (rgn.id = ctm.tb_region_id) ' +
        'where rgn.tb_salesman_id = ? ' +
        '                                                      ))  ' +
        ') current_debit_balance  ';


      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [dt_record, tb_institution_id, 'supplying', tb_salesman_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve({
            description: "Saldo Devedor",
            tag_value: Number(data[0].saldoDevedor),
            kind: "totais",
            color: "red",
          },);
        })
        .catch(error => {
          reject('getSaldoDevedor: ' + error);
        });
    });
    return promise;
  };

  static async getDividaAtualBySalesman(tb_institution_id, tb_salesman_id, tb_customer_id, dt_record) {
    const promise = new Promise((resolve, reject) => {
      var sqltxt =
        'select sum(current_debit_balance) dividaAtual ' +
        'from ( ' +
        'SELECT DISTINCT orc.tb_customer_id, orc.current_debit_balance, orc.id,orc.dt_record ' +
        'FROM tb_order_consignment orc ' +
        '   inner join tb_order ord ' +
        '   on (ord.id = orc.id) ' +
        '   and (ord.tb_institution_id = orc.tb_institution_id) ' +
        'WHERE orc.id = ( ' +
        '        SELECT MAX(orc.id)  ' +
        '        FROM tb_order_consignment orca ' +
        '         inner join tb_order orda ' +
        '         on (orda.id = orca.id) ' +
        '         and (orda.tb_institution_id = orca.tb_institution_id) ' +
        '        WHERE ( orca.tb_institution_id = orc.tb_institution_id ) ' +
        '        and ( orca.tb_customer_id = orc.tb_customer_id ) ' +
        '        and ( orda.tb_user_id = ord.tb_user_id ) ' +
        '        and (orda.dt_record = ?) ';

      if (tb_customer_id == 0) {
        sqltxt = sqltxt + ' and (orca.tb_customer_id <> ?) ' +
          ' GROUP BY orda.tb_user_id ';
      } else {
        sqltxt = sqltxt + ' and (orca.tb_customer_id = ?) ' +
          ' GROUP BY orca.tb_customer_id ';
      }
      sqltxt = sqltxt +

        ') and (orc.tb_institution_id = ?) ' +
        '  and (ord.tb_user_id = ?) ' +
        ') current_debit_balance ';

      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [dt_record, tb_customer_id, tb_institution_id, tb_salesman_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve({
            description: "Dívida Atual",
            tag_value: Number(data[0].dividaAtual),
            kind: "totais",
            color: "red",
          },);
        })
        .catch(error => {
          reject('getById: ' + error);
        });
    });
    return promise;
  };


  static async saveCheckpoint(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        //Não salva tb_order por que já foi criado no attendance             
        var dataOrder = {
          id: body.order.id,
          tb_institution_id: body.order.tb_institution_id,
          terminal: 0,
          tb_customer_id: body.order.tb_customer_id,
          tb_salesman_id: body.order.tb_salesman_id,
          dt_record: body.order.dt_record,
          kind: "checkpoint",
          number: 0,
          total_value: body.order.total_value,
          change_value: body.order.change_value,
          previous_debit_balance: body.order.previous_debit_balance,
          current_debit_balance: body.order.current_debit_balance,
        };
        var dataRes = await this.getById(body.order.id, body.order.tb_institution_id, 'checkpoint');
        if (dataRes.id == 0) {
          await this.insert(dataOrder)
            .then(async () => {
              await this.insertCheckpointCard(body);
              await this.insertCheckpointPaid(body);
              resolve(body);
            })
        } else {
          await this.update(dataOrder)
            .then(async () => {
              resolve(body);
            })
        }
      } catch (error) {
        reject('OrderConsignmentController.saveCheckpoint: ' + error);
      }
    });
    return promise;
  }

  static async saveSupplying(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataOrder = {
          id: body.order.id,
          tb_institution_id: body.order.tb_institution_id,
          terminal: 0,
          tb_customer_id: body.order.tb_customer_id,
          dt_record: body.order.dt_record,
          tb_salesman_id: body.order.tb_salesman_id,
          kind: "supplying",
          number: 0,
          current_debit_balance: body.order.current_debit_balance,
        };
        var dataRes = await this.getById(body.order.id, body.order.tb_institution_id, 'supplying');
        if (dataRes.id == 0) {
          await this.insert(dataOrder)
            .then(async () => {
              await this.insertSupplyngCard(body);
            })
          resolve(body);
        } else {
          await this.update(dataOrder)
            .then(async () => {
              resolve(body);
            })
        }
      } catch (error) {
        reject('OrderConsignmentController.saveSupplying: ' + error);
      }
    });
    return promise;
  }

  static async insert(data) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (data.number == 0)
          data.number = await this.getNextNumber(data.tb_institution_id);
        this.create(data)
          .then((data) => {
            resolve(data);
          })
      }
      catch (error) {
        reject("OrderConsignmentController.insert:" + error);
      }
      finally {
        resolve(data);
      }
    });
    return promise;
  }


  static async create(data) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        Tb.create(data)
          .then((data) => {
            resolve(data);
          })
      }
      catch (error) {
        reject("OrderConsignmentController.create:" + error);
      }
    });
    return promise;
  }

  static async insertCheckpointCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {};
        for (var item of body.items) {
          dataItem = {
            id: body.order.id,
            tb_institution_id: body.order.tb_institution_id,
            terminal: 0,
            tb_product_id: item.tb_product_id,
            kind: 'checkpoint',
            bonus: item.bonus,
            qtty_consigned: item.qtty_consigned,
            leftover: item.leftover,
            qtty_sold: item.sale,
            unit_value: item.unit_value

          };
          //Quanto o insert é mais complexo como getNext precisa do await no loop          
          await consignmentCard.insert(dataItem);
        };
        resolve("Items Adicionados");
      } catch (error) {
        reject("OrderConsignmentController.insertCheckpointCard:" + error);
      }

    });
    return promise;
  }

  static async insertSupplyngCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {};
        for (var item of body.items) {
          dataItem = {
            id: body.order.id,
            tb_institution_id: body.order.tb_institution_id,
            terminal: 0,
            tb_product_id: item.tb_product_id,
            bonus: item.bonus,
            kind: 'supplying',
            leftover: item.leftover,
            devolution: item.devolution,
            new_consignment: item.new_consignment,
            qtty_consigned: item.qtty_consigned,
            unit_value: item.unit_value,
          };
          //Quanto o insert é mais complexo como getNext precisa do await no loop          
          await consignmentCard.insert(dataItem);

        };
        resolve("Items Adicionados");
      } catch (error) {
        reject("OrderConsignmentController.insertSupplyngCard:" + error);
      }

    });
    return promise;
  }

  static async insertCheckpointPaid(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (body.payments) {
          var dataPayment = {};
          for (var item of body.payments) {
            dataPayment = {
              id: body.order.id,
              tb_institution_id: body.order.tb_institution_id,
              terminal: 0,
              tb_payment_type_id: item.tb_payment_type_id,
              value: item.value

            };
            //Quanto o insert é mais complexo como getNext precisa do await no loop          
            await orderPaid.insert(dataPayment);
          };
          resolve("Pagamentos Adicionados");
        } else {
          resolve("Tag Payments não encontrada");
        }
      } catch (error) {
        reject("OrderConsignmentController.insertCheckpointPaid:" + error);
      }

    });
    return promise;
  }


  static async getNextNumber(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select max(number) lastNumber ' +
        'from tb_order_consignment ' +
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
          reject('orderConsignment.getNexNumber: ' + error);
        });
    });
    return promise;
  }

  static async insertOrderPaid(body) {
    const promise = new Promise(async (resolve, reject) => {

      if (body.order.number == 0)
        body.order.number = await this.getNextNumber(body.order.tb_institution_id);

      const dataOrder = {
        id: body.order.id,
        tb_institution_id: body.order.tb_institution_id,
        terminal: 0,
        number: body.order.number,
        tb_customer_id: body.order.tb_customer_id,
        total_value: body.order.total_value,
        change_value: body.order.change_value,
        debit_balance: body.order.debit_balance
      }
      Tb.create(dataOrder)
        .then(() => {
          resolve(body);
        })
        .catch(error => {
          reject("orderConsignment.insertOrderPaid:" + error);
        });
    });
    return promise;
  }


  static getList(tb_institution_id, tb_customer_id) {
    const promise = new Promise((resolve, reject) => {
      var sqltxt =
        '  select distinct ' +
        '  ord.id, ' +
        '  ord.tb_institution_id, ' +
        '  ord.tb_user_id, ' +
        '  ora.tb_customer_id,' +
        '  etd.name_company name_entity,' +
        '  ord.dt_record ' +
        'from tb_order ord  ' +
        '   inner join tb_order_consignment ora ' +
        '   on (ora.id = ord.id)  ' +
        '     and (ora.tb_institution_id = ord.tb_institution_id) ' +
        '     and (ora.terminal = ord.terminal) ' +
        '   inner join tb_entity etd ' +
        '   on (etd.id = ora.tb_customer_id)  ' +
        'where (ord.tb_institution_id =? ) ';
      if (tb_customer_id > 0) {
        sqltxt = sqltxt + 'and tb_customer_id = ?';
      } else {
        sqltxt = sqltxt + 'and tb_customer_id <> ?';
      }
      sqltxt = sqltxt + 'order by ord.dt_record desc ';

      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [tb_institution_id, tb_customer_id],
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

  static getOrder(tb_institution_id, id, kind) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ' +
        'ord.id, ' +
        'ord.tb_institution_id, ' +
        'ord.tb_user_id, ' +
        'orc.tb_customer_id, ' +
        'ctm.nick_trade name_customer, ' +
        'orc.tb_salesman_id, ' +
        'slm.name_company name_salesman, ' +
        'orc.dt_record, ' +
        'SUBSTRING(time(ate.createdAt), 1, 5) hr_record, '+
        'orc.total_value, ' +
        'orc.change_value, ' +
        'orc.previous_debit_balance, ' +
        'orc.current_debit_balance, ' +
        'ord.dt_record,   ' +
        'orc.number, ' +
        'ord.status, ' +
        'ate.recall, ' +
        'CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note ' +
        'from tb_order ord ' +
        '   inner join tb_order_consignment orc ' +
        '   on (orc.id = ord.id) ' +
        '     and (orc.tb_institution_id = ord.tb_institution_id) ' +
        '     and (orc.terminal = ord.terminal) ' +
        '   left outer join tb_order_attendance ate ' +
        '   on (ate.id = ord.id) ' +
        '     and (ate.tb_institution_id = ord.tb_institution_id) ' +
        '     and (ate.terminal = ord.terminal) ' +
        '   inner join tb_entity ctm ' +
        '   on (ctm.id = orc.tb_customer_id) ' +
        '   inner join tb_entity slm ' +
        '   on (slm.id = orc.tb_customer_id) ' +
        'where (ord.tb_institution_id =? )  ' +
        ' and (ord.id =? )' +
        ' and (orc.kind = ?)',
        {
          replacements: [tb_institution_id, id, kind],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            resolve(data[0]);
          }
          else
            resolve({ id: 0 });
        })
        .catch(error => {
          reject('orderConsignmentController.getOrder: ' + error);
        });
    });
    return promise;
  }

  static getLastOrderByCustomer(tb_institution_id, tb_customer_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ' +
        'ord.id, ' +
        'ord.tb_institution_id, ' +
        'ord.tb_user_id, ' +
        'orc.tb_customer_id, ' +
        'ctm.nick_trade name_customer, ' +

        'orc.tb_salesman_id, ' +
        'slm.name_company name_salesman, ' +
        'orc.total_value, ' +
        'orc.change_value,  ' +
        'orc.current_debit_balance, ' +
        'ord.dt_record, ' +
        'orc.number, ' +
        'ord.status, ' +
        'CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note  ' +
        'from tb_order ord ' +
        'inner join tb_order_attendance ora ' +
        '   on (ora.id = ord.id) ' +
        '     and (ora.tb_institution_id = ord.tb_institution_id) ' +
        '     and (ora.terminal = ord.terminal) ' +

        '   inner join tb_order_consignment orc ' +
        '   on (orc.id = ord.id)  ' +
        '     and (orc.tb_institution_id = ord.tb_institution_id) ' +
        '     and (orc.terminal = ord.terminal)  ' +
        '   inner join tb_entity ctm  ' +
        '   on (ctm.id = orc.tb_customer_id) ' +
        '   inner join tb_entity slm  ' +
        '   on (slm.id = orc.tb_salesman_id) ' +
        'where (ord.tb_institution_id = ? )  ' +
        ' and (orc.tb_customer_id = ?) ' +
        ' and (orc.kind = ? ) ' +
        ' and (ora.finished = ?) ' +
        ' order by orc.id desc ' +
        ' limit 1 ',
        {
          replacements: [tb_institution_id, tb_customer_id, 'supplying', 'S'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(error => {
          reject('OrderConsignment.getLastOrderByCustomer: ' + error);
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
        '   inner join tb_order_consignment ora ' +
        '   on (orc.id = ord.id)  ' +
        '     and (orc.tb_institution_id = ord.tb_institution_id) ' +
        '     and (orc.terminal = ord.terminal) ' +
        '   inner join tb_entity etd ' +
        '   on (etd.id = orc.tb_customer_id)  ' +
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

  static getCheckpoint(tb_institution_id, id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var result = {};
        this.getOrder(tb_institution_id, id, 'checkpoint')
          .then(async data => {
            if (data.id > 0) {
              var dataOrder = {
                id: data.id,
                tb_institution_id: data.tb_institution_id,
                tb_customer_id: data.tb_customer_id,
                name_customer: data.name_customer,
                tb_salesman_id: data.tb_salesman_id,
                name_saleman: data.name_salesman,
                dt_record: data.dt_record,
                hr_record: data.hr_record,
                total_value: Number(data.total_value),
                change_value: Number(data.change_value),
                previous_debit_balance: Number(data.previous_debit_balance),
                current_debit_balance: Number(data.current_debit_balance)
              };
              result.order = dataOrder;
              const dataItems = await consignmentCard.getCheckpointList(tb_institution_id, id);
              result.items = dataItems;
              const dataPayments = await consignmentCard.getPayment(tb_institution_id, id);
              result.payments = dataPayments;

              resolve(result);
            } else {
              result.order = { id: 0 };
              resolve(result);
            }
          })
      }
      catch (error) {
        reject('OrderConsignment.getCheckpoint: ' + error);
      }
    });
    return promise;
  }

  static getSupplying(tb_institution_id, id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var result = {};
        this.getOrder(tb_institution_id, id, 'supplying')
          .then(async data => {
            if (data.id > 0) {
              var dataOrder = {
                id: data.id,
                tb_institution_id: data.tb_institution_id,
                dt_record: data.dt_record,
                hr_record:data.hr_record,
                tb_customer_id: data.tb_customer_id,
                name_customer: data.name_customer,
                tb_salesman_id: data.tb_salesman_id,
                name_salesman: data.name_salesman,
                current_debit_balance: Number(data.current_debit_balance),
                recall: data.recall,
                note: data.note,
              };
              result.order = dataOrder;
              const dataItems = await consignmentCard.getSupplyingList(tb_institution_id, id);
              result.items = dataItems;
              resolve(result);
            } else {
              result.order = { id: 0 };
              resolve(result);
            }
          })
      }
      catch (error) {
        reject('OrderConsignment.getSupplyin: ' + error);
      }
    });
    return promise;
  }

  static getLast(tb_institution_id, tb_customer_id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var result = {};
        this.getLastOrderByCustomer(tb_institution_id, tb_customer_id)
          .then(async data => {
            if (data) {
              var dataOrder = {
                id: data.id,
                tb_institution_id: data.tb_institution_id,
                tb_customer_id: data.tb_customer_id,
                name_customer: data.name_customer,
                tb_salesman_id: data.tb_salesman_id,
                name_salesman: data.name_salesman,
                dt_record: data.dt_record,
                current_debit_balance: Number(data.current_debit_balance),
              };
              result.order = dataOrder;
              const dataItems = await consignmentCard.getSupplyingList(tb_institution_id, data.id);
              if (dataItems.length > 0)
                result.items = dataItems
              else
                result.items = await consignmentCard.getSupplyingNewList(tb_institution_id);
              resolve(result);
            } else {
              entityController.getById(tb_customer_id)
                .then(async (data) => {
                  var dataOrder = {
                    id: 0,
                    tb_institution_id: parseInt(tb_institution_id),
                    tb_customer_id: data.id,
                    name_customer: data.nick_trade,
                    tb_salesman_id: 0,
                    name_salesman: "",
                    current_debit_balance: 0,
                  };
                  result.order = dataOrder;
                  const dataItems = await consignmentCard.getSupplyingNewList(tb_institution_id);
                  if (dataItems.length > 0)
                    result.items = dataItems;
                  resolve(result);
                });
            }
          })
      }
      catch (error) {
        reject('OrderConsignment.getLast: ' + error);
      }
    });
    return promise;
  }

  static async update(body) {
    const promise = new Promise((resolve, reject) => {
      const dataOrder = {
        total_value: body.total_value,
        change_value: body.change_value,
        debit_balance: body.debit_balance
      }
      Tb.update(dataOrder, {
        where: { id: body.id, tb_institution_id: body.tb_institution_id, terminal: 0, tb_customer_id: body.tb_customer_id }
      })
        .then(() => {
          this.updateOrderItem(body)
            .then(() => {
              this.updateOrderItem(body)
                .then(() => {
                  resolve(body);
                })
            })
          resolve(body);
        })
        .catch(error => {
          reject("orderConsignment.update:" + error);
        });
    });
    return promise;
  }

  static async updateOrderItem(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (Array.isArray(body.items)) {
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
        } else {
          resolve("Item não informado");
        }
      } catch (error) {
        reject("orderConsignment.updateOrderItem:" + error);
      }

    });
    return promise;
  }

  static async updateOrderPaid(body) {
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
        .catch(error => {
          reject("orderConsignment.updateOrder:" + error);
        });
    });
    return promise;
  }

  static async delete(tb_institution_id, id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        //01 - tb_order_bonus;
        await ControllerOrderBonus.cleanUp(tb_institution_id, id);
        //02 - tb_order_consignment
        await this.cleanUp(tb_institution_id, id);
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
        resolve(`Delete executado com sucesso`)
      } catch (error) {
        reject(`orderConsignment.delete:${error}`)
      }
    });
    return promise;
  }



  static async closure(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var status = await this.getStatus(body.tb_institution_id, body.id);
        if (status == 'A') {
          var items = await orderItem.getList(body.tb_institution_id, body.id, 'Consignment');
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
              operation: "Consignment"
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
            direction = 'E'
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
              operation: "Consignment"
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
          qtde += item.new_consignment;
        }
        if (qtde > 0) {
          await this.insertOrderItemByCard(body, "Consignment");
          await this.closurebyCard(body, "Consignment");
        }
        resolve(body);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  static async insertOrderItemByCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataItem = {};
        for (var item of body.items) {
          if (item.new_consignment > 0) {
            dataItem = {
              id: 0,
              tb_institution_id: body.order.tb_institution_id,
              tb_order_id: body.order.id,
              terminal: 0,
              tb_stock_list_id: body.StockOrigen.tb_stock_list_id,
              tb_product_id: item.tb_product_id,
              quantity: item.new_consignment,
              unit_value: item.unit_value,
              kind: 'Consignment',
            };
            //Quanto o insert é mais complexo como getNext precisa do await no loop          
            await orderItem.insert(dataItem);
          }
        };
        resolve("Items Adicionados");
      } catch (error) {
        reject("orderConsignment.insertOrderItem:" + error);
      }

    });
    return promise;
  }

  static async closurebyCard(body, operation) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var items = await orderItem.getList(body.order.tb_institution_id, body.order.id, 'supplying', 'Consignment');
        var dataItem = {};
        for (var item of items) {
          dataItem = {
            id: 0,
            tb_institution_id: body.order.tb_institution_id,
            tb_order_id: body.order.id,
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
          dataItem['tb_stock_list_id'] = body.StockOrigen.tb_stock_list_id;
          dataItem['direction'] = 'S';
          await stockStatement.insert(dataItem);
          //Sempre Entra no Destino
          dataItem['tb_stock_list_id'] = body.StockDestiny.tb_stock_list_id;
          dataItem['direction'] = 'E';
          await stockStatement.insert(dataItem);

        };
        await orderController.updateStatus(body.order.tb_institution_id, body.order.id, 'F');
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
        Tb.destroy({
          where: {
            tb_institution_id: tb_institution_id,
            id: id,
            terminal: 0,
          }
        })
        resolve("clenUp executado com sucesso!");
      } catch (error) {
        reject('orderConsignment.cleanUp ' + error);
      }
    });
    return promise;
  }

}
module.exports = OrderConsignmentController;

