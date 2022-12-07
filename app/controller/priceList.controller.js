const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.pricelist;
const price = require('./price.controller.js');

class PriceListController extends Base {     
    static async getNextId(tb_institution_id) {      
      const promise = new Promise((resolve, reject) => {        
        Tb.sequelize.query(
          'Select max(id) lastId ' +
          'from tb_price_list '+
          'WHERE ( tb_institution_id =? ) ',
          {
            replacements: [tb_institution_id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {   
            if (data){
              const NextId = data[0].lastId + 1;
              resolve(NextId);
            }else{
              resolve(1);
            }
          })
          .catch(err => {
            reject('priceList.getNexId: '+err);
          });           
      });
      return promise;
    }
    
    static async insert(pricelist) {      
      const promise = new Promise(async (resolve, reject) => {
          const nextId  = await this.getNextId(pricelist.tb_institution_id);             
          pricelist.id = nextId;
          if (pricelist.validity == '') delete  pricelist.validity;
          Tb.create(pricelist)
            .then((data) => {  
              price.autoInsertByPriceList(pricelist.tb_institution_id,data.id);
              resolve(data);
            })
            .catch(err => {
              reject("priceList.insert:"+ err);
            });        
      });
      return promise;        
    }    

    static getList(tb_institution_id) {
        const promise = new Promise((resolve, reject) => {
          Tb.sequelize.query(
            'select  * ' +
            'from tb_price_list pl '+
            'where (pl.tb_institution_id =? ) ',
            {
              replacements: [tb_institution_id],
              type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {
              resolve(data);
            })
            .catch(err => {
              reject("pricelist.getlist: " + err);
            });
        });
        return promise;
    }

    static get(tb_institution_id,id) {
      const promise = new Promise((resolve, reject) => {
        Tb.sequelize.query(
          'select * ' +
          'from tb_price_list pl '+
          'where (pl.tb_institution_id =? ) '+
          ' and (pl.id =? )',
          {
            replacements: [tb_institution_id,id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            resolve(data[0]);
          })
          .catch(err => {
            reject('pricelist.get: '+err);
          });
      });
      return promise;
  }

    static async update(pricelist) {        
      const promise = new Promise((resolve, reject) => {
        if (pricelist.validity == '') delete  pricelist.validity;
          Tb.update(pricelist,{
            where: { id: pricelist.id,tb_institution_id: pricelist.tb_institution_id }
          })
          .then(data => {
            resolve(data);
          })          
          .catch(err => {
           reject("pricelist.update:"+ err);
          });
        });
      return promise;        
    }        

    static async delete(pricelist) {      
        const promise = new Promise((resolve, reject) => {
          resolve("Em Desenvolvimento");
            /*
            Tb.delete(pricelist)
                .then((data) => {
                    resolve(data);
                })
                .catch(err => {
                    reject("Erro:"+ err);
                });
            */
        });
        return promise;        
    }        
    
}
module.exports = PriceListController;