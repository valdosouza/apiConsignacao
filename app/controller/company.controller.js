const Base = require('../controller/base.controller.js')  
const db = require("../model");
const Tb = db.company;
class CompanyController extends Base {

  static async getById(id) {    
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +        
        'from tb_company ' +
        'where ( id =?) ', 
        {
          replacements: [id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0)          
          resolve(data[0])
        else
          resolve(data);
        })
        .catch(err => {
          reject('Company.getById: ' + err);
        });
    });
    return promise;
  };

  static async insert(company) {
    const promise = new Promise((resolve, reject) => {
      
        
        Tb.create(company)
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject("Erro:"+ err);
            });
    });
    return promise;
  }  

  static getList(body) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_company '+
        'where id is not null',
        {
          //replacements: [body.tb_institution_id ],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Entity:" + err));
        });
    });
    return promise;
  }

  static async update(company) {    
    const promise = new Promise((resolve, reject) => {
      Tb.update(company,{
        where: { id: company.id }
      })
      .catch(err => {
        reject("Erro:"+ err);
      });
    });
    return promise;        
  }        

  static async delete(company) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
        Tb.delete(company)
            .then((data) => {
                resolve(data);
            })
            .catch(err => {
                reject("Erro:"+ err);
            });
      */
    });
    return promise;        
  }  

  static async getByCNPJ(cnpj) {
    
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +        
        'from tb_company    ' +
        'where ( cnpj = ?) ', 
        {
          replacements: [cnpj],
          type: Tb.sequelize.QueryTypes.SELECT
        })
        .then(data => {
          //deve retornar o vetor mesmo que vazio para a verificação na função subsequente
          resolve(data);
        })
        .catch(err => {
          reject('Company.getByCNPJ:'+err);
        });
    });
    return promise;
  };  

}

module.exports =  CompanyController; 