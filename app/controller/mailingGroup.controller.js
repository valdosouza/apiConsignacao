const Base = require('./base.controller.js')
const db = require("../model");
const Tb = db.mailingGroup;

class MailingGroupController extends Base {

    // Save USer in the database
  static create = (mailingGroup) => {
    const promise = new Promise((resolve, reject) => {

      Tb.create(mailingGroup)
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao criar o Grupo de Email."));

        });
    });
    return promise;
  }

  static update = (id,mailingGroup) => {
    const promise = new Promise((resolve, reject) => {

      Tb.update(mailingGroup, {
        where: { id: id }
      })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao atualizar o Grupo de Email."));

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
          reject(new Error("Algum erro aconteceu ao Deletar o Grupo de Email."));

        });
    });
    return promise;
  }
}
module.exports = MailingGroupController; 


