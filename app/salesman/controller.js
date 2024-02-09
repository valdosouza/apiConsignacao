const Base = require('../controller/base.controller.js');
const db = require("../model/index.js");
const Tb = db.salesman;

class SalesmanController extends Base {

  static getlist(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select slm.id,slm.tb_institution_id, etd.name_company, nick_trade  ' +
        'from tb_collaborator slm  ' +
        '  inner join tb_entity etd ' +
        '  on (etd.id = slm.id)' +
        'where (tb_institution_id = ?)',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            resolve(data);
          } else {
            resolve({ id: 0, tb_institution_id: tb_institution_id, name: "", nick: "", })
          }
        })
        .catch(error => {
          reject("SalesmanController.getlist:" + error);
        });
    });
    return promise;
  }

}
module.exports = SalesmanController; 