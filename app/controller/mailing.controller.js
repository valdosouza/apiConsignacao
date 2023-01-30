const Base = require('../controller/base.controller.js')
const db = require("../model");
const Tb = db.mailing;

class MailingController extends Base {

  // Save USer in the database
  static create = (mailing) => {
    const promise = new Promise((resolve, reject) => {

      Tb.create(mailing)
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao criar o Email. "+ err));

        });
    });
    return promise;
  }

  static update = (mailing) => {
    const promise = new Promise((resolve, reject) => {

      Tb.update(mailing, {
        where: { id: mailing.id }
      })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao atualizar o Email."));

        });
    });
    return promise;
  }

  static delete = (id) => {
    const promise = new Promise((resolve, reject) => {

      Tb.delete({
        where: { id: id }
      })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao Deletar o Email."));

        });
    });
    return promise;
  }

  
  // Retrieve all from the database.
  static findAll = () => {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_mailing  ',
        {          
          type: Tb.sequelize.QueryTypes.SELECT
        }
      ).then(data => {
        resolve(data);
      })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao buscar Email"));
        });
    });
    return promise;
  }

  static findByEntityId = (entityId) => {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_mailing m '+
        '  inner join tb_entity_has_mailing ehm '+
        '  on (ehm.tb_mailing_id = m.id ) '+
        'where (ehm.tb_entity_id =?)',
        {
          replacements: [entityId],
          type: Tb.sequelize.QueryTypes.SELECT
        }
      ).then(data => {
        resolve(data);
      })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao buscar Email"));
        });
    });
    return promise;
  }

  // Find a single mailing with an id
  static findOne = (email) => {
    const promise = new Promise((resolve, reject) => {            
      Tb.findOne(
          { where: { email: email } 
      })
      .then(data => {
        if (data) {
          resolve(data)
        } else {
          resolve(null)
        };
      })
      .catch(err => {
        reject(new Error("Algum erro aconteceu ao buscar email" + err));
      });
    });
    return promise;
  }

  static getlist() {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select u.id  ' +
        'from tb_mailing m ' ,        
        {
          //replacements: [tb_institution_id],//*depois fazer certo
          type: Tb.sequelize.QueryTypes.SELECT
        }
      ).then(data => {
        resolve(data);
      })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao buscar Email"));
        });
    });
    return promise;
  }

  
}


module.exports = MailingController; 


