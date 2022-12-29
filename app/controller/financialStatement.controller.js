const Base = require('./base.controller.js');
const db = require("../model");
const { DOUBLE } = require('sequelize');
const Tb = db.financial;
const dateFunction = require('../util/dateFunction.js');


class FinancialStatementController extends Base {     
   
  static get(tb_institution_id,tb_salesman_id,tb_customer_id, date,kind_date) {
    const promise = new Promise(async (resolve, reject) => {
        try {          
          var dataini = date;
          var datafim = date;
          console.log(kind_date);
          if (kind_date != 'D'){               
            dataini = dateFunction.firtDayMonth(dataini);          
            datafim = dateFunction.lastDayMonth(datafim);          
          }          
          var dataResult = [];  
          
          var dataOrdersale = []; 
          dataOrdersale =  await this.getOrderSales(tb_institution_id,tb_salesman_id,tb_customer_id, dataini,datafim);
          
          var dataFinancialReceived = []; 
          dataFinancialReceived = await this.getFinancialReceived(tb_institution_id,tb_salesman_id,tb_customer_id,dataini,datafim);
          
          var dataFinancialToReceived = []
          dataFinancialToReceived = await this.getFinancialToReceive(tb_institution_id,tb_salesman_id,tb_customer_id,dataini,datafim);

          dataResult = dataOrdersale.concat(dataFinancialReceived,dataFinancialToReceived);

          resolve(dataResult);
        } catch (err) {
          reject("financialStatenebt.getOrderSale: " + err);
        }
    });
    return promise;
  }    

  static getOrderSales(tb_institution_id,tb_salesman_id,tb_customer_id,dataini,datafim) {
      const promise = new Promise((resolve, reject) => {       

        var sqltxt = 
        'select prd.description name_product, sum((ori.quantity * ori.unit_value)) subtotal, "sold" kind '+
        'from tb_order ord '+
        '  inner join tb_order_sale ors '+
        '  on (ord.id = ors.id) and (ord.tb_institution_id = ors.tb_institution_id)  '+
        '  inner join tb_order_item ori '+
        '  on (ors.id = ori.tb_order_id) and (ord.tb_institution_id = ori.tb_institution_id)  '+
        '  inner join tb_product prd '+
        '  on (prd.id = ori.tb_product_id)  and (ori.tb_institution_id = prd.tb_institution_id) '+
        'where (ord.tb_institution_id =? ) '+
        ' and (ors.tb_salesman_id =?)';

        if (tb_customer_id == 0){
          sqltxt = sqltxt + ' and (ors.tb_customer_id <> ?) ';
        }else{
          sqltxt = sqltxt + ' and (ors.tb_customer_id = ?) ';
        };

        sqltxt = sqltxt + 
          '  and (ord.dt_record between ? and ?) '+
          'group by 1 ';

        
        Tb.sequelize.query(
          sqltxt,
          {
            replacements: [tb_institution_id,tb_salesman_id,tb_customer_id,dataini,datafim],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            var dataResult = [];
            var totalvalue = 0.0;   
            for(var item of data) {                
              totalvalue += Number(item.subtotal),
              dataResult.push({
                "description": item.name_product,
                "tag_value": Number(item.subtotal),
                "kind": item.kind,
              });
            } 
            dataResult.push({
              "description": "Total de Vendas",
              "tag_value": totalvalue,
              "kind": "summarized",
            });
            resolve(dataResult);
          })
          .catch(err => {
            reject("financialStatenebt.getOrderSale: " + err);
          });
      });
      return promise;
    }    

  static getFinancialToReceive(tb_institution_id,tb_salesman_id,tb_customer_id,dataini,datafim){
    const promise = new Promise((resolve, reject) => {
      var sqltxt = 
      'select pmt.description name_payment_type, sum(fnl.tag_value) subtotal, "toReceive" kind '+
      'from tb_order_sale ors '+
      '   inner join tb_financial fnl '+
      '   on (fnl.tb_order_id = ors.id) and (fnl.tb_institution_id = ors.tb_institution_id)  '+
      '   inner join tb_payment_types pmt '+
      '   on (pmt.id = fnl.tb_payment_types_id)  '+
      'where (ors.tb_institution_id =? ) '+
      ' and (ors.tb_salesman_id =?)';

      if (tb_customer_id == 0){
        sqltxt = sqltxt + ' and (ors.tb_customer_id <> ?) ';
      }else{
        sqltxt = sqltxt + ' and (ors.tb_customer_id = ?) ';
      };

      sqltxt = sqltxt + 
      ' and (fnl.dt_record  between ? and ?) '+
      'group by 1 ';


      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [tb_institution_id,tb_salesman_id,tb_customer_id,dataini,datafim],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          var dataResult = [];
          var totalvalue = 0.0;   
          for(var item of data) { 
            totalvalue += Number(item.subtotal),
            dataResult.push({
            "description": item.name_payment_type,
            "tag_value": Number(item.subtotal),
            "kind": item.kind,
            });
          } 
          dataResult.push({
            "description": "Total a Receber",
            "tag_value": totalvalue,
            "kind": "summarized",
          });            
          resolve(dataResult);
        })
        .catch(err => {
          reject("financialStatenebt.getOrderSale: " + err);
        });
    });
    return promise;
  }

  static getFinancialReceived(tb_institution_id,tb_salesman_id,tb_customer_id,dataini,datafim) {
    const promise = new Promise((resolve, reject) => {
      var sqltxt =
      'select pmt.description name_payment_type, sum(fnp.paid_value) subtotal, "Received" kind '+
      'from tb_order_sale ors '+
      '   inner join tb_financial fnl '+
      '   on (fnl.tb_order_id = ors.id) '+
      '     and (fnl.tb_institution_id = ors.tb_institution_id)  '+

      'inner join tb_financial_payment fnp '+
      'on (fnl.tb_order_id = fnp.tb_order_id)  '+
      '     and (fnl.tb_institution_id = fnp.tb_institution_id) '+
      '     and (fnl.parcel = fnp.parcel)  '+

      '   inner join tb_payment_types pmt '+
      '   on (pmt.id = fnl.tb_payment_types_id)  '+
      'where (ors.tb_institution_id =? ) '+
      ' and (ors.tb_salesman_id =?) ';
      if (tb_customer_id == 0){
        sqltxt = sqltxt + ' and (ors.tb_customer_id <> ?) ';
      }else{
        sqltxt = sqltxt + ' and (ors.tb_customer_id = ?) ';
      }
      sqltxt = sqltxt + 
      ' and (fnl.dt_record between ? and ?) '+
      'group by 1 ';

      Tb.sequelize.query(
        sqltxt,
        {
          replacements: [tb_institution_id,tb_salesman_id,tb_customer_id,dataini,datafim],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {          
          var dataResult = [];
          var totalvalue = 0.0;   
          for(var item of data) {         
            totalvalue += Number(item.subtotal),
            dataResult.push({
            "description": item.name_payment_type,
            "tag_value": Number(item.subtotal),
            "kind": item.kind,
            });
          } 
          
          dataResult.push({
            "description": "Total Recebido",
            "tag_value": totalvalue,
            "kind": "summarized",
          });
          
          resolve(dataResult);
        })
        .catch(err => {
          reject("financialStatenebt.getOrderSale: " + err);
        });
    });
    return promise;
}  
}
module.exports = FinancialStatementController;