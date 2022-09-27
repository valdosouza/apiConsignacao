const Base = require('../controller/base.controller.js')
const db = require("../model");
const Op = db.Sequelize.Op;
const TbInstitution = db.institution;
const entity = require('../controller/entity.controller.js');
const TbEntity = db.entity;
const company = require('../controller/company.controller.js') ;
const TbCompany = db.company;
const address = require('../controller/address.controller.js');
const TbAddress = db.address;
const phone = require('../controller/phone.controller.js');
const TbPhone = db.phone;

class InstitutionController extends Base {


  static async insert(institution) {

    const promise = new Promise(async (resolve, reject) => {
      const dataCompany  = await company.getByCNPJ(institution.cnpj);    
      if (dataCompany != '0'){
        update(institution); 
      }else{
          //Salva a entidad
          const dataEntity = {
            name_company: institution.name_company,
            nick_trade:institution.nick_trade,
            aniversary:institution.dt_foundation,
            tb_institution_id:institution.tb_institution_id,
            note:institution.note                        
          };                    
          
          TbEntity.create(dataEntity)
            .then(data => {
              institution.id =  data.id;
              //Salva a pessoa Juridica              
              const dataCompany = {
                id:institution.id,
                cnpj:institution.cnpj,
                ie:institution.ie,
                im:institution.im,
                iest:institution.iest,
                crt:institution.crt,
                crt_modal:institution.crt_modal,
                ind_ie_destinatario:institution.ind_ie_destinatario,
                iss_ind_exig:institution.iss_ind_exig,
                iss_retencao:institution.iss_retencao,
                iss_inc_fiscal:institution.iss_inc_fiscal,
                iss_process_number:institution.iss_process_number,
                send_xml_nfe_only:institution.send_xml_nfe_only
              };
              TbCompany.create(dataCompany)
                .then((data) => {
                  resolve(data);
                })
                .catch(err => {
                  reject("Erro:"+ err);
                });
              
              //Salva o endereço          
              const dataAddress = {            
                id:institution.id,
                street:institution.street,
                nmbr:institution.nmbr,
                complement:institution.complement,
                neighborhood:institution.neighborhood,
                region:institution.region,
                kind:institution.kind,
                zip_code:institution.zip_code,
                tb_country_id:institution.tb_country_id,
                tb_state_id:institution.tb_state_id,
                tb_city_id:institution.tb_city_id,
                main:institution.main,
                longitude:institution.longitude,
                latitude:institution.latitude
              };
              TbAddress.create(dataAddress)
                .then((data) => {
                  resolve(data);
                })
                .catch(err => {
                  reject("Erro:"+ err);
                });
              //Salva o Phone
              const dataPhone = {
                id:institution.id,
                kind:institution.phone_kind,
                address_kind:institution.address_kind,
                number:institution.phone_number,
                contact:institution.contact
              };
              TbPhone.create(dataPhone)
                .then((data) => {
                  resolve(data);
                })
                .catch(err => {
                  reject("Erro:"+ err);
                });
              //Grava o institution
              const dataInstitution = {
                id:institution.id,
                active:institution.active
              }
              TbInstitution.create(dataInstitution)
                .then(data => {
                  resolve(data);
                })
                .catch(err => {
                  reject("Erro:" + err);
                });
              //REtornogeral
              resolve(institution);

            })
            .catch(err => {
              console.log("Erro:"+ err);
          });
      }
    });
    return promise;
  }

  static async update(institution) {
    const promise = new Promise((resolve, reject) => {
        try{  //Salva a entidad
          const dataEntity = {
            id:institution.id,
            name_company: institution.name_company,
            nick_trade:institution.nick_trade,
            aniversary:institution.dt_foundation,
            tb_institution_id:institution.tb_institution_id,
            note:institution.note                        
          };       
          TbEntity.update(dataEntity, {
            where: { id: dataEntity.id }
           });
          //Salva a pessoa Juridica              
          const dataCompany = {
            id:institution.id,
            cnpj:institution.cnpj,
            ie:institution.ie,
            im:institution.im,
            iest:institution.iest,
            crt:institution.crt,
            crt_modal:institution.crt_modal,
            ind_ie_destinatario:institution.ind_ie_destinatario,
            iss_ind_exig:institution.iss_ind_exig,
            iss_retencao:institution.iss_retencao,
            iss_inc_fiscal:institution.iss_inc_fiscal,
            iss_process_number:institution.iss_process_number,
            send_xml_nfe_only:institution.send_xml_nfe_only
          };
          TbCompany.update(dataCompany, {
            where: { id: dataCompany.id }
          });
          //Salva o endereço          
          const dataAddress = {            
            id:institution.id,
            street:institution.street,
            nmbr:institution.nmbr,
            complement:institution.complement,
            neighborhood:institution.neighborhood,
            region:institution.region,
            kind:institution.address_kind,
            zip_code:institution.zip_code,
            tb_country_id:institution.tb_country_id,
            tb_state_id:institution.tb_state_id,
            tb_city_id:institution.tb_city_id,
            main:institution.main,
            longitude:institution.longitude,
            latitude:institution.latitude
          };          
          TbAddress.update(dataAddress, {
            where: { id: dataAddress.id, kind:dataAddress.kind }
           });
          //Salva o Phone
          const dataPhone = {
            id:institution.id,
            kind:institution.phone_kind,
            address_kind:institution.address_kind,
            number:institution.phone_number,
            contact:institution.contact
          };
          TbPhone.update(dataPhone, {
            where: { id: dataPhone.id, kind:dataPhone.kind }
          });          
          //Grava o institution
          const dataInstitution = {
            id:institution.id,
            active:institution.active
          }
          TbInstitution.update(dataInstitution, {
            where: { id: dataInstitution.id }            
          });
          resolve("The Institution was updated");   
        } catch {            
            reject("Erro Found");
        }  
    });
    return promise;        
  }        

  static findAll = (institution) => {

    Institution.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro aconteceu ao Listar Estabelecimentos"
        });
      });
  };

  static getDelivery = (body) => {

    const promise = new Promise((resolve, reject) => {
      Oper.sequelize.query(
        'Select et.id,et.nick_trade, co.cnpj, a.zip_code, a.street,  ' +
        'a.nmbr, a.complement, a.neighborhood, c.name locality,   ' +
        's.abbreviation state, a.longitude ,  a.latitude, '+
        ' iv.km_value, iv.kind_calc_size, wp.id phone,co.cnpj   ' +
        'from tb_institution it  ' +
        '  inner join tb_entity et  ' +
        '  on (it.id = et.id)  ' +
        '  inner join tb_company co  ' +
        '  on (co.id = et.id)  ' +
        '  inner join tb_address a  ' +
        '  on (a.id =et.id)  ' +
        '  inner join tb_city c  ' +
        '  on (c.id = a.tb_city_id)  ' +
        '  inner join tb_state s  ' +
        '  on (s.id = a.tb_state_id)  ' +
        '  inner join tb_whatsapp wp  ' +
        '  on (wp.tb_institution_id = it.id) ' +
        '  inner join tb_institution_delivery iv  ' +
        '  on (iv.id = et.id)  ' +
        'where it.id =? ',
        {
          replacements: [body.tb_institution_id],
          type: Oper.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data[0] != null)
            resolve(data);
          else
            resolve('0');
        })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao buscar o Estabelecimento"));
        });
    });
    return promise;
  }
}

module.exports = InstitutionController; 
