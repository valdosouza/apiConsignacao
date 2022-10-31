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
        'Select * ' +        
        'from tb_customer    ' +
        'where ( id =?) ', 
        {
          replacements: [id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
            resolve(data);
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
          this.insert(customer);  
        }else{
          this.update(customer);
        }
        resolve(customer);
      } catch(err) {            
        reject('Customer sabe: '+err);
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
          this.insertComplete(customer) ;
        } else{
          customer.customer.id = resultDoc[0].id;
          this.insertParcial(customer) ;
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
              .then((data) => {
                resolve(data);
              })
              .catch(err => {
                reject("Erro:"+ err);
              });            
          }else{
            customer.person.id = entityId; 
            person.insert(customer.person)
             .then((data) => {
               resolve(data);
             })
             .catch(err => {
               reject("Erro:"+ err);
             });
          }       
             
          //Salva o endereço  
          customer.address.id = entityId;                                    
          address.insert(customer.address)
            .then((data) => {
              resolve(data);
            })
            .catch(err => {
              reject("Erro:"+ err);
            });

          //Salva o Phone
          customer.phone.id = entityId;              
          phone.insert(customer.phone)
            .then((data) => {
              resolve(data);
            })
            .catch(err => {
              reject("Erro:"+ err);
            });

          //Grava o customer
          customer.customer.id = entityId;                                         
          Tb.create(customer.customer)
            .then(data => {
              resolve(data);
            })
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
          entity.update(customer.entity);
          
          if (customer.person){
            person.update(customer.person);
          }else{
            company.update(customer.company);
          }
          address.save(customer.address);
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
        result.custommer = dataCustomer[0];
        const dataEntity = await entity.getById(id);
        result.entity = dataEntity[0]; 

        const dataPerson = await person.getById(id);
        if (dataPerson.length > 0){            
            result.person = dataPerson[0]; 
        }
        const dataCompany = await company.getById(id);
        if (dataCompany.length > 0){            
          result.company = dataCompany[0]; 
        }
        const dataAddress = await address.getById(id);
        result.address = dataAddress[0]; 

        const dataPhone = await phone.getById(id,'');
        result.phone = dataPhone[0]; 
        
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

}
module.exports = CustomerController; 