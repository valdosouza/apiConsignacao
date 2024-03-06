const Base = require('../controller/base.controller.js');
const db = require("../model/index.js");
const Tb = db.cashier;
const FinancialStatementController = require("../controller/financialStatement.controller.js");
const OrderConsigngmentController = require("../controller/orderConsignment.controller.js");
const dateFunction = require('../util/dateFunction.js');

class CashierController extends Base {

  static getSales(tb_institution_id, tb_salesman_id, tb_customer_id, dataini, datafim, tb_order_id) {
    const promise = new Promise((resolve, reject) => {
      try {
        var tbAuxSql =
          '( select prd.id, prd.description name_product, sum((ori.quantity * ori.unit_value)) subtotal ' +
          'from tb_order ord ' +
          '  inner join tb_order_sale ors ' +
          '  on (ord.id = ors.id) and (ord.tb_institution_id = ors.tb_institution_id)  ' +
          '  inner join tb_order_item ori ' +
          '  on (ors.id = ori.tb_order_id) and (ord.tb_institution_id = ori.tb_institution_id)  ' +
          '  inner join tb_product prd ' +
          '  on (prd.id = ori.tb_product_id)  and (ori.tb_institution_id = prd.tb_institution_id) ' +
          'where (ord.tb_institution_id =? ) ';


        if (tb_salesman_id == 0) {
          tbAuxSql += ' and (ors.tb_salesman_id <> ?) ';
        } else {
          tbAuxSql += ' and (ors.tb_salesman_id = ?)  ';
        };

        if (tb_customer_id == 0) {
          tbAuxSql += ' and (ors.tb_customer_id <> ?) ';
        } else {
          tbAuxSql += ' and (ors.tb_customer_id = ?) ';
        };

        if (tb_order_id == 0) {
          tbAuxSql += ' and (ors.id <> ?) ';
        } else {
          tbAuxSql += ' and (ors.id = ?) ';
        };

        tbAuxSql +=
          '  and (ord.dt_record between ? and ?) ' +
          ' and (ori.kind = ?) ' +
          'group by 1 ) as aux ';

        var sqltxt =
          'select p.id, p.description name_product, COALESCE(aux.subtotal,0) as subtotal ' +
          'from tb_product p ' +
          '  left outer join ( ' + tbAuxSql + ')' +
          '  on (aux.id = p.id) ' +
          'where (p.active  = ? )';

        Tb.sequelize.query(
          sqltxt,
          {
            replacements: [tb_institution_id, tb_salesman_id, tb_customer_id, tb_order_id, dataini, datafim, 'sale', 'S'],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            resolve(data);
          })

      } catch (error) {
        reject("CashierSummaryController.getSale: " + error);
      }
    });
    return promise;
  }

  static getBonus(tb_institution_id, tb_salesman_id, tb_customer_id, dataini, datafim, tb_order_id) {
    const promise = new Promise((resolve, reject) => {
      try {
        var tbAuxSql =
          '( select prd.id, prd.description name_product, sum(ori.quantity) quantity ' +
          'from tb_order ord ' +
          '  inner join tb_order_bonus orb ' +
          '  on (ord.id = orb.id) and (ord.tb_institution_id = orb.tb_institution_id)  ' +
          '  inner join tb_order_item ori ' +
          '  on (orb.id = ori.tb_order_id) and (ord.tb_institution_id = ori.tb_institution_id)  ' +
          '  inner join tb_product prd ' +
          '  on (prd.id = ori.tb_product_id)  and (ori.tb_institution_id = prd.tb_institution_id) ' +
          'where (ord.tb_institution_id =? ) ';


        if (tb_salesman_id == 0) {
          tbAuxSql += ' and (orb.tb_salesman_id <> ?) ';
        } else {
          tbAuxSql += ' and (orb.tb_salesman_id = ?)  ';
        };

        if (tb_customer_id == 0) {
          tbAuxSql += ' and (orb.tb_customer_id <> ?) ';
        } else {
          tbAuxSql += ' and (orb.tb_customer_id = ?) ';
        };

        if (tb_order_id == 0) {
          tbAuxSql += ' and (orb.id <> ?) ';
        } else {
          tbAuxSql += ' and (orb.id = ?) ';
        };

        tbAuxSql +=
          '  and (ord.dt_record between ? and ?) ' +
          ' and (ori.kind = ?) ' +
          'group by 1 ) as aux ';

        var sqltxt =
          'select p.id, p.description name_product, COALESCE(aux.quantity,0) as quantity ' +
          'from tb_product p ' +
          '  left outer join ( ' + tbAuxSql + ')' +
          '  on (aux.id = p.id) ' +
          'where (p.active  = ? )';

        Tb.sequelize.query(
          sqltxt,
          {
            replacements: [tb_institution_id, tb_salesman_id, tb_customer_id, tb_order_id, dataini, datafim, 'bonus', 'S'],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            resolve(data);
          })

      } catch (error) {
        reject("CashierSummaryController.getBonus: " + error);
      }
    });
    return promise;
  }

  static getFinancialReceived(tb_institution_id, tb_salesman_id, dataini, datafim) {
    const promise = new Promise((resolve, reject) => {
      var sqltxt =
        'select sum(fnl.tag_value) subtotal  ' +
        'from tb_financial fnl  ' +
        '  inner join tb_order_attendance ora ' +
        '  on (ora.id = fnl.tb_order_id) ' +
        '  and (ora.tb_institution_id  = fnl.tb_institution_id) ' +

        '   inner join tb_customer ct ' +
        '   on (fnl.tb_entity_id = ct.id) ' +
        '   inner join tb_region rg ' +
        '   on (rg.id = ct.tb_region_id) ' +

        '   inner join tb_payment_types pmt  ' +
        '   on (pmt.id = fnl.tb_payment_types_id)  ' +
        'where (fnl.tb_institution_id =? )  ' +
        ' and (fnl.dt_record between ? and ?) ';

      if (tb_salesman_id == 0) {
        sqltxt += ' and (ora.tb_salesman_id <> ?) ';
      } else {
        sqltxt += ' and (ora.tb_salesman_id = ?)  ';
      };

      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [tb_institution_id, dataini, datafim, tb_salesman_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            resolve(Number(data[0].subtotal));
          } else {
            resolve({ subtotal: 0.0 });
          }
        })
        .catch(error => {
          reject("CashierSummaryController: " + error);
        });
    });
    return promise;
  }


  static getSalesPoints(tb_institution_id, tb_salesman_id, dataini, datafim) {
    const promise = new Promise((resolve, reject) => {
      try {
        var sqlTxt = '';
        sqlTxt = sqlTxt.concat(
          'select count(ors.id) sales_points ',
          'from tb_order ord  ',
          '  inner join tb_order_sale ors  ',
          '  on (ord.id = ors.id) and (ord.tb_institution_id = ors.tb_institution_id)   ',
          'where (ord.tb_institution_id =? )  ',
          'and ord.dt_record = ? and ? ',
        )

        if (tb_salesman_id == 0) {
          sqlTxt = sqlTxt.concat(' and (ors.tb_salesman_id <> ?) ');
        } else {
          sqlTxt = sqlTxt.concat(' and (ors.tb_salesman_id = ?)  ');
        };
        Tb.sequelize.query(
          sqlTxt,
          {
            replacements: [tb_institution_id, dataini, datafim, tb_salesman_id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            if (data.length > 0) {
              resolve(data[0].sales_points)
            } else {
              resolve(0);
            }
          })

      } catch (error) {
        reject("financialStatement.getOrderSale: " + error);
      }
    });
    return promise;
  }


  static async get(tb_institution_id, month, year, tb_salesman_id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var tb_customer_id = 0;
        var tb_order_id = 0;
        var items = [];
        var monthNumber = dateFunction.getMonthNumber(month);
        var monthDays = dateFunction.getMonthDays(month, year);
        var dayWeek = "";

        for (var i = 1; i <= monthDays; i++) {
          var date = [year, monthNumber, i].join('-');
          //Venda de Produtos
          var dataOrdersale = await this.getSales(tb_institution_id, tb_salesman_id, tb_customer_id, date, date, tb_order_id);
          var totalOrderSale = 0.0;
          var productSoldList = [];
          var productItem = {};
          //Divida Velha          
          var dataOldDebit = 0;
          var debitOld = 0;
          //Financeiro recebido
          var financialReceived = 0.0;
          //Total a Receber
          var totalToReceive = 0.0;
          //Saldo Devedor
          var debitBalance = 0;
          //Pontos de Vendas
          var salesPoints = 0;

          if (dataOrdersale.length > 0) {
            for (var p of dataOrdersale) {
              totalOrderSale += Number(p.subtotal);
              productItem = {
                id: p.id,
                description: p.name_product,
                value: Number(p.subtotal),
              }
              productSoldList.push(productItem);
            }
            //Divida Velha          
            dataOldDebit = await OrderConsigngmentController.getDividaVelhaByDay(tb_institution_id, tb_salesman_id, date);
            debitOld = 0;
            debitOld = dataOldDebit.tag_value;
            //Financeiro recebido
            financialReceived = 0.0;
            financialReceived = await this.getFinancialReceived(tb_institution_id, tb_salesman_id, date, date);
            //Total a Receber
            totalToReceive = 0.0;
            totalToReceive = debitOld + totalOrderSale;
            //Saldo Devedor
            debitBalance = 0;
            debitBalance = totalToReceive - financialReceived;
            if (debitBalance < 0) debitBalance = 0;
            //Pontos de Vendas
            salesPoints = 0;
            salesPoints = await this.getSalesPoints(tb_institution_id, tb_salesman_id, date, date);
          }//fim da Vendas
          //Bonus de Produtos
          var dataOrderBonus = await this.getBonus(tb_institution_id, tb_salesman_id, tb_customer_id, date, date, tb_order_id);
          var productBonusList = [];
          var productBonusItem = {};

          if (dataOrderBonus.length > 0) {
            for (var p of dataOrderBonus) {
              productBonusItem = {
                id: p.id,
                description: p.name_product,
                quantity: parseInt(p.quantity),
              }
              productBonusList.push(productBonusItem);
            }
          }//fim dos bonus
          //Prepara o item 
          items.push({
            day: i,
            week_day: dateFunction.weekDay(date),
            product_sold_list: productSoldList,
            old_debit: debitOld,
            debit_balance: debitBalance,
            total_received: financialReceived,
            sales_points: salesPoints,
            product_bonus_list: productBonusList,
          });
        }
        resolve(items);


      } catch (error) {
        reject('CashierStatementSummary.get: ' + error);
      }
    });
    return promise;
  }
}
module.exports = CashierController;
