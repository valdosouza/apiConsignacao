const Base = require('../controller/base.controller.js');
const db = require("../model");
const Tb = db.state;

class StateController extends Base {

    static getlist() {
        const promise = new Promise((resolve, reject) => {
          Tb.sequelize.query(
            'Select *  ' +
            'from tb_state  ',
          ).then(data => {
            resolve(data[0]);
          })
            .catch(err => {
              reject(new Error("Algum erro aconteceu ao buscar o Estado"));
            });
        });
        return promise;
    }

    static get(abbreviation) {    
        const promise = new Promise((resolve, reject) => {
        Tb.sequelize.query(
            'Select *  ' +
            'from tb_state  '+
            'where ( abbreviation=? ) ',
            {
            replacements: [abbreviation.toUpperCase()],
            type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {          
            if (data) { resolve(data[0]) } else { resolve(Null) };
            })
            .catch(err => {
            reject(new Error(err+ " |"+ "Algum erro aconteceu ao buscar o Estado"));
            });
        });
        return promise;
    }  
}
module.exports = StateController; 