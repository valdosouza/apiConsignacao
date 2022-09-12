
const Base = require('../controller/base.controller.js')  
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.person;
class PersonController extends Base {


  static async insert(person) {

    const promise = new Promise((resolve, reject) => {
        Tb.create(person)
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject("Erro:"+ err);
            });
    });
    return promise;
  }  
  
  static getByCPF(cpf) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select p.* ' +
        'from tb_person p ' +
        'where (p.cpf =?) ',
        {
          replacements: [cpf],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data[0] != null)
            resolve(data);
          else
            resolve('0');
        })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao buscar o CPF"));
        });
    });
    return promise;
  }
}

module.exports =  PersonController; 