const Base = require('../controller/base.controller.js')
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.institution;

class InstitutionController extends Base {


  static async insert(institution) {

    const promise = new Promise((resolve, reject) => {
      Tb.create(institution)
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("Erro:" + err);
        });
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
