const Base = require('./base.controller.js')
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.deliveryRange;

class DeliveryRAngeController extends Base {

    static getDeliveryValue = (kmDistance,tb_institution_id) => {

        const promise = new Promise((resolve, reject) => {
          Oper.sequelize.query(
            'SELECT km_value kmValue '+
            'FROM tb_delivery_range '+
            'WHERE km_to >= '+kmDistance + ' and km_from <= '+kmDistance + 
            ' and (tb_institution_id =?)',
            {              
             replacements: [tb_institution_id],
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
module.exports = DeliveryRAngeController;
