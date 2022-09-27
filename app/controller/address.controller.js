const Base = require('../controller/base.controller.js')  
const db = require("../model");
const Tb = db.phone;
class AddressController extends Base {

  static async insert(address) {

    const promise = new Promise((resolve, reject) => {
        Tb.create(address)
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject("Erro:"+ err);
            });
    });
    return promise;
  }  

  static getList(body) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_phone '+
        'where id is not null',
        {
          //replacements: [body.tb_institution_id ],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Phone:" + err));
        });
    });
    return promise;
  }

  static async update(address) {
    
    const promise = new Promise((resolve, reject) => {
        Tb.update(address)
            .then((data) => {
                resolve(data);
            })
            .catch(err => {
                reject("Erro:"+ err);
            });
    });
    return promise;        
  }        

  static async delete(address) {
    
    const promise = new Promise((resolve, reject) => {
        Tb.delete(address)
            .then((data) => {
                resolve(data);
            })
            .catch(err => {
                reject("Erro:"+ err);
            });
    });
    return promise;        
  }  
}

module.exports = AddressController;
