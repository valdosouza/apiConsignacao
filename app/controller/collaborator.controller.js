const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.collaborator;
const entity = require('./entity.controller.js');
const person = require('./person.controller.js');
const company = require('./company.controller.js');
const address = require('./address.controller.js');
const phone = require('./phone.controller.js');
const user = require('./user.controller.js');
const md5 = require('md5');

class CollaboratorController extends Base {

  static async getById(tb_institution_id, id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * ' +
        'from tb_collaborator ' +
        'where (tb_institution_id =?) ' +
        ' and ( id =?) ',
        {
          replacements: [tb_institution_id, id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject('Collaborator.getById: ' + err);
        });
    });
    return promise;
  };

  static async save(collaborator) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (collaborator.collaborator.dt_admission == '')
          delete collaborator.collaborator.dt_admission;
        if (collaborator.collaborator.dt_resignation == '')
          delete collaborator.collaborator.dt_resignation;


        var resultCollaborator = [];
        if (collaborator.collaborator.id > 0)
          resultCollaborator = await this.getById(collaborator.collaborator.tb_institution_id, collaborator.collaborator.id);
        if (resultCollaborator.length == 0) {
          this.insert(collaborator)
            .then((data) => {
              resolve(data);
            })
        } else {
          this.update(collaborator)
            .then((data) => {
              resolve(data);
            })
        }
      } catch (err) {
        reject('Collaborator.save: ' + err);
      }
    });
    return promise;
  }

  static async insert(collaborator) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var resultDoc = [];
        if (collaborator.person.cpf != "") {
          resultDoc = await person.getByCPF(collaborator.person.cpf);
        } else {
          resultDoc = await company.getByCNPJ(collaborator.company.cnpj);
        }

        if (resultDoc.length == 0) {
          this.insertComplete(collaborator)
            .then((data) => {
              resolve(data);
            })
        } else {
          
          collaborator.collaborator.id = resultDoc[0].id;
          this.insertParcial(collaborator)
            .then((data) => {
              resolve(data);
            })
        }
      } catch (err) {
        reject('Collaborator Insert: ' + err);
      }
    });
    return promise;
  }

  static async insertComplete(collaborator) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        entity.insert(collaborator.entity)
          .then(data => {
            const entityId = data.id;
            collaborator.entity.id = entityId;
            //Salva a pessoa Juridica                        
            if (collaborator.company.cnpj != "") {
              collaborator.company.id = entityId;
              company.insert(collaborator.company)
                .catch(err => {
                  reject("company.insert:" + err);
                });
            } else {
              collaborator.person.id = entityId;
              person.insert(collaborator.person)
                .catch(err => {
                  reject("person.insert:" + err);
                });
            }

            //Salva o endereço  
            collaborator.address.id = entityId;
            address.insert(collaborator.address)
              .catch(err => {
                reject("address.insert" + err);
              });

            //Salva o Phone
            collaborator.phone.id = entityId;
            phone.insert(collaborator.phone)
              .catch(err => {
                reject("phone.insert:" + err);
              });

            //Grava o collaborator
            collaborator.collaborator.id = entityId;
            Tb.create(collaborator.collaborator)
              .catch(err => {
                reject("Tb.create.collaborator:" + err);
              });
            //Grava Usuario
            var userModel = {
              tb_institution_id: collaborator.collaborator.tb_institution_id,
              id: collaborator.entity.id,
              nick: collaborator.entity.nick_trade,
              email: collaborator.user.email,
              password: md5('12345'),
              kind: "Sistema",
              tb_device_id: 0,
              active: "S"
            }
            user.createAuto(userModel);
            
            //REtornogeral              
            resolve(collaborator);
          })
          .catch(err => {
            reject('Collaborator InsertComplete: ' + err);
          });
      } catch (err) {
        reject('Collaborator InsertComplete: ' + err);
      }
    });
    return promise;
  }

  static async insertParcial(collaborator) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        //Insere o collaborator        
        const existCollaborator = await this.getById(collaborator.collaborator.tb_institution_id, collaborator.collaborator.id);
        
        if (existCollaborator.length == 0) {
          
          Tb.create(collaborator.collaborator);
        } else {
          Tb.update(collaborator.collaborator, {
            where: { id: collaborator.collaborator.id }
          });
        }
        //Atualiza Entidade    
        collaborator.entity.id = collaborator.collaborator.id;
        entity.update(collaborator.entity)
        //Atualiza  Person ou Company
        if (collaborator.person) {
          collaborator.person.id = collaborator.collaborator.id;
          person.update(collaborator.person);
        } else {
          collaborator.company.id = collaborator.collaborator.id;
          //company.update(collaborator.company);
        }
        //Atualiza o endereço  
        collaborator.address.id = collaborator.collaborator.id;
        address.save(collaborator.address);
        //Salva o Phone
        collaborator.phone.id = collaborator.collaborator.id;
        phone.save(collaborator.phone);
        //Grava Usuario
        var userModel = {
          tb_institution_id: collaborator.collaborator.tb_institution_id,
          id: collaborator.entity.id,
          nick: collaborator.entity.nick_trade,
          email: collaborator.user.email,
          password: md5('12345'),
          kind: "Sistema",
          tb_device_id: 0,
          active: "S"
        }
        user.createAuto(userModel);
        //REtornogeral              
        resolve(collaborator);
      } catch (err) {
        reject('Collaborator InsertParcial: ' + err);
      }
    });
    return promise;
  }

  static async update(collaborator) {
    const promise = new Promise((resolve, reject) => {
      try {
        entity.update(collaborator.entity);

        if (collaborator.person) {
          person.update(collaborator.person);
        } else {
          company.update(collaborator.company);
        }
        address.save(collaborator.address);
        phone.save(collaborator.phone);

        Tb.update(collaborator.collaborator, {
          where: { id: collaborator.collaborator.id }
        });
        resolve(collaborator);
      } catch (err) {
        reject('Collaborator.update: ' + err);
      }
    });
    return promise;
  }

  static get = (tb_institution_id, id) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var result = {};
        const dataCollaborator = await this.getById(tb_institution_id, id);
        result.collaborator = dataCollaborator[0];
        const dataEntity = await entity.getById(id);
        result.entity = dataEntity;

        const dataPerson = await person.getById(id);
        if (dataPerson.id > 0) {
          result.person = dataPerson;
        }
        const dataCompany = await company.getById(id);
        if (dataCompany.id > 0) {
          result.company = dataCompany;
        }
        const dataAddress = await address.getById(id);
        result.address = dataAddress;

        const dataPhone = await phone.getById(id, 'Comercial');
        result.phone = dataPhone;

        const userEmail = await user.getEmailByEntity(id);
        result.user = { email: userEmail };

        resolve(result);
      }
      catch (err) {
        reject('collaborator.get: ' + err);
      }
    });
    return promise;
  }

  static getList = (tb_institution_id) => {

    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select ' +
        'et.id,  ' +
        'et.name_company,  ' +
        'et.nick_trade, ' +
        ' "F" doc_kind, ' +
        'pe.cpf doc_number, ' +
        ' et.tb_linebusiness_id, ' +
        ' ln.description name_linebusiness ' +
        'from tb_collaborator cl  ' +
        '  inner join tb_entity et  ' +
        '  on (cl.id = et.id)  ' +
        '  inner join tb_person pe ' +
        '  on (pe.id = et.id) ' +
        '  left outer join tb_linebusiness ln ' +
        '  on (ln.id = et.tb_linebusiness_id) ' +
        'where cl.tb_institution_id =? ' +
        'union ' +
        'Select  ' +
        'et.id,  ' +
        'et.name_company,  ' +
        'et.nick_trade, ' +
        ' "J" doc_kind, ' +
        'co.cnpj doc_number, ' +
        ' et.tb_linebusiness_id, ' +
        ' ln.description name_linebusiness ' +
        'from tb_collaborator cl  ' +
        '  inner join tb_entity et  ' +
        '  on (cl.id = et.id)  ' +
        '  inner join tb_company co ' +
        '  on (co.id = et.id) ' +
        '  left outer join tb_linebusiness ln ' +
        '  on (ln.id = et.tb_linebusiness_id) ' +
        'where cl.tb_institution_id =? ',
        {
          replacements: [tb_institution_id, tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject('Colaborador: ' + err);
        });
    });
    return promise;
  }

}

module.exports = CollaboratorController; 
