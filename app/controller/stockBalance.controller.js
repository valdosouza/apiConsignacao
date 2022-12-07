const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.stockBalance;
const product = require("./product.controller.js");

class StockBalanceController extends Base {     
    
  static async insert(price) {      
    const promise = new Promise(async (resolve, reject) => {
        Tb.create(price)
          .then((data) => {             
            resolve(data);
          })
          .catch(err => {
            reject("price.insert:"+ err);
          });        
    });
    return promise;        
  }    

  static getList(tb_institution_id,tb_stock_list_id) {
      const promise = new Promise((resolve, reject) => {
        Tb.sequelize.query(
          'select '+
          'stb.tb_institution_id, '+
          'stb.tb_stock_list_id, '+
          'stl.description name_stock_list, '+
          'stb.tb_merchandise_id, '+
          'prd.description name_merchandise, '+
          'stb.quantity '+
          'from tb_stock_balance stb '+
          '  inner join tb_stock_list stl   '+
          '  on (stl.id = stb.tb_stock_list_id) '+
          '    and (stl.tb_institution_id = stb.tb_institution_id) '+
          '  inner join tb_product prd '+
          '  on (prd.id = stb.tb_merchandise_id)  '+
          'where stb.tb_institution_id =? '+
          '  and stb.tb_stock_list_id =? ',          
          {
            replacements: [tb_institution_id,tb_stock_list_id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {              
            resolve(data);
          })
          .catch(err => {
            reject("StockBalance.getlist: " + err);
          });
      });
      return promise;
  }

  static async delete(price) {      
      const promise = new Promise((resolve, reject) => {
        resolve("Em Desenvolvimento");
          /*
          Tb.delete(price)
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
    
  static autoInsertByStokcList(tb_institution_id,tb_stock_list_id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataProduct = await product.getList(tb_institution_id);
        var dataPrice = {};
        for (var item of dataProduct){
          dataPrice ={
            tb_institution_id: tb_institution_id,
            tb_stock_list_id: tb_stock_list_id,
            tb_merchandise_id: item.id,
            quantity : 0
          }
          await Tb.create(dataPrice);
        }
        resolve("Estoque adicionado");
      } catch (err) {
        reject('autoInsertByStockList: ' + err)
      }
    });
    return promise;
  }  
}
module.exports = StockBalanceController;