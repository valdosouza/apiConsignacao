const Base = require('./base.controller.js');
const db = require("../model");
const { DOUBLE } = require('sequelize');
const Tb = db.financialStatement;
const DateFunction = require('../util/dateFunction.js');
const OrderConsigngmentController = require('../controller/orderConsignment.controller.js');
const OrderAttendaceController = require('../controller/orderAttendance.controller.js');

class FinancialStatementController extends Base {

  static async insert(body) {
    const promise = new Promise(async (resolve, reject) => {
      Tb.create(body)
        .then((data) => {
          resolve(data);
        })
        .catch(error => {
          reject("FinancialStatement.insert:" + error);
        });
    });
    return promise;
  }


  static get(tb_institution_id, tb_salesman_id, tb_customer_id, dt_record, kind_date, tb_order_id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataini = dt_record;
        var datafim = dt_record;
        var dataResult = [];

        if (kind_date != 'D') {
          dataini = DateFunction.firtDayMonth(dt_record);
          datafim = DateFunction.lastDayMonth(dt_record);
        }
        var dataOrdersale = [];

        dataOrdersale = await FinancialStatementController.getOrderSales(tb_institution_id, tb_salesman_id, tb_customer_id, dataini, datafim, tb_order_id);

        var dataTotalVenda = {
          description: "Total de Vendas",
          tag_value: dataOrdersale[dataOrdersale.length - 1].tag_value,
          kind: "totais",
          color: "green",
        };
        //Divida Velha é toda divida anterior a data Informada, no caso dt_record ou se a consulta for mensal dataini
        var dataDividaVelha = {};
        dataDividaVelha = await OrderConsigngmentController.getDividaVelhaBySalesman(tb_institution_id, tb_salesman_id, tb_customer_id, dataini, tb_order_id);

        //var dataDividaAtual = {};        
        //dataDividaAtual = await OrderConsigngmentController.getDividaAtualBySalesman(tb_institution_id, tb_salesman_id,0, dt_record);

        var dataTotalReceber = {
          description: "Total à receber",
          tag_value: dataDividaVelha.tag_value + dataTotalVenda.tag_value,// + dataDividaAtual.tag_value,
          kind: "totais",
          color: "black",
        };

        var dataFinancialReceived = [];
        dataFinancialReceived = await FinancialStatementController.getFinancialReceived(tb_institution_id, tb_salesman_id, tb_customer_id, dataini, datafim, tb_order_id);

        var dataTotalRecebido = {
          description: "Total Recebido",
          tag_value: dataFinancialReceived[dataFinancialReceived.length - 1].tag_value,
          kind: "totais",
          color: "blue",
        };

        var saldodevedor = dataTotalReceber.tag_value - dataTotalRecebido.tag_value;
        if (saldodevedor < 0) saldodevedor = 0;
        var dataSaldoDevedor = {
          description: "Saldo devedor",
          tag_value: saldodevedor,
          kind: "totais",
          color: "red",
        };

        //cliente definiu que tudo será condiderado como recebido
        //var dataFinancialToReceived = []
        //dataFinancialToReceived = await FinancialStatementController.getFinancialToReceive(tb_institution_id, tb_user_id, 0, dataini, datafim);

        dataResult = dataOrdersale.concat(dataFinancialReceived, dataTotalVenda, dataDividaVelha, dataTotalReceber, dataTotalRecebido, dataSaldoDevedor);//, dataFinancialToReceived);

        resolve(dataResult);
      } catch (error) {
        reject("financialStatement.get: " + error);
      }
    });
    return promise;
  }

  static getByDay(tb_institution_id, tb_salesman_id, tb_customer_id, dt_record, tb_order_id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataini = dt_record;
        var datafim = dt_record;
        var dataResult = [];

        var dataOrdersale = [];

        dataOrdersale = await FinancialStatementController.getOrderSales(tb_institution_id, tb_salesman_id, tb_customer_id, dataini, datafim, tb_order_id);

        var dataTotalVenda = {
          description: "Total de Vendas",
          tag_value: dataOrdersale[dataOrdersale.length - 1].tag_value,
          kind: "totais",
          color: "green",
        };
        //Divida Velha no extrato do dia
        //      São todas as dividas velhas anteriores dos "clientes atendidos do dia".
        var dataDividaVelha = {};
        dataDividaVelha = await OrderConsigngmentController.getDividaVelhaByDay(tb_institution_id, tb_salesman_id, dt_record);

        var dataTotalReceber = {
          description: "Total à receber",
          tag_value: dataDividaVelha.tag_value + dataTotalVenda.tag_value,// + dataDividaAtual.tag_value,
          kind: "totais",
          color: "black",
        };

        var dataFinancialReceived = [];
        dataFinancialReceived = await FinancialStatementController.getFinancialReceived(tb_institution_id, tb_salesman_id, tb_customer_id, dataini, datafim, tb_order_id);

        var dataTotalRecebido = {
          description: "Total Recebido",
          tag_value: dataFinancialReceived[dataFinancialReceived.length - 1].tag_value,
          kind: "totais",
          color: "blue",
        };
        var saldodevedor = dataTotalReceber.tag_value - dataTotalRecebido.tag_value;
        if (saldodevedor < 0) saldodevedor = 0;
        var dataSaldoDevedor = {
          description: "Saldo devedor",
          tag_value: saldodevedor,
          kind: "totais",
          color: "red",
        };


        //cliente definiu que tudo será condiderado como recebido
        //var dataFinancialToReceived = []
        //dataFinancialToReceived = await FinancialStatementController.getFinancialToReceive(tb_institution_id, tb_user_id, 0, dataini, datafim);

        dataResult = dataOrdersale.concat(dataFinancialReceived, dataTotalVenda, dataDividaVelha, dataTotalReceber, dataTotalRecebido, dataSaldoDevedor);//, dataFinancialToReceived);

        resolve(dataResult);
      } catch (error) {
        reject("financialStatement.getByDay: " + error);
      }
    });
    return promise;
  }

  static getByMonth(tb_institution_id, tb_salesman_id, dt_record) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataini = DateFunction.firtDayMonth(dt_record);
        var datafim = DateFunction.lastDayMonth(dt_record);
        var dataResult = [];

        var dataOrdersale = [];

        dataOrdersale = await FinancialStatementController.getOrderSales(tb_institution_id, tb_salesman_id, 0, dataini, datafim, 0);

        var dataTotalVenda = {
          description: "Total de Vendas",
          tag_value: dataOrdersale[dataOrdersale.length - 1].tag_value,
          kind: "totais",
          color: "green",
        };

        var dataFinancialReceived = [];
        dataFinancialReceived = await FinancialStatementController.getFinancialReceived(tb_institution_id, tb_salesman_id, 0, dataini, datafim, 0);

        var dataTotalRecebido = {
          description: "Total Recebido",
          tag_value: dataFinancialReceived[dataFinancialReceived.length - 1].tag_value,
          kind: "totais",
          color: "blue",
        };

        var dataSaldoDevedor = {};
        dataSaldoDevedor = await OrderConsigngmentController.getSaldoDevedor(tb_institution_id, tb_salesman_id, dt_record);


        dataResult = dataOrdersale.concat(dataFinancialReceived, dataTotalVenda, dataTotalRecebido, dataSaldoDevedor);//, dataFinancialToReceived);

        resolve(dataResult);
      } catch (error) {
        reject("financialStatement.getByMonth: " + error);
      }
    });
    return promise;
  }

  static getByCustomer(tb_institution_id, tb_salesman_id, tb_customer_id, dt_record, tb_order_id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataini = dt_record;
        var datafim = dt_record;
        var dataResult = [];

        var dataOrdersale = [];

        dataOrdersale = await FinancialStatementController.getOrderSales(tb_institution_id, tb_salesman_id, tb_customer_id, dataini, datafim, tb_order_id);

        var dataTotalVenda = {
          description: "Total de Vendas",
          tag_value: dataOrdersale[dataOrdersale.length - 1].tag_value,
          kind: "totais",
          color: "green",
        };
        //Divida Velha no extrato de atendimento por cliente
        //      São todas as dividas velhas anteriores do cliente visualizado
        var dataDividaVelha = {};
        dataDividaVelha = await OrderConsigngmentController.getDividaVelhaByCustomer(tb_institution_id, tb_customer_id, dt_record);

        var dataTotalReceber = {
          description: "Total à receber",
          tag_value: dataDividaVelha.tag_value + dataTotalVenda.tag_value,// + dataDividaAtual.tag_value,
          kind: "totais",
          color: "black",
        };

        var dataFinancialReceived = [];
        dataFinancialReceived = await FinancialStatementController.getFinancialReceived(tb_institution_id, tb_salesman_id, tb_customer_id, dataini, datafim, tb_order_id);

        var dataTotalRecebido = {
          description: "Total Recebido",
          tag_value: dataFinancialReceived[dataFinancialReceived.length - 1].tag_value,
          kind: "totais",
          color: "blue",
        };

        var saldodevedor = dataTotalReceber.tag_value - dataTotalRecebido.tag_value;
        if (saldodevedor < 0) saldodevedor = 0;
        var dataSaldoDevedor = {
          description: "Saldo devedor",
          tag_value: saldodevedor,
          kind: "totais",
          color: "red",
        };

        //cliente definiu que tudo será condiderado como recebido
        //var dataFinancialToReceived = []
        //dataFinancialToReceived = await FinancialStatementController.getFinancialToReceive(tb_institution_id, tb_user_id, 0, dataini, datafim);

        dataResult = dataOrdersale.concat(dataFinancialReceived, dataTotalVenda, dataDividaVelha, dataTotalReceber, dataTotalRecebido, dataSaldoDevedor);//, dataFinancialToReceived);

        resolve(dataResult);
      } catch (error) {
        reject("financialStatement.getByCustomer: " + error);
      }
    });
    return promise;
  }

  static getByOrder(tb_institution_id, tb_salesman_id, dt_record, tb_order_id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        //Precisa ser o attendance
        var orderConsignament = await OrderAttendaceController.getById(tb_order_id, tb_institution_id);
        var tb_customer_id = 0;

        if (orderConsignament.id > 0)
          tb_customer_id = orderConsignament.tb_customer_id;
        var dataini = dt_record;
        var datafim = dt_record;
        var dataResult = [];

        var dataOrdersale = [];

        dataOrdersale = await FinancialStatementController.getOrderSales(tb_institution_id, tb_salesman_id, tb_customer_id, dataini, datafim, tb_order_id);

        var dataTotalVenda = {
          description: "Total de Vendas",
          tag_value: dataOrdersale[dataOrdersale.length - 1].tag_value,
          kind: "totais",
          color: "green",
        };
        //Divida Velha no extrato de atendimento por cliente
        //      São todas as dividas velhas anteriores do cliente visualizado
        var dataDividaVelha = {};
        dataDividaVelha = await OrderConsigngmentController.getDividaVelhaByOrder(tb_institution_id, tb_customer_id, tb_order_id);
        //dataDividaVelha = await OrderConsigngmentController.getDividaVelhaByOrder(tb_institution_id, tb_customer_id, tb_order_id);

        var dataTotalReceber = {
          description: "Total à receber",
          tag_value: dataDividaVelha.tag_value + dataTotalVenda.tag_value,// + dataDividaAtual.tag_value,
          kind: "totais",
          color: "black",
        };

        var dataFinancialReceived = [];
        dataFinancialReceived = await FinancialStatementController.getFinancialReceived(tb_institution_id, tb_salesman_id, tb_customer_id, dataini, datafim, tb_order_id);

        var dataTotalRecebido = {
          description: "Total Recebido",
          tag_value: dataFinancialReceived[dataFinancialReceived.length - 1].tag_value,
          kind: "totais",
          color: "blue",
        };

        var saldodevedor = dataTotalReceber.tag_value - dataTotalRecebido.tag_value;
        if (saldodevedor < 0) saldodevedor = 0;
        var dataSaldoDevedor = {
          description: "Saldo devedor",
          tag_value: saldodevedor,
          kind: "totais",
          color: "red",
        };

        //cliente definiu que tudo será condiderado como recebido
        //var dataFinancialToReceived = []
        //dataFinancialToReceived = await FinancialStatementController.getFinancialToReceive(tb_institution_id, tb_user_id, 0, dataini, datafim);

        dataResult = dataOrdersale.concat(dataFinancialReceived, dataTotalVenda, dataDividaVelha, dataTotalReceber, dataTotalRecebido, dataSaldoDevedor);//, dataFinancialToReceived);

        resolve(dataResult);
      } catch (error) {
        reject("financialStatement.getByOrder: " + error);
      }
    });
    return promise;
  }

  static getOrderSales(tb_institution_id, tb_salesman_id, tb_customer_id, dataini, datafim, tb_order_id) {
    const promise = new Promise((resolve, reject) => {
      try {
        var sqltxt =
          'select prd.description name_product, sum((ori.quantity * ori.unit_value)) subtotal, "Total de Vendas" kind, "green" color ' +
          'from tb_order ord ' +
          '  inner join tb_order_sale ors ' +
          '  on (ord.id = ors.id) '+
          '    and (ord.tb_institution_id = ors.tb_institution_id)  ' +
          '    and (ord.terminal = ors.terminal) ' +
          '  inner join tb_order_item ori ' +
          '  on (ors.id = ori.tb_order_id) '+
          '    and (ord.tb_institution_id = ori.tb_institution_id)  ' +
          '    and (ord.terminal = ori.terminal)  ' +
          '  inner join tb_product prd ' +
          '  on (prd.id = ori.tb_product_id)  '+
          '     and (ori.tb_institution_id = prd.tb_institution_id) ' +
          'where (ord.tb_institution_id =? ) ' +
          ' and (ors.tb_salesman_id =?)';

        if (tb_customer_id == 0) {
          sqltxt = sqltxt + ' and (ors.tb_customer_id <> ?) ';
        } else {
          sqltxt = sqltxt + ' and (ors.tb_customer_id = ?) ';
        };

        if (tb_order_id == 0) {
          sqltxt = sqltxt + ' and (ors.id <> ?) ';
        } else {
          sqltxt = sqltxt + ' and (ors.id = ?) ';
        };

        sqltxt = sqltxt +
          '  and (ord.dt_record between ? and ?) ' +
          ' and (ori.kind =?) ' +
          'group by 1 ';

        Tb.sequelize.query(
          sqltxt,
          {
            replacements: [tb_institution_id, tb_salesman_id, tb_customer_id, tb_order_id, dataini, datafim, 'sale'],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            var dataResult = [];
            var totalvalue = 0.0;
            for (var item of data) {
              totalvalue += Number(item.subtotal),
                dataResult.push({
                  description: item.name_product,
                  tag_value: Number(item.subtotal),
                  kind: item.kind,
                  color: item.color
                });
            }
            dataResult.push({
              description: "Total de Vendas",
              tag_value: Number(totalvalue.toFixed(2)),
              kind: "summarized",
              color: "green",
            });
            resolve(dataResult);
          })

      } catch (error) {
        reject("financialStatement.getOrderSale: " + error);
      }
    });
    return promise;
  }

  static getFinancialToReceive(tb_institution_id, tb_salesman_id, tb_customer_id, dataini, datafim) {
    const promise = new Promise((resolve, reject) => {
      var sqltxt =
        'select pmt.description name_payment_type, sum(fnl.tag_value) subtotal, "Total a Receber" kind ' +
        'from tb_financial fnl ' +
        '   inner join tb_order_attendance ora ' +
        '   on (fnl.tb_order_id = ora.id) and (fnl.tb_institution_id = ora.tb_institution_id)  ' +

        '   left outer join tb_financial_payment fnp  ' +
        '   on (fnp.tb_order_id = ora.id) and (fnp.tb_institution_id = ora.tb_institution_id)   ' +

        '   inner join tb_payment_types pmt ' +
        '   on (pmt.id = fnl.tb_payment_types_id)  ' +
        'where (ora.tb_institution_id =? ) ' +
        ' and (ora.tb_salesman_id =?)' +
        ' and (fnp.tb_order_id is null) ';

      if (tb_customer_id == 0) {
        sqltxt = sqltxt + ' and (ora.tb_customer_id <> ?) ';
      } else {
        sqltxt = sqltxt + ' and (ora.tb_customer_id = ?) ';
      };

      sqltxt = sqltxt +
        ' and (fnl.dt_record  between ? and ?) ' +
        'group by 1 ';


      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [tb_institution_id, tb_salesman_id, tb_customer_id, dataini, datafim],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          var dataResult = [];
          var totalvalue = 0.0;
          for (var item of data) {
            totalvalue += Number(item.subtotal),
              dataResult.push({
                "description": item.name_payment_type,
                "tag_value": Number(item.subtotal),
                "kind": item.kind,
              });
          }
          dataResult.push({
            "description": "Total a Receber",
            "tag_value": Number(totalvalue),
            "kind": "summarized",
          });
          resolve(dataResult);
        })
        .catch(error => {
          reject("financialStatement.getFinancialToReceive: " + error);
        });
    });
    return promise;
  }

  static getFinancialReceived(tb_institution_id, tb_salesman_id, tb_customer_id, dataini, datafim, tb_order_id) {
    const promise = new Promise((resolve, reject) => {
      var sqltxt =
        'select pmt.description name_payment_type, sum(fnl.tag_value) subtotal, "Total Recebido" kind, "blue" color  ' +
        'from tb_financial fnl  ' +
        '  inner join tb_order_attendance ora ' +
        '  on (ora.id = fnl.tb_order_id) ' +
        '  and (ora.tb_institution_id  = fnl.tb_institution_id) ' +
        '  and (ora.terminal  = fnl.terminal) ' +

        '   inner join tb_customer ct ' +
        '   on (fnl.tb_entity_id = ct.id) ' +
        '   inner join tb_region rg ' +
        '   on (rg.id = ct.tb_region_id) ' +

        '   inner join tb_payment_types pmt  ' +
        '   on (pmt.id = fnl.tb_payment_types_id)  ' +
        'where (fnl.tb_institution_id =? )  ' +
        ' and (ora.tb_salesman_id =?) ';
      if (tb_customer_id == 0) {
        sqltxt = sqltxt + ' and (fnl.tb_entity_id <> ?) ';
      } else {
        sqltxt = sqltxt + ' and (fnl.tb_entity_id = ?) ';
      }

      if (tb_order_id == 0) {
        sqltxt = sqltxt + ' and (fnl.tb_order_id <> ?) ';
      } else {
        sqltxt = sqltxt + ' and (fnl.tb_order_id = ?) ';
      }

      sqltxt = sqltxt +
        ' and (fnl.dt_record between ? and ?) ' +
        'group by 1 ';

      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [tb_institution_id, tb_salesman_id, tb_customer_id, tb_order_id, dataini, datafim],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          var dataResult = [];
          var totalvalue = 0.0;
          for (var item of data) {
            totalvalue += Number(item.subtotal),
              dataResult.push({
                description: item.name_payment_type,
                tag_value: Number(item.subtotal),
                kind: item.kind,
                color: "blue",
              });
          }

          dataResult.push({
            description: "Total Recebido",
            tag_value: Number(totalvalue),
            kind: "summarized",
            color: "blue"
          });

          resolve(dataResult);
        })
        .catch(error => {
          reject("financialStatement.getFinancialReceived: " + error);
        });
    });
    return promise;
  }

  static getListCustomerCharged(tb_institution_id, tb_salesman_id, date, kind_date) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataini = date;
        var datafim = date;

        if (kind_date != 'D') {
          dataini = DateFunction.firtDayMonth(dataini);
          datafim = DateFunction.lastDayMonth(datafim);
        }
        var dataResult = await this.listCustomerCharged(tb_institution_id, tb_salesman_id, dataini, datafim);

        resolve(dataResult);
      } catch (error) {
        reject("getListCustomerCharged: " + error);
      }
    });
    return promise;
  }

  static getListSalesmanCustomerCharged(tb_institution_id, date, kind_date) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataini = date;
        var datafim = date;

        if (kind_date != 'D') {
          dataini = DateFunction.firtDayMonth(dataini);
          datafim = DateFunction.lastDayMonth(datafim);
        }
        var dataResult = await this.listSalesmanCustomerCharged(tb_institution_id, dataini, datafim);

        resolve(dataResult);
      } catch (error) {
        reject("getListCustomerCharged: " + error);
      }
    });
    return promise;
  }

  static listCustomerCharged(tb_institution_id, tb_salesman_id, dataini, datafim) {
    const promise = new Promise((resolve, reject) => {

      var sqltxt =
        ' select ora.id tb_order_id, etd.id, ora.tb_salesman_id, ord.dt_record, etd.nick_trade  name_customer, CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note,' +
        ' SUBSTRING(time(ora.createdAt), 1, 5) time_attendace, coalesce(sum(fnl.tag_value),0) as  value_charged ' +
        ' from tb_order_attendance ora  ' +
        '   inner join tb_order ord' +
        '   on (ord.id = ora.id)  ' +
        '     and (ord.tb_institution_id = ora.tb_institution_id)  ' +

        '   inner join tb_customer ct ' +
        '   on (ct.id = ora.tb_customer_id) ' +

        '   inner join tb_entity etd  ' +
        '   on (etd.id = ora.tb_customer_id)   ' +

        '   left outer join  tb_financial fnl' +
        '   on (fnl.tb_order_id = ora.id) ' +
        '     and (fnl.tb_institution_id = ora.tb_institution_id) ' +
        ' where (ora.tb_institution_id = ? )' +
        '  and (ora.tb_salesman_id = ?)' +
        '  and (ord.dt_record between ? and ?) ' +
        ' group by 1,2,3 ,4,5,6,7 ' +
        ' order by 7 ';
      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [tb_institution_id, tb_salesman_id, dataini, datafim],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(error => {
          reject("financialStatement.listCustomerCharged: " + error);
        });
    });
    return promise;
  }

  static listSalesmanCustomerCharged(tb_institution_id, dataini, datafim) {
    const promise = new Promise((resolve, reject) => {

      var sqltxt =
        'select etd.id, etd.nick_trade  name_salesman, coalesce(sum(fnl.tag_value),0) as  value_charged ' +
        'from tb_order_attendance ora ' +
        '  inner join tb_order ord ' +
        '  on (ord.id = ora.id) ' +
        '    and (ord.tb_institution_id = ora.tb_institution_id) ' +
        '  inner join tb_entity etd ' +
        '  on (etd.id = ora.tb_salesman_id) ' +
        '  left outer join  tb_financial fnl ' +
        '  on (fnl.tb_order_id = ora.id) ' +
        '    and (fnl.tb_institution_id = ora.tb_institution_id) ' +
        'where (ora.tb_institution_id = ? ) ' +
        ' and (ord.dt_record between ? and ? ) ' +
        'group by 1,2 ' +
        'order by 2 ';

      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [tb_institution_id, dataini, datafim],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(error => {
          reject("financialStatement.listSalesmanCustomerCharged: " + error);
        });
    });
    return promise;
  }

  static async getBalance(tb_institution_id, tb_user_id, dt_record) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        Tb.sequelize.query(
          'select ' +
          'fnl.dt_record,  ' +
          'pt.description name_payment_type,  ' +
          'sum(fnl.tag_value) balance_value  ' +
          'From tb_financial fnl ' +
          '  inner join tb_order ord  ' +
          '  on (ord.id = fnl.tb_order_id) ' +
          '  and (ord.tb_institution_id = fnl.tb_institution_id) ' +
          '  inner join tb_payment_types pt  ' +
          '  on (pt.id = fnl.tb_payment_types_id)  ' +
          'where ( fnl.tb_institution_id =? )  ' +
          'and ( ord.tb_user_id =? )  ' +
          'and ( fnl.dt_record =? )  ' +
          'group by 1,2  ',
          {
            replacements: [tb_institution_id, tb_user_id, dt_record],
            type: Tb.sequelize.QueryTypes.SELECT
          })
          .then(data => {
            if (data.length > 0) {
              var dataResult = {
                dt_record: data[0].dt_record,
              }
              var items = [];
              var itemResult = {};
              for (var item of data) {
                itemResult = {
                  name_payment_type: item.name_payment_type,
                  balance_value: Number(item.balance_value)
                }
                items.push(itemResult);
              }
              dataResult.items = items;
              resolve(dataResult);
            } else {

              var dataResult = {
                dt_record: dt_record,
              }
              var items = [];
              var itemResult = {};
              itemResult = {
                name_payment_type: "Nenhum valor encontrado",
                balance_value: 0.0
              }
              items.push(itemResult);

              dataResult.items = items;
              resolve(dataResult);
            }
          })

      } catch (error) {
        reject('CashierClosure.getBalance: ' + error);
      }
    });
    return promise;
  }

  static async saveByCard(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataFinancial = {
          tb_institution_id: body.order.tb_institution_id,
          tb_order_id: body.order.id,
          terminal: 0,
          tb_bank_account_id: 0,
          dt_record: DateFunction.newDate(),
          tb_bank_historic_id: 0,
          credit_value: 0,
          debit_value: 0,
          manual_history: ["Pedido:", body.order.number, "Cliente:", body.order.name_customer].join(' '),
          kind: "C",
          settled_code: 0,
          tb_user_id: body.order.tb_salesman_id,
          future: "N",
          dt_original: DateFunction.newDate(),
          doc_reference: body.order.number,
          conferred: "N",
          tb_payment_types_id: 0,
          tb_financial_plans_id_cre: 0,
          tb_financial_plans_id_deb: 0,
        }
        for (var item of body.payments) {
          if (item.value > 0) {
            dataFinancial.tb_payment_types_id = item.tb_payment_type_id;
            if ((item.name_payment_type = 'DINHEIRO') && (body.order.change_value > 0)) {
              dataFinancial.credit_value = item.value - body.order.change_value;
            } else {
              dataFinancial.credit_value = item.value;
            }
            dataFinancial.settled_code = item.settled_code;
            await this.insert(dataFinancial);
          }
        }
        resolve(body);
      } catch (error) {
        reject('financialStatement.SaveBycard: ' + error)
      }

    });
    return promise;
  }
}
module.exports = FinancialStatementController;