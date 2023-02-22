const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.cashierclosure;
const CashierController = require("../controller/cashier.controller.js");
const DateFunction = require('../util/dateFunction.js');
const FinancialStatementController = require("../controller/financialStatement.controller.js");
const OrderConsigngmentController = require('../controller/orderConsignment.controller.js');

class CashierClosureController extends Base {
  static async create(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var cashier = await CashierController.getLastIdOpen(body.tb_institution_id, body.tb_user_id);
        if (cashier.status =="A") {
          var dataClosure = {};
          var idCashierClosure = 0;
          for (var item of body.items) {
            idCashierClosure += 1;
            dataClosure = {
              id: idCashierClosure,
              tb_institution_id: body.tb_institution_id,
              terminal: 0,
              tb_cashier_id: cashier.id,
              description: item.description,
              kind: item.kind,
              tag_value: item.tag_value,
              color : item.color,
            };
            await Tb.create(dataClosure);
          }
          CashierController.closure(body.tb_institution_id, cashier.id);
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
          '  cc.kind, ' +
          '  cc.color '+
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
                  kind: item.kind,
                  color: item.color,
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
                color: "black"
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
          'and ( c.tb_user_id = ? ) ' +
          ' and ( hr_end is not null)',
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
        var dataini = dt_record;
        var datafim = dt_record;
        var dataResult = [];

        var dataOrdersale = [];
        
        dataOrdersale = await FinancialStatementController.getOrderSales(tb_institution_id, tb_user_id, 0, dataini, datafim,0);

        var dataTotalVenda = {
          description: "Total de Vendas",
          tag_value: dataOrdersale[dataOrdersale.length - 1].tag_value,
          kind: "totais",
          color: "green",
        };
        
        //Divida Velha é toda divida anterior a data Informada, no caso dt_record ou se a consulta for mensal dataini
        var dataDividaVelha = {};        
        
        dataDividaVelha = await OrderConsigngmentController.getDividaVelhaBySalesman(tb_institution_id, tb_user_id,0, dt_record,0);

        //var dataDividaAtual = {};        
        //dataDividaAtual = await OrderConsigngmentController.getDividaAtualBySalesman(tb_institution_id, tb_user_id,0, dt_record);

        var dataTotalReceber = {
          description: "Total à receber",
          tag_value: dataDividaVelha.tag_value + dataTotalVenda.tag_value,// + dataDividaAtual.tag_value,
          kind: "totais",
          color : "black",
        };
        

        var dataFinancialReceived = [];
        dataFinancialReceived = await FinancialStatementController.getFinancialReceived(tb_institution_id, tb_user_id, 0, dataini, datafim,0);

        var dataTotalRecebido = {
          description: "Total Recebido",
          tag_value: dataFinancialReceived[dataFinancialReceived.length - 1].tag_value,
          kind: "totais",
          color : "blue",
        };

        var dataSaldoDevedor = {
          description: "Saldo devedor",
          tag_value: dataTotalReceber.tag_value - dataTotalRecebido.tag_value,
          kind: "totais",
          color : "red",
        };


        //cliente definiu que tudo será condiderado como recebido
        //var dataFinancialToReceived = []
        //dataFinancialToReceived = await FinancialStatementController.getFinancialToReceive(tb_institution_id, tb_user_id, 0, dataini, datafim);

        dataResult = dataOrdersale.concat(dataFinancialReceived,dataTotalVenda, dataDividaVelha, dataTotalReceber,dataTotalRecebido, dataSaldoDevedor);//, dataFinancialToReceived);


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
