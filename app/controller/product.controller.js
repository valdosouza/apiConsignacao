const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.product;
const price = require('./price.controller.js');

class ProdcutController extends Base {     
  static async getNextId(tb_institution_id) {      
    const promise = new Promise((resolve, reject) => {        
      Tb.sequelize.query(
        'Select max(id) lastId ' +
        'from tb_product '+
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
          reject('product.getNexId: '+err);
        });           
    });
    return promise;
  }
    
  static async insert(product) {      
    const promise = new Promise(async (resolve, reject) => {        
        const nextId  = await this.getNextId(product.product.tb_institution_id);             
        product.product.id = nextId;
        if (product.validity == '') delete  product.product.validity;
        Tb.create(product.product)
          .then((data) => {    
            //grava o preço
            var pricelist = product.pricelist;
            var dataPrice = {};
            for(var item of pricelist) {              
              dataPrice = {
                tb_institution_id : product.product.tb_institution_id,
                tb_price_list_id : item.tb_price_list_id,
                tb_product_id : product.product.id,
                price_tag : item.price_tag
              }           
              //Quanto o insert é menos complexo insert direto não precisa do await no loop                     
              price.insert(dataPrice);
            };
            resolve(product);     
          })
          .catch(err => {
            reject("product.insert:"+ err);
          });        
    });
    return promise;        
  }    

  static getList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select '+
        'id, '+
        'tb_institution_id, '+
        'description, '+
        'active '+
        'from tb_product p '+
        'where (p.tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("product.getlist: " + err);
        });
    });
    return promise;
  }

  static autoInsertByPriceList(tb_institution_id,tb_price_list_id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        dataProduct = await this.getList(tb_institution_id);
        dataPrice = {};
        for (var item of dataProduct){
          dataPrice ={
            tb_institution_id: item.tb_instituion_id,
            tb_price_list_id: tb_price_list_id,
            tb_product_id: item.id,
            price_tag : 0
          }
          await price.insert(dataPrice);
        }
      } catch (err) {
        reject('autoInsertByPriceList: ' + err)
      }
    });
    return promise;
  }

  static async getById(tb_instituion_id,id) {    
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select '+
        'id, '+
        'tb_institution_id, '+
        'description, '+
        'active '+
        'from tb_product '+
        'where ( tb_institution_id =? ) '+
        ' and ( id=? )',
        {
          replacements: [tb_instituion_id,id],
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

  static get(tb_institution_id,id) {
    const promise = new Promise(async (resolve, reject) => {
      try{
        var result = {};
        
        if (id > 0){
          const dataProduct = await this.getById(tb_institution_id,id);            
          result.product = dataProduct;
        }else{
          result.product = {              
            id: 0,
            tb_institution_id: 1,
            description: "",
            active: "N"
          }
        }
        
        const dataPrice = await price.getList(tb_institution_id,id);
        result.pricelist = dataPrice; 
        
        resolve(result);
      } 
      catch(err){
        reject('get: ' + err);
      } 
    });
    return promise;
  }

  static async update(product) {        
    const promise = new Promise((resolve, reject) => {    

      if (product.validity == '') delete  product.product.validity;
      Tb.update(product.product,{
        where:{id:product.product.id}
      })       
      //grava o preço
      var pricelist = product.pricelist;
      var dataPrice = {};
      for(var item of pricelist) {              
        
        dataPrice = {
          tb_institution_id : product.product.tb_institution_id,
          tb_price_list_id : item.id,
          tb_product_id : product.product.id,
          price_tag : item.price_tag
        }                                
        price.update(dataPrice);            
      }
      resolve(product);     
    });
    return promise;        
  }        

  static async delete(product) {      
      const promise = new Promise((resolve, reject) => {
        resolve("Em Desenvolvimento");
          /*
          Tb.delete(product)
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
module.exports = ProdcutController;