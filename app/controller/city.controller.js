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

    static getbyIbge(ibge) {    
        const promise = new Promise((resolve, reject) => {
        Tb.sequelize.query(
            'Select *  ' +
            'from tb_city  '+            
            'where ( ibge like ? ) ',
            {
            replacements: [ibge.substring(0,5)+'%'],
            type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {          
            if (data) { resolve(data[0]) } else { resolve(Null) };
            })
            .catch(err => {
            reject(new Error(err+ " |"+ "Algum erro aconteceu ao buscar a cidades"));
            });
        });
        return promise;
    }  
    static getbyStateName(stateSigla,cityName) {    
        const promise = new Promise((resolve, reject) => {
        Tb.sequelize.query(
            'Select ct.* '+
            'from tb_city  ct '+
            '  inner join tb_state st '+
            '  on (st.id = ct.tb_state_id) '+
            'where (UPPER(abbreviation) =?) '+
            'and (UPPER(ct.name) =? ) ', 
            {
            replacements: [ String(stateSigla).toUpperCase(), String(cityName).toUpperCase()],
            type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {          
            if (data) { resolve(data[0]) } else { resolve(Null) };
            })
            .catch(err => {
            reject(new Error(err+ " |"+ "Algum erro aconteceu ao buscar a cidade"));
            });
        });
        return promise;
    }      
}
module.exports = CityController; 