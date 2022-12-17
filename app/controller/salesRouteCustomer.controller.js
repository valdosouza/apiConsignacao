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
        'select * ' +
        'from tb_sales_route_customer src '+
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

    
}
module.exports = SalesRouteCustomerController;