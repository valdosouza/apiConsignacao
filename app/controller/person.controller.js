const Base = require('../controller/base.controller.js')  
const db = require("../model");
const Tb = db.person;
class PersonController extends Base {

  static async getById(id) {    
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +        
        'from tb_person ' +
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
        .catch(error => {
          reject('Person.getById: ' + error);
        });
    });
    return promise;
  };

  static async insert(person) {

    const promise = new Promise((resolve, reject) => {
        if (person.rg_dt_emission == '')
          delete person.rg_dt_emission;
        if (person.birthday == '')
          delete person.birthday;

        Tb.create(person)
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject("Erro:"+ error);
            });
    });
    return promise;
  }  

  static getList(body) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_person '+
        'where id is not null',
        {
          //replacements: [body.tb_institution_id ],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(new Error("Entity:" + error));
        });
    });
    return promise;
  }

  static async update(person) {    
    const promise = new Promise((resolve, reject) => {
      if (person.rg_dt_emission == '') delete person.rg_dt_emission;
      if (person.birthday == '')  delete person.birthday;
      Tb.update(person,{
        where: { id: person.id }
      })
      .catch(error => {
        reject("Erro:"+ error);
      });
    });
    return promise;        
  }        

  static async delete(person) {
    const promise = new Promise((resolve, reject) => {
      Tb.destroy({
        where: {
          id: person.id,
        }
      })
        .then((data) => {
          resolve(data);
        })
        .catch(error => {
          reject("Person.delete:" + error);
        });
    });
    return promise;       
  }  

  static getByCPF(cpf) {
    
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +        
        'from tb_person    ' +
        'where ( cpf = ?) ', 
        {
          replacements: [cpf],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {   
          //deve retornar o vetor mesmo que vazio para a verificação na função subsequente
          resolve(data);
        })
        .catch(error => {
          reject(new Error("Algum erro aconteceu ao buscar o CNPJ"));
        });
    });
    return promise;
  };  

}

module.exports =  PersonController; 