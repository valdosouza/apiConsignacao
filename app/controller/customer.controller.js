const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.customer;
const entity = require('./entity.controller.js');
const company = require('./company.controller.js') ;
const person = require('./person.controller.js') ;
const address = require('./address.controller.js');
const phone = require('./phone.controller.js');

class CustomerController extends Base {
  static async getById(id) {    
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
        'where ( ct.id =?) ', 
        {
          replacements: [id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
            resolve(data[0]);
        })
        .catch(err => {
          reject('getById: ' + err);
        });
    });
    return promise;
  };

  static async save(customer) {
    const promise = new Promise(async (resolve, reject) => {
      try{        
        
        var resultCustomer  = [];                
        if (customer.customer.id > 0)
          resultCustomer  = await this.getById(customer.customer.id);        
        if (resultCustomer.length == 0){
          this.insert(customer)
          .then(data => {
            resolve(data);
          })
        }else{
          this.update(customer)
          .then(data => {
            resolve(data);
          })
        }
        resolve(customer);
      } catch(err) {            
        reject('Customer.save: '+err);
      }                  
    });
    return promise;
  }

  static async insert(customer) {
    const promise = new Promise(async (resolve, reject) => {
      try{
        var resultDoc = [];
        if (customer.person){
          resultDoc  = await person.getByCPF(customer.person.cpf);
        }else{
          resultDoc  = await company.getByCNPJ(customer.company.cnpj);
        }                
        if (resultDoc.length == 0){          
          this.insertComplete(customer)
          .then(data => {
            resolve(data);
          })
        } else{
          customer.customer.id = resultDoc[0].id;
          this.insertParcial(customer)
          .then(data => {
            resolve(data);
          })
        }
        resolve(customer);
      } catch(err) {            
        reject('Customer Insert: '+err);
      }                  
    });
    return promise;
  }

  static async insertComplete(customer) {
    const promise = new Promise(async (resolve, reject) => {
      try{        
        entity.insert(customer.entity)
        .then(data => {
          const entityId =  data.id;
          customer.entity.id =  entityId;          
          //Salva a pessoa Juridica                        
          if (customer.company){
            customer.company.id = entityId; 
            company.insert(customer.company)
              .catch(err => {
                reject("Erro:"+ err);
              });            
          }else{
            customer.person.id = entityId; 
            person.insert(customer.person)
             .catch(err => {
               reject("Erro:"+ err);
             });
          }       
             
          //Salva o endereço  
          customer.address.id = entityId;                                    
          address.insert(customer.address)
            .catch(err => {
              reject("Erro:"+ err);
            });

          //Salva o Phone
          customer.phone.id = entityId;              
          phone.insert(customer.phone)
            .catch(err => {
              reject("Erro:"+ err);
            });

          //Grava o customer
          customer.customer.id = entityId;                                         
          Tb.create(customer.customer)
            .catch(err => {
              reject("Erro:" + err);
            });
          
          //REtornogeral              
          resolve(customer);
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

  static async insertParcial(customer) {
    const promise = new Promise(async (resolve, reject) => {
      try{        
        //Insere o customer
        const existCustomer = await this.getById(customer.customer.id);
        if (existCustomer.length == 0){
          Tb.create(customer.customer);
        }else{
          Tb.update(customer.customer,{
            where:{ id: customer.customer.id}
          });
        }
        //Atualiza Entidade    
        customer.entity.id = customer.customer.id;
        entity.update(customer.entity)
        //Atualiza  Person ou Company
        if (customer.person){
          customer.person.id = customer.customer.id;
          company.update(customer.person);
        }else{
          customer.company.id = customer.customer.id;
          person.update(customer.company);
        }          
        //Atualiza o endereço  
        customer.address.id = customer.customer.id;
        address.save(customer.address);
        //Salva o Phone
        customer.phone.id = customer.customer.id;
        phone.save(customer.phone);
        //REtornogeral              
        resolve(customer);        
      } catch(err) {            
        reject('Customer InsertParcsabe: '+err);
      }                  
    });
    return promise;
  }


  static async update(customer) {
    const promise = new Promise((resolve, reject) => {
        try{ 
          customer.entity.id = customer.customer.id
          entity.update(customer.entity);
          
          if (customer.person){
            customer.person.id = customer.customer.id
            person.update(customer.person);
          }else{
            customer.company.id = customer.customer.id  
            company.update(customer.company);
          }
          customer.address.id = customer.customer.id
          address.save(customer.address);
          customer.phone.id = customer.customer.id
          phone.save(customer.phone);
          Tb.update(customer.customer,{
            where: { id: customer.customer.id }
          });          
          resolve("The Customer was updated");   
        } catch(err) {            
            reject('Customer.update: '+err);
        }  
    });
    return promise;        
  }        

  static getCustomer = (id) => {
    const promise = new Promise(async (resolve, reject) => {
      try{
        var result = {};
        const dataCustomer = await this.getById(id);
        result.customer = dataCustomer[0];
        const dataEntity = await entity.getById(id);
        result.entity = dataEntity; 

        const dataPerson = await person.getById(id);
        if (dataPerson.length > 0){            
            result.person = dataPerson; 
        }
        const dataCompany = await company.getById(id);
        if (dataCompany.length > 0){            
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
        ' "F" docType, '+
        'pe.cpf documento '+
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
        ' "J" docType, '+
        'co.cnpj documento '+
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

  static getListBySalesRoute = (tb_institution_id,tb_sales_route_id) => {

    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select '+
        'src.tb_sales_route_id, '+
        'src.sequencia, '+        
        'et.id,  '+
        'et.name_company,  '+
        'et.nick_trade, '+
        ' "F" docType, '+
        'pe.cpf documento '+
        'from tb_customer ct  '+
        '  inner join tb_entity et  '+
        '  on (ct.id = et.id)  '+
        '  inner join tb_person pe '+
        '  on (pe.id = et.id) '+
        '  inner join tb_sales_route_customer src '+
        '  on (src.tb_customer_id = ct.id) '+
        '   and  (src.tb_institution_id = ct.tb_institution_id) '+
        'where ct.tb_institution_id =? '+
        '  and tb_sales_route_id =?'+
        'union '+
        'Select  '+
        'src.tb_sales_route_id, '+
        'src.sequencia, '+        
        'et.id,  '+
        'et.name_company,  '+
        'et.nick_trade, '+
        ' "J" docType, '+
        'co.cnpj documento '+
        'from tb_customer ct  '+
        '  inner join tb_entity et  '+
        '  on (ct.id = et.id)  '+
        '  inner join tb_company co '+
        '  on (co.id = et.id) '+
        '  inner join tb_sales_route_customer src '+
        '  on (src.tb_customer_id = ct.id) '+
        '   and  (src.tb_institution_id = ct.tb_institution_id) '+
        'where ct.tb_institution_id =? '+
        '  and tb_sales_route_id =?',
        {
          replacements: [tb_institution_id,tb_sales_route_id,tb_institution_id,tb_sales_route_id],
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

}
module.exports = CustomerController; 