const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.orderconsignmentitem;

class OrderConsignmentItemController extends Base {     

  static async getById(id,tb_institution_id,tb_product_id,kind) {    
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'Select * '+        
        'from tb_order_consignment_item  oci '+
        'where ( ct.id =?) '+
        ' and (tb_institution_id =?)'+
        ' and (tb_product_id =?)'+
        ' and (kind =?)', 
        {
          replacements: [id,tb_institution_id,tb_product_id,kind],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
            resolve(data[0]);
        })
        .catch(err => {
          reject('getById: ' + err);
        });
    });
    return promise;
  };

  static async insert(body) {      
    const promise = new Promise(async (resolve, reject) => {         
      Tb.create(body)
        .then(async (data)=>{
          resolve(data);
        })            
        .catch(err => {
          reject("OrderConsignmentItemController.insert:"+ err);
        });        
    });
    return promise;        
  }    


  static getList(tb_institution_id) {
      const promise = new Promise((resolve, reject) => {
        Tb.sequelize.query(
        '  select '+
        '  ord.id, '+
        '  ord.tb_institution_id, '+
        '  ord.tb_user_id, '+
        '  ora.tb_entity_id,'+
        '  etd.name_company name_entity,'+
        '  ord.dt_record, '+
        '  ora.number, '+
        '  ord.status, '+          
        ' CAST(ord.note AS CHAR(1000) CHARACTER SET utf8) note '+
        'from tb_order ord  '+
        '   inner join tb_order_consignment ora '+
        '   on (ora.id = ord.id)  '+
        '     and (ora.tb_institution_id = ord.tb_institution_id) '+
        '     and (ora.terminal = ord.terminal) '+
        '   inner join tb_entity etd '+
        '   on (etd.id = ora.tb_entity_id)  '+
        'where (ord.tb_institution_id =? ) ', 
          {
            replacements: [tb_institution_id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            resolve(data);
          })
          .catch(err => {
            reject("OrderConsignmentItemController.getlist: " + err);
          });
      });
      return promise;
  }
  

  static async delete(body) {      
      const promise = new Promise((resolve, reject) => {
        resolve("Em Desenvolvimento");
          /*
          Tb.delete(orderstockadjust)
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
module.exports = OrderConsignmentItemController;