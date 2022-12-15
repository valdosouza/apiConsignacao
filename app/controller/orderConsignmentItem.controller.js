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


  static getCheckpointList(tb_institution_id,id) {
      const promise = new Promise((resolve, reject) => {
        Tb.sequelize.query(
          '  select '+
          '  oci.tb_product_id, '+
          '  pdt.description name_product, '+
          '  oci.bonus, '+
          '  oci.qty_consigned, '+
          '  oci.leftover, '+
          '  oci.qty_sold, '+
          '  oci.unit_value '+
          'from tb_product pdt '+
          '    left outer join tb_order_consignment_item oci '+
          '    on (pdt.id = oci.tb_product_id) '+
          '       and (pdt.tb_institution_id = oci.tb_institution_id) '+
          'where pdt.tb_institution_id  =? '+
          ' and oci.id =? '+
          ' and kind =? ',
          {
            replacements: [tb_institution_id,id,'checkpoint'],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {
            resolve(data);
          })
          .catch(err => {
            reject("OrderConsignmentItem.getCheckpointList: " + err);
          });
      });
      return promise;
  }
  
  static getSupplyingList(tb_institution_id,id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select '+
        '  oci.tb_product_id, '+
        '  pdt.description name_product, '+
        '  oci.bonus, '+
        '  oci.leftover, '+
        '  oci.devolution, '+        
        '  oci.qty_consignment new_consignment,'+
        '  oci.qty_consigned '+
        'from tb_product pdt '+
        '    left outer join tb_order_consignment_item oci '+
        '    on (pdt.id = oci.tb_product_id) '+
        '       and (pdt.tb_institution_id = oci.tb_institution_id) '+
        'where pdt.tb_institution_id  =? '+
        ' and oci.id =? '+
        ' and kind =? ',
        {
          replacements: [tb_institution_id,id,'supplying'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {          
          resolve(data);
        })
        .catch(err => {
          reject("OrderConsignmentItem.getSupplyingList: " + err);
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