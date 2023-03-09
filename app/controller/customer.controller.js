const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.customer;
const entity = require('./entity.controller.js');
const company = require('./company.controller.js') ;
const person = require('./person.controller.js') ;
const address = require('./address.controller.js');
const phone = require('./phone.controller.js');
const salesRouteCustomer = require('./salesRouteCustomer.controller.js');

class CustomerController extends Base {
  static async getById(tb_institution_id,id) {    
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select '+
        'ct.id, '+
        'ct.tb_institution_id, '+
        'ct.tb_salesman_id, '+
        'slm.nick_trade salesman_name, '+
        'ct.tb_carrier_id, '+
        'ct.credit_status, '+
        'ct.credit_value, '+
        'ct.wallet, '+
        'ct.consumer, '+
        'ct.multiplier, '+
        'ct.active '+
        'from tb_customer  ct '+
        '  left outer join tb_entity slm '+
        '  on (slm.id = ct.tb_salesman_id) '+
        'where (ct.tb_institution_id =?) '+
        ' and  ( ct.id =?)', 
        {
          replacements: [tb_institution_id,id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0)          
          resolve(data[0])
        else
          resolve(data);
        })
        .catch(err => {
          reject('getById: ' + err);
        });
    });
    return promise;
  };

  static async getByDocNumber(tb_institution_id,docNumber) {    
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select '+
        'ct.id,  '+
        'ct.tb_salesman_id '+
        'from tb_customer  ct  '+
        '  inner join tb_person prs  '+
        '  on (prs.id = ct.id)  '+
        'where (ct.tb_institution_id =?)  '+
        ' and  ( prs.cpf = ?)  '+
        'union '+
        'Select  '+
        'ct.id,  '+
        'ct.tb_salesman_id '+
        'from tb_customer  ct  '+
        '  inner join tb_company cpn  '+
        '  on (cpn.id = ct.id)  '+
        'where (ct.tb_institution_id =?)  '+
        ' and  ( cpn.cnpj = ?)  ',
        {
          replacements: [tb_institution_id,docNumber,tb_institution_id,docNumber],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0)          
          resolve(data[0])
        else
          resolve(data);
        })
        .catch(err => {
          reject('getByDocNumber: ' + err);
        });
    });
    return promise;
  };

  static async save(body) {
    const promise = new Promise(async (resolve, reject) => {
      try{        
        
        var resultCustomer  = [];                
        if (body.customer.id > 0)
          resultCustomer  = await this.getById(body.customer.tb_institution_id,body.customer.id);        
        
        if (resultCustomer.length == 0){
          this.insert(body)
          .then(data => {
            resolve(data);
          })
        }else{           
          this.update(body)
          .then(() => {
            resolve(body);
          })
        }
      } catch(err) {            
        reject('Customer.save: '+err);
      }                  
    });
    return promise;
  }

  static async insert(body) {
    const promise = new Promise(async (resolve, reject) => {
      try{
        var resultDoc = [];
        
        if (body.person){          
          if (body.person.cpf != ""){          
            resultDoc  = await person.getByCPF(body.person.cpf);
          }
        }else{          
          resultDoc  = await company.getByCNPJ(body.company.cnpj);
        }              
        if (resultDoc.length == 0){                    
          this.insertComplete(body)
          .then(data => {
            resolve(data);
          })          
        } else{
          body.customer.id = resultDoc[0].id;
          this.insertParcial(body)
          .then(data => {
            resolve(data);
          })                   
        }        
      } catch(err) {            
        reject('Customer Insert: '+err);
      }                  
    });
    return promise;
  }

  static async insertComplete(body) {
    const promise = new Promise(async (resolve, reject) => {
      try{                
        entity.insert(body.entity)
        .then(data => {          
          body.entity.id =  data.id;          
          //Salva a pessoa Juridica                        
          if (body.company.cnpj != ""){            
            body.company.id = body.entity.id;
            company.insert(body.company)
              .catch(err => {
              reject("Erro:"+ err);
            });            
          }else{
            body.person.id = body.entity.id;             
            person.insert(body.person)
             .catch(err => {
               reject("Erro:"+ err);
             });
          }       
             
          //Salva o endereço  
          body.address.id = body.entity.id          
          address.insert(body.address)
            .catch(err => {
              reject("Erro:"+ err);
            });

          //Salva o Phone
          body.phone.id = body.entity.id;          
          phone.insert(body.phone)
            .catch(err => {
              reject("Erro:"+ err);
            });

          //Grava o customer
          body.customer.id = body.entity.id;                                                             
          Tb.create(body.customer)
          .catch(err => {
              reject("Erro:" + err);
          });

          //Salva o cliente na Rota de venda
          const dataRoute = {
            tb_institution_id : body.customer.tb_institution_id,
            tb_sales_route_id : body.customer.tb_sales_route_id,
            tb_customer_id : body.customer.id,
            sequence : 0,
            active : "S",
          };          
          salesRouteCustomer.insert(dataRoute)
            .catch(err => {
              reject("Erro:"+ err);
            });
          //REtornogeral              
          resolve(body);                       
        })
        .catch(err => {
          reject('Customer InsertComplete: '+err);
        });
      } catch(err) {            
        reject('Customer InsertComplete: '+err);
      }                  
    });
    return promise;
  }

  static async insertParcial(body) {
    const promise = new Promise(async (resolve, reject) => {
      try{        
        //Insere o customer
        const existCustomer = await this.getById(body.customer.tb_institution_id,body.customer.id);
        if (existCustomer.length == 0){
          Tb.create(body.customer);
        }else{
          Tb.update(body.customer,{
            where:{ id: body.customer.id}
          });
        }
        
        //Atualiza Entidade    
        body.entity.id = body.customer.id;
        entity.update(body.entity)
        //Atualiza  Person ou Company
        if (body.person){
          body.person.id = body.customer.id;
          company.update(body.person);
        }else{
          body.company.id = body.customer.id;
          person.update(body.company);
        }          
        //Atualiza o endereço  
        body.address.id = body.customer.id;
        address.save(body.address);
        //Salva o Phone
        body.phone.id = body.customer.id;
        phone.save(body.phone);
        //Salva o cliente na Rota de venda
        const dataRoute = {
          tb_institution_id : body.customer.tb_institution_id,
          tb_sales_route_id : body.customer.tb_sales_route_id,
          tb_customer_id : body.customer.id,
          sequence : 0,
          active : "S"
        };
        salesRouteCustomer.insert(dataRoute)
          .catch(err => {
            reject("Erro:"+ err);
          });
        
        //REtornogeral              
        resolve(body);        
      } catch(err) {            
        reject('Customer InsertParc: '+err);
      }                  
    });
    return promise;
  }


  static async update(body) {
    const promise = new Promise((resolve, reject) => {
        try{ 
          body.entity.id = body.customer.id
          entity.update(body.entity);
          
          if (body.person){
            body.person.id = body.customer.id
            person.update(body.person);
          }else{
            body.company.id = body.customer.id  
            company.update(body.company);
          }
          body.address.id = body.customer.id
          address.save(body.address);
          body.phone.id = body.customer.id
          phone.save(body.phone);
          const dataRoute = {
            tb_institution_id : body.customer.tb_institution_id,
            tb_sales_route_id : body.customer.tb_sales_route_id,
            tb_customer_id : body.customer.id,
            sequence : 0,
            active : "S"
          };
          salesRouteCustomer.update(dataRoute)   
          Tb.update(body.customer,{
            where: { id: body.customer.id }
          });          
          resolve(body);   
        } catch(err) {            
            reject('Customer.update: '+err);
        }  
    });
    return promise;        
  }        

  static getCustomer = (tb_institution_id,id) => {
    const promise = new Promise(async (resolve, reject) => {
      try{
        var result = {};
        const dataCustomer = await this.getById(tb_institution_id,id);
        var dataSalesRoute = await salesRouteCustomer.getByCustomer(tb_institution_id,id);
        dataCustomer['tb_sales_route_id'] = dataSalesRoute.tb_sales_route_id;
        dataCustomer['sales_route_name'] = dataSalesRoute.description;
        result.customer = dataCustomer;

        const dataEntity = await entity.getById(id);
        result.entity = dataEntity; 
        
        const dataPerson = await person.getById(id);        
        if (dataPerson.id){            
            result.person = dataPerson; 
        }
        const dataCompany = await company.getById(id);        
        if (dataCompany.id){            
          result.company = dataCompany; 
        }
        const dataAddress = await address.getById(id);
        result.address = dataAddress; 

        const dataPhone = await phone.getById(id,'');
        result.phone = dataPhone; 
        
        resolve(result);
      } 
      catch(err){
        reject('getCustomer: ' + err);
      } 
    });
    return promise;
  }

  static getList = (tb_institution_id) => {

    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select '+
        'et.id,  '+
        'et.name_company,  '+
        'et.nick_trade, '+
        ' "F" doc_kind, '+
        'pe.cpf doc_number '+
        'from tb_customer ct  '+
        '  inner join tb_entity et  '+
        '  on (ct.id = et.id)  '+
        '  inner join tb_person pe '+
        '  on (pe.id = et.id) '+
        'where ct.tb_institution_id =? '+
        'union '+
        'Select  '+
        'et.id,  '+
        'et.name_company,  '+
        'et.nick_trade, '+
        ' "J" doc_kind, '+
        'co.cnpj doc_number '+
        'from tb_customer ct  '+
        '  inner join tb_entity et  '+
        '  on (ct.id = et.id)  '+
        '  inner join tb_company co '+
        '  on (co.id = et.id) '+
        'where ct.tb_institution_id =? ',
        {
          replacements: [tb_institution_id,tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {          
          resolve(data);
        })
        .catch(err => {
          reject('Customer: '+err);
        });
    });
    return promise;
  }

  static getListSalesRoute = (tb_institution_id,tb_sales_route_id,tb_salesman_id) => {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select '+
        'src.tb_sales_route_id, '+
        'sr.description name_sales_route, '+
        'src.sequence, '+        
        'et.id,  '+
        'et.name_company,  '+
        'et.nick_trade, '+
        ' "F" doc_kind, '+
        'pe.cpf doc_number '+
        'from tb_customer ct  '+
        '  inner join tb_entity et  '+
        '  on (ct.id = et.id)  '+
        '  inner join tb_person pe '+
        '  on (pe.id = et.id) '+
        ' inner join tb_sales_route_customer src  '+
        ' on (ct.id = src.tb_customer_id )  '+
        ' and  (ct.tb_institution_id = src.tb_institution_id) '+
        ' inner  join  tb_sales_route sr  '+
        ' on (src.tb_sales_route_id = sr.id)  '+
        '  and  (src.tb_institution_id = sr.tb_institution_id) '+              
        'where ct.tb_institution_id =? '+        
        '  and ( (tb_sales_route_id =?) or (tb_sales_route_id =0))'+
        ' and (ct.tb_salesman_id = ?)'+
        'union '+
        'Select  '+
        'src.tb_sales_route_id, '+
        'sr.description name_sales_route, '+
        'src.sequence, '+        
        'et.id,  '+
        'et.name_company,  '+
        'et.nick_trade, '+
        ' "J" doc_kind, '+
        'co.cnpj doc_number '+
        'from tb_customer ct  '+
        '  inner join tb_entity et  '+
        '  on (ct.id = et.id)  '+
        '  inner join tb_company co '+
        '  on (co.id = et.id) '+
        ' inner  join tb_sales_route_customer src  '+
        ' on (ct.id = src.tb_customer_id )  '+
        ' and  (ct.tb_institution_id = src.tb_institution_id) '+
        ' inner  join  tb_sales_route sr  '+
        ' on (src.tb_sales_route_id = sr.id)  '+
        '  and  (src.tb_institution_id = sr.tb_institution_id) '+
        'where ct.tb_institution_id =? '+        
        '  and ( (tb_sales_route_id =?) or (tb_sales_route_id =0))'+   
        ' and (ct.tb_salesman_id = ?)'+     
        'order by 3 ',
        {
          replacements: [tb_institution_id,tb_sales_route_id,tb_salesman_id,tb_institution_id,tb_sales_route_id,tb_salesman_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {          
          resolve(data);
        })
        .catch(err => {
          reject('Customer.getListBySalesRoute: '+err);
        });
    });
    return promise;
  }

  static getListBySalesman = (tb_institution_id,tb_salesman_id) => {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select '+
        'ct.tb_salesman_id, '+
        'clb.name_company name_salesman, '+
        'et.id, '+
        'et.name_company, '+
        'et.nick_trade, '+
        ' "F" doc_kind, '+ 
        'pe.cpf doc_number '+
        'from tb_customer ct '+
        '  inner join tb_entity et '+
        '  on (ct.id = et.id) '+
        '  inner join tb_person pe '+
        '  on (pe.id = et.id) '+
        '  inner join tb_entity clb '+
        '  on (clb.id = ct.tb_salesman_id) '+
        'where ( ct.tb_institution_id =?) '+
        '  and ( ct.tb_salesman_id =?) '+
        'union '+
        'Select '+
        'ct.tb_salesman_id, '+
        'clb.name_company name_salesman, '+
        'et.id, '+
        'et.name_company, '+
        'et.nick_trade, '+
        ' "J" doc_kind, '+
        'co.cnpj doc_number '+
        'from tb_customer ct '+
        '  inner join tb_entity et '+
        '  on (ct.id = et.id) '+
        '  inner join tb_company co '+
        '  on (co.id = et.id) '+
        '  inner join tb_entity clb '+
        '  on (clb.id = ct.tb_salesman_id) '+
        'where (ct.tb_institution_id =?) '+
        '  and ( ct.tb_salesman_id =?)'+
        'order by 5 asc ',
        {
          replacements: [tb_institution_id,tb_salesman_id,tb_institution_id,tb_salesman_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {          
          resolve(data);
        })
        .catch(err => {
          reject('Customer.getListBySalesman: '+err);
        });
    });
    return promise;
  }

}
module.exports = CustomerController; 