const Base = require('../controller/base.controller.js');
const db = require("../model");
const Tb = db.state;

class CityController extends Base {

    static getlist(stateID) {
        const promise = new Promise((resolve, reject) => {
          Tb.sequelize.query(
            'Select *  ' +
            'from tb_city  '+
            'where tb_state_id=?',
            {
            replacements: [stateID],
            type: Tb.sequelize.QueryTypes.SELECT
            })
            .then(data => {          
                if (data) { resolve(data) } else { resolve(Null) };
                })
            .catch(err => {
              reject(new Error(err+ " |"+ "Algum erro aconteceu ao buscar as Cidades"));
            });
        });
        return promise;
    }

    static get(ibge) {    
        const promise = new Promise((resolve, reject) => {
        Tb.sequelize.query(
            'Select *  ' +
            'from tb_city  '+
            'where ( ibge=? ) ',
            {
            replacements: [ibge],
            type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {          
            if (data) { resolve(data[0]) } else { resolve(Null) };
            })
            .catch(err => {
            reject(new Error(err+ " |"+ "Algum erro aconteceu ao buscar as cidadess"));
            });
        });
        return promise;
    }  
}
module.exports = CityController; 