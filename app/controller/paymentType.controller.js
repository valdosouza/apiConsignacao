
const Base = require('../controller/base.controller.js')
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.paymentType;
class PaymentController extends Base {

  // Retrieve all from the database.
  static findAll = () => {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select *  ' +
        'from tb_payment_types  ',
        {
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
  static getlist(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select pt.id, pt.description  ' +
        'from tb_payment_types pt ' +
        '  inner join tb_institution_has_payment_types ihpt ' +
        '  on (pt.id = ihpt.tb_payment_types_id) ' +
        'where (app_delivery="S") '+
        ' and ihpt.tb_institution_id =? ',
        {
          replacements: [tb_institution_id],
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

module.exports = PaymentController; 