const Base = require('../controller/base.controller.js')
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.mailing;
class MailingController extends Base {

  // Save USer in the database
  static create = (user) => {
    const promise = new Promise((resolve, reject) => {

      Tb.create(user)
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao criar o Usuário."));

        });
    });
    return promise;
  }

  static update = (id,user) => {
    const promise = new Promise((resolve, reject) => {

      Tb.update(user, {
        where: { id: id }
      })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao atualizar o Usuário."));

        });
    });
    return promise;
  }

  static delete = (id) => {
    const promise = new Promise((resolve, reject) => {

      Tb.destroy({
        where: { id: id }
      })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao Deletar o Usuário."));

        });
    });
    return promise;
  }

  
  // Retrieve all from the database.
  static findAll = () => {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select id  ' +
        'from tb_user  ',
        {
          type: Tb.sequelize.QueryTypes.SELECT
        }
      ).then(data => {
        resolve(data);
      })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao buscar Usuário"));
        });
    });
    return promise;
  }

  // Find a single user with an id
  static findOne = (email) => {
    const promise = new Promise((resolve, reject) => {      
      Tb.findOne({ where: { email: email } })
      .then(data => {
        if (data) {resolve(data)} else {resolve(null)};
      })
      .catch(err => {
        reject(new Error("Algum erro aconteceu ao buscar email"));
      });

    });
    return promise;
  }

  static getlist(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select u.id  ' +
        'from tb_mailing m ' ,        
        {
          replacements: [tb_institution_id],//*depois fazer certo
          type: Tb.sequelize.QueryTypes.SELECT
        }
      ).then(data => {
        resolve(data);
      })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao buscar Forma de Pagamento"));
        });
    });
    return promise;
  }
}

module.exports = MailingController; 


