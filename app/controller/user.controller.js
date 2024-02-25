const Base = require('../controller/base.controller.js');
const MailingController = require('../controller/mailing.controller');
const db = require("../model");
const TbEntity = db.entity;
const TbEntityHasMailing = db.entityHasMailing;
const TbInstitutionHasUser = db.TbInstitutionHasUser;

const TbUser = db.users;
var md5 = require('md5');

var jwt = require('jsonwebtoken');

class UserController extends Base {

  // Save USer in the database
  static create = (user) => {
    const promise = new Promise((resolve, reject) => {
      MailingController.findOne(user.email)
        .then(data => {
          if (data) {
            this.update(user);
          } else {
            //Salva a entidade
            const dataEntity = {
              name_company: user.nick,
              nick_trade: user.nick,
              tb_linebusiness_id: 0
            };
            TbEntity.create(dataEntity)
              .then(async data => {
                user.id = data.id;
                //Salva o email
                const dataMailing = {
                  email: user.email
                };
                await MailingController.create(dataMailing)
                  .then(data => {
                    //Vincula a entidade e o email com Grupo do email especifico 2 - Sistema
                    const MailingId = data.id;
                    const entityHM = {
                      tb_entity_id: user.id,
                      tb_mailing_id: MailingId,
                      tb_mailing_group_id: "2"
                    }
                    TbEntityHasMailing.create(entityHM);

                  });
                //Salva o Usuario
                const dataUser = {
                  id: user.id,
                  password: user.password,
                  kind: user.kind,
                  kind_device: user.kind_device
                };
                await TbUser.create(dataUser);
                const dataInstitutionHU = {
                  tb_institution_id: user.tb_institution_id,
                  tb_user_id: user.id,
                  kind: user.kind,
                  active: "S"
                };
                await TbInstitutionHasUser.create(dataInstitutionHU);
                //REtornogeral
                const dataResolve = {
                  id: user.id,
                  tb_institution_id: user.tb_institution_id,
                  password: '',
                  kind: user.kind,
                  tb_device_id: 0,
                  active: user.active,
                  email: user.email,
                  nick: user.nick,
                  kind_device: user.kind_device
                }
                resolve(dataResolve);

              })
              .catch(error => {
                reject(error)
              });
          }
        })


    });
    return promise;
  }


  // Save USer in the database
  static createAuto = (user) => {
    const promise = new Promise(async (resolve, reject) => {
      //Salva o email
      const dataMailing = {
        email: user.email
      };
      await MailingController.create(dataMailing)
        .then(async data => {
          //Vincula a entidade e o email com Grupo do email especifico 2 - Sistema
          const MailingId = data.id;
          const entityHM = {
            tb_entity_id: user.id,
            tb_mailing_id: MailingId,
            tb_mailing_group_id: "2"
          }
          TbEntityHasMailing.create(entityHM);

          //Salva o Usuario
          const dataUser = {
            id: user.id,
            password: user.password,
            kind: user.kind,
            kind_device: user.kind_device
          };
          await TbUser.create(dataUser);
          const dataInstitutionHU = {
            tb_institution_id: user.tb_institution_id,
            tb_user_id: user.id,
            kind: user.kind,
            active: "S"
          };
          await TbInstitutionHasUser.create(dataInstitutionHU);
          resolve(data);
        })
        .catch(error => {
          reject(error)
        });
    });
    return promise;
  }


  static update = (user) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        //Salva a entidade
        const dataEntity = {
          name_company: user.nick,
          nick_trade: user.nick
        };
        TbEntity.update(dataEntity, {
          where: { id: user.id }
        })
          .catch(error => {
            reject(new Error("Update Usuário." + error));
          });
        //Atualiza o Mailing
        MailingController.findByEntityId(user.id)
          .then(async (data) => {
            const dataMailing = {
              id: data[0].id,
              email: user.email
            }
            await MailingController.update(dataMailing)
          });
        //Atualiza a institution
        const dataInstitutionHU = {
          tb_institution_id: user.tb_institution_id,
          tb_user_id: user.id,
          kind: user.kind,
          active: user.active
        };
        TbInstitutionHasUser.update(dataInstitutionHU, {
          where: { tb_institution_id: user.tb_institution_id, tb_user_id: user.id }
        });
        //Atualiza o Usuario
        const dataUser = {
          id: user.id,
          kind_device: user.kind_device,
        };
        TbUser.update(dataUser, {
          where: { id: user.id }
        });

        const dataResolve = {
          id: user.id,
          tb_institution_id: user.tb_institution_id,
          password: '',
          kind: user.kind,
          tb_device_id: 0,
          active: user.active,
          email: user.email,
          nick: user.nick
        };
        resolve(dataResolve);
      } catch (e) {
        reject("Erro Found:" + e);
      }
    });
    return promise;
  }

  static delete = (id) => {
    const promise = new Promise((resolve, reject) => {

      TbUser.delete({
        where: { id: id }
      })
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(new Error("Deletar Usuário." + error));
        });
    });
    return promise;
  }


  // Find a single user with an id
  static get = (email) => {
    const promise = new Promise((resolve, reject) => {
      TbUser.sequelize.query(
        'Select u.id, ihu.tb_institution_id, et.nick_trade nick, ma.email, u.kind ' +
        'from tb_user u  ' +
        '  inner join tb_institution_has_user ihu  ' +
        '  on (u.id = ihu.tb_user_id)  ' +
        '  inner join tb_entity et ' +
        '  on (et.id = u.id) ' +
        '  inner join tb_entity_has_mailing ehm ' +
        '  on (ehm.tb_entity_id = et.id) ' +
        '  inner join tb_mailing ma ' +
        '  on (ehm.tb_mailing_id = ma.id) ' +
        'where (u.kind="sistema") ' +
        ' and ( ma.email =?) ',
        {
          replacements: [email],
          type: TbUser.sequelize.QueryTypes.SELECT
        }
      ).then(data => {
        resolve(data[0]);
      })
        .catch(error => {
          reject(new Error("Usuário: " + error));
        });
    });
    return promise;
  }

  static getById(id) {
    const promise = new Promise((resolve, reject) => {
      try {
        TbUser.sequelize.query(
          'Select u.* ' +
          'from tb_user u  ' +
          'where (u.id = ?) ',
          {
            replacements: [id],
            type: TbUser.sequelize.QueryTypes.SELECT
          }
        ).then(data => {
          if (data.length > 0) {
            resolve(data[0]);
          } else {
            resolve({ id: 0 });
          }
        })

      } catch (error) {
        reject("userController: " + error);
      }
    });
    return promise;
  }

  static getlist(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      TbUser.sequelize.query(
        'Select u.id, ' +
        ' ihu.tb_institution_id, ' +
        ' et.nick_trade nick, ' +
        ' ma.email, u.kind, ' +
        ' u.tb_device_id, ' +
        ' u.active, ' +
        ' u.kind_device ' +
        'from tb_user u  ' +
        '  inner join tb_institution_has_user ihu  ' +
        '  on (u.id = ihu.tb_user_id)  ' +
        '  inner join tb_entity et ' +
        '  on (et.id = u.id) ' +
        '  inner join tb_entity_has_mailing ehm ' +
        '  on (ehm.tb_entity_id = et.id) ' +
        '  inner join tb_mailing ma ' +
        '  on (ehm.tb_mailing_id = ma.id) ' +
        'where (u.active="S") ' +
        ' and ( ihu.tb_institution_id =?) ',
        {
          replacements: [tb_institution_id],
          type: TbUser.sequelize.QueryTypes.SELECT
        }
      ).then(data => {
        resolve(data);
      })
        .catch(error => {
          reject(new Error("Usuário: " + error));
        });
    });
    return promise;
  }

  static getUserAuth(email, password) {

    const promise = new Promise((resolve, reject) => {
      TbUser.sequelize.query(
        'Select ihu.tb_institution_id, u.id, ' +
        ' m.email, u.password, u.kind_device, "" token ' +
        'from tb_entity e ' +
        '  inner join tb_entity_has_mailing ehm ' +
        '  on (ehm.tb_entity_id = e.id) ' +
        '  inner join tb_mailing m  ' +
        '  on (ehm.tb_mailing_id = m.id)  ' +
        '  inner join tb_user u  ' +
        '  on (u.id = e.id) ' +
        '  inner join tb_institution_has_user ihu  ' +
        '  on (ihu.tb_user_id = u.id)  ' +
        'where ( m.email=? ) ' +
        ' and ( u.password=? ) ',
        {
          replacements: [email, password.toUpperCase()],
          type: TbUser.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(error + " |" + "Algum erro aconteceu ao buscar o Usuário");
        });
    });
    return promise;
  }

  static async getIdUserByEmail(email) {

    const promise = new Promise((resolve, reject) => {
      TbUser.sequelize.query(
        'Select u.id ' +
        'from tb_entity e ' +
        '  inner join tb_entity_has_mailing ehm ' +
        '  on (ehm.tb_entity_id = e.id) ' +
        '  inner join tb_mailing m  ' +
        '  on (ehm.tb_mailing_id = m.id)  ' +
        '  inner join tb_user u  ' +
        '  on (u.id = e.id) ' +
        '  inner join tb_institution_has_user ihu  ' +
        '  on (ihu.tb_user_id = u.id)  ' +
        'where ( m.email=? ) ',
        {
          replacements: [email],
          type: TbUser.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data[0]) {
            resolve(data[0].id)
          } else {
            resolve(0)
          };
        })
        .catch(error => {
          reject(error + " |" + "Algum erro aconteceu ao buscar o Usuário");
        });
    });
    return promise;
  }

  static async getEmailByEntity(entity) {

    const promise = new Promise((resolve, reject) => {
      TbUser.sequelize.query(
        'Select m.email ' +
        'from tb_entity e ' +
        '  inner join tb_entity_has_mailing ehm ' +
        '  on (ehm.tb_entity_id = e.id) ' +
        '  inner join tb_mailing m ' +
        '  on (ehm.tb_mailing_id = m.id) ' +
        '  inner join tb_user u ' +
        '  on (u.id = e.id) ' +
        '  inner join tb_institution_has_user ihu ' +
        '  on (ihu.tb_user_id = u.id) ' +
        'where ( e.id = ? ) ',
        {
          replacements: [entity],
          type: TbUser.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data[0]) {
            resolve(data[0].email)
          } else {
            resolve("")
          };
        })
        .catch(error => {
          reject(error + " |" + "Algum erro aconteceu ao buscar o Usuário");
        });
    });
    return promise;
  }

  static async getSalt(body) {

    const promise = new Promise((resolve, reject) => {
      TbUser.sequelize.query(
        'Select u.salt ' +
        'from tb_user u ' +
        'where ( u.id=? ) ' +
        ' and u.salt=?',
        {
          replacements: [body.tb_user_id, body.salt],
          type: TbUser.sequelize.QueryTypes.SELECT
        })
        .then(data => {
          if (data[0]) {
            resolve(data[0].salt)
          } else {
            resolve(0)
          };
        })
        .catch(error => {
          reject(new Error('Salt: ' + error));
        });
    });
    return promise;
  };

  static generateJWT(data) {
    const promise = new Promise((resolve) => {

      const now = Math.floor(Date.now() / 1000);

      const tbUserId = data[0].id;
      const tbInstitutionId = data[0].tb_institution_id;
      const userEmail = data[0].email;

      const payload = {
        id: tbUserId,
        tbInstitutionId: tbInstitutionId,
        email: userEmail
      }

      var token = jwt.sign({ payload }, process.env.SECRET, { expiresIn: "15d", algorithm: 'HS256' });
      const result = {
        "auth": true,
        "id": tbUserId,
        "tb_institution_id": tbInstitutionId,
        "username": userEmail,
        "password": "",
        "jwt": token,
        "error": "",
      }
      resolve(result);
    });
    return promise;
  }

  static authorization(token) {
    const promise = new Promise((resolve, reject) => {
      try {
        //{expiresIn: "15d",algorithm: 'HS256'}
        jwt.verify(token, process.env.SECRET, function (error, decoded) {
          if (error) {
            resolve(error);
          } else {
            //se tudo correr bem, salver a requisição para o uso em outras rotas            
            resolve(decoded);
            //next();
          }
        });
      } catch {
        reject("Bad Token");
      }
    });
    return promise;
  }



  static async recoveryPassword(email) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const tbUserId = await this.getIdUserByEmail(email);
        if (tbUserId > 0) {

          var hashSalt = Math.random() * (100000 - 999999) + 100000;
          hashSalt = Math.abs(hashSalt);
          hashSalt = Math.trunc(hashSalt);

          TbUser.sequelize.query(
            'update tb_user set ' +
            ' salt=? ' +
            'where id=? ',
            {
              replacements: [hashSalt, tbUserId],
              type: TbUser.sequelize.QueryTypes.UPDATE
            }
          )
            .then(() => {
              const dataResult = {
                tb_user_id: tbUserId,
                email: email,
                salt: hashSalt
              }
              resolve(dataResult);
            })
            .catch(error => {
              reject(new Error('Salt : ' + error));
            });
        } else {
          reject("este email não tem usuário vinculado.");
        };
      } catch (error) {
        // ... handle it locally
        throw new Error(error.message);
      }
    });
    return promise;
  }

  static async changePassword(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        TbUser.sequelize.query(
          'update tb_user set ' +
          ' password=?, ' +
          'salt = NULL ' +
          'where id=? ' +
          ' and salt=? ' +
          ' and salt is not NULL ',
          {
            replacements: [body.newPassword, body.tb_user_id, body.salt],
            type: TbUser.sequelize.QueryTypes.UPDATE
          }
        )
          .then(() => {
            const dataResult = {
              result: "true",
              message: "Senha alterada com Sucesso"
            }
            resolve(dataResult);
          })
          .catch(error => {
            reject(new Error("Erro ao alterar senha - " + error));
          });
      } catch (error) {
        throw new Error(error.message);
      }
    });
    return promise;
  }
}

module.exports = UserController; 