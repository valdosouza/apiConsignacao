const Base = require('../controller/base.controller.js');
const MailingController = require('../controller/mailing.controller');
const db = require("../model");
const TbEntity = db.entity;
const TbEntityHasMailing = db.entityHasMailing;
const TbInstitutionHasUser = db.TbInstitutionHasUser;

const TbUser = db.users;
var md5 = require('md5');
require("dotenv-safe").config();
var jwt = require('jsonwebtoken');

class UserController extends Base {

  // Save USer in the database
  static create = (user) => {
    const promise = new Promise((resolve, reject) => {

      MailingController.findOne(user.email)
      .then(data => {
        if (data){
          this.update(user);
        }else{          
          //Salva a entidade
          const dataEntity = {
            name_company: user.nick,
            nick_trade:user.nick,
            tb_line_business_id:0
          };              
          TbEntity.create(dataEntity)
          .then(data => {
            const entityId =  data.id;           
            //Salva o email
            const dataMailing = {
              email:user.email
            };            
            MailingController.create(dataMailing)
              .then(data=>{
                //Vincula a entidade e o email com Grupo do email especifico 2 - Sistema
                const MailingId = data.id;
                const entityHM = {
                  tb_entity_id:entityId,
                  tb_mailing_id:MailingId,
                  tb_mailing_group_id:"2"
                }
                TbEntityHasMailing.create(entityHM);

              });
            //Salva o Usuario
            const dataUser = {           
              id:entityId,
              password:user.password,
              kind:user.kindd
            };
            TbUser.create(dataUser);
            const dataInstitutionHU = {
              tb_institution_id:user.Institution,
              tb_user_id:entityId,
              kind:user.kind,
              active:"S"
            };
            TbInstitutionHasUser.create(dataInstitutionHU)
            //REtornogeral
            user.id = entityId;
            const dataResolve = {              
                "id":entityId,
                "nick":user.nick,
                "email": user.email,
                "kind":user.kind
            }            
            resolve(dataResolve); 
            
          })
            .catch(err => {
              reject(err)              
          });            
        }
      })

      
    });
    return promise;
  }

  static update = (user) => {
    const promise = new Promise((resolve, reject) => {
      try{
        //Salva a entidade
        const dataEntity = {
          name_company: user.nick_trade,
          nick_trade:user.nick_trade
        };              
        TbEntity.update(dataEntity,{
          where: { id: user.id }
        });
        const dataUser = {           
          id:entityId,
          password:user.password
        };
        TbUser.update(dataUser);
        //Atualiza a institution
        const dataInstitutionHU = {
          tb_institution_id:user.tb_institution_id,
          tb_user_id:entityId,
          kind:user.kind,
          active:user.active
        };
        //Atualiza o USer do institution
        TbInstitutionHasUser.update(dataInstitutionHU);
        const dataResolve = {              
          "id":entityId,
          "nick":user.nick,
          "email": user.email,
          "kind":user.kind
        };
        resolve(dataResolve); 
      } catch {            
        reject("Erro Found");
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
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao Deletar o Usuário."));

        });
    });
    return promise;
  }


  // Retrieve all from the database.
  static findAll = () => {
    const promise = new Promise((resolve, reject) => {
      TbUser.sequelize.query(
        'Select *  ' +
        'from tb_user  ',
        {
          type: TbUser.sequelize.QueryTypes.SELECT
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
  static findOne = (id) => {
    const promise = new Promise((resolve, reject) => {
      TbUser.findByPk(id)
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao buscar este Usuário"));
        });

    });
    return promise;
  }

  static getlist(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      TbUser.sequelize.query(
        'Select u.id  ' +
        'from tb_user u ' +
        '  inner join tb_institution_has_user ihu ' +
        '  on (u.id = ihu.tb_user_id) ' +
        'where (u.active="S") ' +
        ' and ihu.tb_institution_id =? ',
        {
          replacements: [tb_institution_id],
          type: TbUser.sequelize.QueryTypes.SELECT
        }
      ).then(data => {
        resolve(data);
      })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao buscar o Usuário"));
        });
    });
    return promise;
  }

  static getUserAuth(email, password) {
    
    const promise = new Promise((resolve, reject) => {
      TbUser.sequelize.query(
        'Select ihu.tb_institution_id, u.id, m.email, u.password, "" token '+
        'from tb_entity e '+
        '  inner join tb_entity_has_mailing ehm '+
        '  on (ehm.tb_entity_id = e.id) '+
        '  inner join tb_mailing m  '+
        '  on (ehm.tb_mailing_id = m.id)  '+
        '  inner join tb_user u  '+
        '  on (u.id = e.id) '+
        '  inner join tb_institution_has_user ihu  '+
        '  on (ihu.tb_user_id = u.id)  '+
        'where ( m.email=? ) ' +
        ' and ( u.password=? ) ',
        {
          replacements: [email, password.toUpperCase()],
          type: TbUser.sequelize.QueryTypes.SELECT
        }).then(data => {
          
          if (data) { resolve(data) } else { resolve(Null) };
        })
        .catch(err => {
          reject(new Error(err+ " |"+ "Algum erro aconteceu ao buscar o Usuário"));
        });
    });
    return promise;
  }

  static generateJWT(data) {
    const promise = new Promise((resolve) => {

      const now = Math.floor(Date.now() / 1000);
      
      const userId =  data[0].id;
      const institutionId =  data[0].tb_institution_id;
      const userEmail = data[0].email;
            
      const payload = {
        id: userId,
        institution : institutionId,
        email: userEmail        
      }      
      
      var token =jwt.sign({ payload }, process.env.SECRET, {expiresIn: "15d",algorithm: 'HS256' });
      const result = {
        auth: true,
        id: userId,
        institution : institutionId,
        username: userEmail,
        password: "",
        jwt : token,
      }     
      resolve(result);
    });
    return promise;
  }

  static authorization(token){
    const promise = new Promise((resolve,reject) => {    
      try {
        //{expiresIn: "15d",algorithm: 'HS256'}
        jwt.verify(token, process.env.SECRET, function(err, decoded) { 
          if (err) {
            resolve( err); 
          } else {
            //se tudo correr bem, salver a requisição para o uso em outras rotas            
            resolve( decoded); 
            //next();
          }
        });
      } catch {
        reject("Bad Token");
      }      
    });
    return promise;
  }

}

module.exports = UserController; 