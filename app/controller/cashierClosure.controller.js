const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.cashierclosure;
const CashierController = require("../controller/cashier.controller.js");
const DateFunction = require('../util/dateFunction.js');
const FinancialStatementController = require("../controller/financialStatement.controller.js");

class CashierClosureController extends Base {
  static async create(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var idCashier = await CashierController.getLastIdOpen(body.tb_institution_id, body.tb_user_id);
        if (idCashier > 0) {
          var dataClosure = {};
          var idCashierClosure = 0;
          for (var item of body.items) {
            idCashierClosure += 1;
            dataClosure = {
              id: idCashierClosure,
              tb_institution_id: body.tb_institution_id,
              terminal: 0,
              tb_cashier_id: idCashier,
              description: item.description,
              kind: item.kind,
              tag_value: item.tag_value,
            };
            await Tb.create(dataClosure);
          }
          CashierController.closure(body.tb_institution_id, idCashier);
          resolve("Fechamento Executado com Sucesso!");
        } else {
          resolve("Não foi encontrado caixa aberto para este usuário!");
        }
      } catch (err) {
        reject('CashierClosure.closure: ' + err);
      }

    });
    return promise;
  }

  static async get(tb_institution_id, tb_user_id, dt_record) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        Tb.sequelize.query(
          '  select ' +
          '  c.dt_record, ' +
          '  c.tb_institution_id, ' +
          '  c.tb_user_id, ' +
          '  cc.description, ' +
          '  cc.tag_value, ' +
          '  cc.kind ' +
          'from tb_cashier_closure cc ' +
          '   inner join tb_cashier c ' +
          '   on (c.id = cc.tb_cashier_id) ' +
          '   and (c.tb_institution_id = cc.tb_institution_id) ' +
          'where ( c.tb_institution_id =? ) ' +
          'and ( c.tb_user_id = ? ) ' +
          'and ( c.dt_record =? ) ',
          {
            replacements: [tb_institution_id, tb_user_id, dt_record],
            type: Tb.sequelize.QueryTypes.SELECT
          })
          .then(data => {
            var dataResult = {};
            if (data.length > 0) {
              dataResult = {
                dt_record: data[0].dt_record,
                tb_institution_id: data[0].tb_institution_id,
                tb_user_id: data[0].tb_user_id,
              }
              var items = [];
              var itemResult = {};
              for (var item of data) {
                itemResult = {
                  description: item.description,
                  tag_value: Number(item.tag_value),
                  kind: item.kind
                }
                items.push(itemResult);
              }
              dataResult.items = items;
            } else {
              dataResult = {
                dt_record: dt_record,
                tb_institution_id: parseInt(tb_institution_id),
                tb_user_id: parseInt(tb_user_id),
              }
              var items = [{
                description: "Nenhum movimento",
                tag_value: 0.0,
                kind: "Info",
              }];
              dataResult.items = items;
            }
            resolve(dataResult);
          })

      } catch (err) {
        reject('CashierClosure.closure: ' + err);
      }
    });
    return promise;
  }

  static async getlist(tb_institution_id, tb_user_id, dt_record) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        Tb.sequelize.query(
          'select ' +
          '  c.id, ' +
          '  c.dt_record ' +
          'from tb_cashier c ' +
          'where ( c.tb_institution_id =? ) ' +
          'and ( c.tb_user_id = ? ) ',
          {
            replacements: [tb_institution_id, tb_user_id, dt_record],
            type: Tb.sequelize.QueryTypes.SELECT
          })
          .then(data => {
            resolve(data);
          })

      } catch (err) {
        reject('CashierClosure.getlist: ' + err);
      }
    });
    return promise;
  }

  static async getForClosure(tb_institution_id, tb_user_id, dt_record) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataini = DateFunction.newDate();
        var datafim = DateFunction.newDate()
        var dataResult = [];

        var dataOrdersale = [];
        dataOrdersale = await FinancialStatementController.getOrderSales(tb_institution_id, tb_user_id, 0, dataini, datafim);

        var dataFinancialReceived = [];
        dataFinancialReceived = await FinancialStatementController.getFinancialReceived(tb_institution_id, tb_user_id, 0, dataini, datafim);

        var dataFinancialToReceived = []
        dataFinancialToReceived = await FinancialStatementController.getFinancialToReceive(tb_institution_id, tb_user_id, 0, dataini, datafim);

        dataResult = dataOrdersale.concat(dataFinancialReceived, dataFinancialToReceived);


        var DataGeral = {
          dt_record: dt_record,
          tb_institution_id: parseInt(tb_institution_id),
          tb_user_id: parseInt(tb_user_id),
          items: dataResult,
        }

        resolve(DataGeral);

      } catch (err) {
        reject('CashierClosure.getForClosure: ' + err);
      }
    });
    return promise;
  }

}
module.exports = CashierClosureController;
