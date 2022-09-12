
const Base = require('../controller/base.controller.js')  
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.company;
class CompanyController extends Base {

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

  static getByCNPJ(cnpj) {
    
    const promise = new Promise((resolve, reject) => {
      Oper.sequelize.query(
        'Select co.* ' +        
        'from tb_company co   ' +
        'where ( co.cnpj = ?) ', 
        {
          replacements: [ cnpj],
          type: Oper.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data[0] != null)
            resolve(data);
          else
            resolve('0');
        })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao buscar o CNPJ"));
        });
    });
    return promise;
  };  

}

module.exports =  CompanyController; 