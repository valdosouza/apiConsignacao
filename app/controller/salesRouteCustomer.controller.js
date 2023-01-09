const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.salesroutecustomer;

class SalesRouteCustomerController extends Base {        
    
  static async insert(salesroutecustomer) {      
    const promise = new Promise(async (resolve, reject) => {
        Tb.create(salesroutecustomer)
          .then((data) => {             
            resolve(data);
          })
          .catch(err => {
            reject("salesrouteCustomer.insert:"+ err);
          });        
    });
    return promise;        
  }    

  static getByCustomer(tb_institution_id,tb_customer_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select * , sr.description ' +
        'from tb_sales_route_customer src '+
        '  inner join tb_sales_route sr '+
        '  on (sr.id = src.tb_sales_route_id) '+
        '  and (sr.tb_institution_id = src.tb_institution_id) '+     
        'where (src.tb_institution_id =? ) '+
        ' and (src.tb_customer_id =? )',
        {
          replacements: [tb_institution_id,tb_customer_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0)          
          resolve(data[0])
        else
          resolve(data);
        })
        .catch(err => {
          reject('salesroute.get: '+err);
        });
    });
    return promise;
  }

  static getListByRoute(tb_institution_id,tb_sales_route_id,sequence,tb_customer_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select * ' +
        'from tb_sales_route_customer src '+
        'where (src.tb_institution_id =? ) '+
        ' and (src.tb_sales_route_id =? )'+
        ' and (sequence >= ?)'+
        ' and (sequence > 0)'+
        ' and (tb_customer_id <> ?) '+
        'order by sequence ',
        {
          replacements: [tb_institution_id,tb_sales_route_id,sequence,tb_customer_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {          
          resolve(data);
        })
        .catch(err => {
          reject('salesroute.get: '+err);
        });
    });
    return promise;
  }

  static async update(body) {        
    const promise = new Promise(async (resolve, reject) => {
      const route = await this.getByCustomer(body.tb_institution_id,
                                            body.tb_customer_id);

      if (route['tb_sales_route_id'] != body.tb_sales_route_id){          
        Tb.destroy({ where: { tb_institution_id: body.tb_institution_id,
                 tb_customer_id : body.tb_customer_id}
        })
        .then(() => {
          Tb.create(body,{
              where: { tb_sales_route_id: body.tb_sales_route_id, 
                       tb_institution_id: body.tb_institution_id,
                       tb_customer_id : body.tb_customer_id}
          })
          .then(data => {
            resolve(data);
          }) 
        })          
        .catch(err => {
          reject("salesrouteCustomer.delete:"+ err);
        });
      }else{
        resolve("Rotas Informada é igual a atual");
      }
      });
    return promise;        
  }        

  static async updateSequence(body) {        
    const promise = new Promise(async (resolve, reject) => {
      try {        
        var dataUpdate = {
          sequence : body.sequence
        };
        Tb.update(dataUpdate,{ 
          where: { tb_institution_id: body.tb_institution_id,
                   tb_sales_route_id:  body.tb_sales_route_id,                   
                   tb_customer_id : body.tb_customer_id}
        })
        .then(data => {
            resolve(data);
        })         
      } catch (error) {
        reject("salesrouteCustomer.updateSequence:"+ err);
      }
    });
    return promise;        
  }        
    
}
module.exports = SalesRouteCustomerController;