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
        .catch(err => {
          reject('getById: ' + err);
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
        .catch(err => {
          reject('getDividaVelhaBySalesman: ' + err);
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
        '                                                            and ord.dt_record = ?  ' +
        '                                                            and (ord.tb_user_id = ?) ' +
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
        .catch(err => {
          reject('getDividaVelhaByDay: ' + err);
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
        .catch(err => {
          reject('getDividaVelhaByCustomer: ' + err);
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
        .catch(err => {
          reject('getDividaVelhaByOrder: ' + err);
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
        .catch(err => {
          reject('getSaldoDevedor: ' + err);
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
        .catch(err => {
          reject('getById: ' + err);
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
      } catch (err) {
        reject('OrderConsignmentController.saveCheckpoint: ' + err);
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
      } catch (err) {
        reject('OrderConsignmentController.saveSupplying: ' + err);
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
      catch (err) {
        reject("OrderConsignmentController.insert:" + err);
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
      catch (err) {
        reject("OrderConsignmentController.create:" + err);
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
      } catch (err) {
        reject("OrderConsignmentController.insertCheckpointCard:" + err);
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
      } catch (err) {
        reject("OrderConsignmentController.insertSupplyngCard:" + err);
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
      } catch (err) {
        reject("OrderConsignmentController.insertCheckpointPaid:" + err);
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
        .catch(err => {
          reject('orderConsignment.getNexNumber: ' + err);
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
        .catch(err => {
          reject("orderConsignment.insertOrderPaid:" + err);
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

      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [tb_institution_id, tb_customer_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("orderstockadjust.getlist: " + err);
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
        .catch(err => {
          reject('orderConsignmentController.getOrder: ' + err);
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
        'where (ord.tb_institution_id = ? )  '+
        ' and (orc.tb_customer_id = ?) '+
        ' and (orc.kind = ? ) '+     
        ' and (ora.finished = ?) '+
        ' order by orc.id desc '+
        ' limit 1 ',
        {
          replacements: [tb_institution_id, tb_customer_id,'supplying','S'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data[0]);
        })
        .catch(err => {
          reject('OrderConsignment.getLastOrderByCustomer: ' + err);
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
        .catch(err => {
          reject('orderstockadjust.getStatus: ' + err);
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
      catch (err) {
        reject('OrderConsignment.getCheckpoint: ' + err);
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
      catch (err) {
        reject('OrderConsignment.getSupplyin: ' + err);
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
      catch (err) {
        reject('OrderConsignment.getLast: ' + err);
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
        .catch(err => {
          reject("orderConsignment.update:" + err);
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
      } catch (err) {
        reject("orderConsignment.updateOrderItem:" + err);
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
        .catch(err => {
          reject("orderConsignment.updateOrder:" + err);
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
          reject("OrderConsignemnt.delete:" + err);
        });
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
      } catch (err) {
        reject(err);
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
        for (var item of body.items) {
          qtde += item.new_consignment;
        }
        if (qtde > 0) {
          await this.insertOrderItemByCard(body, "Consignment");
          await this.closurebyCard(body, "Consignment");
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
      } catch (err) {
        reject("orderConsignment.insertOrderItem:" + err);
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
      } catch (err) {
        reject(err);
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
        reject('orderConsignment.cleanUp ' + error);
      }
    });
    return promise;
  }

}
module.exports = OrderConsignmentController;

