const Base = require('./base.controller.js');
const db = require("../model");
const Tb = db.price;

class PriceController extends Base {     
    
  static async insert(price) {      
    const promise = new Promise(async (resolve, reject) => {
        
        if (price.validity == '') delete  price.validity;
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

  static getList(tb_institution_id,tb_product_id) {
      const promise = new Promise((resolve, reject) => {
        var sqltxt = '';
        if (tb_product_id > 0 ){
          sqltxt = 'select  distinct  '+
          'pl.id tb_price_list_id,  '+
          'pl.description name_price_list,  '+
          'coalesce(p.price_tag,0) as  price_tag  '+
          'from tb_price_list pl  '+
          '  left outer join tb_price p  '+
          '  on (pl.id = p.tb_price_list_id)  '+
          '  and (pl.tb_institution_id = p.tb_institution_id) '+
          '  and (p.tb_product_id = '+ tb_product_id + ') '+
          'where  (pl.tb_institution_id =? )  AND  '+
          '       ((p.tb_product_id = '+ tb_product_id + ') or  (p.tb_product_id is null) )';
        }else{
          sqltxt = 'select  distinct  '+
          '  pl.id tb_price_list_id, '+
          '  pl.description name_price_list, '+
          '  0 price_tag '+
          'from tb_price_list pl  '+
          '  left outer join tb_price p '+
          '  on (pl.id = p.tb_price_list_id)  '+
          'where (pl.tb_institution_id =? )  ';  
        }

        Tb.sequelize.query(sqltxt,
          {
            replacements: [tb_institution_id,tb_product_id],
            type: Tb.sequelize.QueryTypes.SELECT
          }).then(data => {              
            resolve(data);
          })
          .catch(err => {
            reject("price.getlist: " + err);
          });
      });
      return promise;
  }

  static get(tb_institution_id,id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select * ' +
        'from tb_price pl '+
        'where (pl.tb_institution_id =? ) '+
        ' and (pl.id =? )',
        {
          replacements: [tb_institution_id,id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject('price.get: '+err);
        });
    });
    return promise;
  }

  static async update(price) {        
    
    const promise = new Promise((resolve, reject) => {
      if (price.validity == '') delete  price.validity;
        Tb.findOne( { 
          where: {tb_institution_id: price.tb_institution_id,
          tb_price_list_id: price.tb_price_list_id,
          tb_product_id: price.tb_product_id}
        })          
        .then(data => {
          if (data){
            Tb.update(price,{
              where: {tb_institution_id: price.tb_institution_id,
              tb_price_list_id: price.tb_price_list_id,
              tb_product_id: price.tb_product_id}
            })
            resolve(data);
          }
          else{
            Tb.create(price)
            .then(data =>{
              resolve(data);
            })
          }            
        })          
        .catch(err => {
          reject("price.update:"+ err);
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
    
  static autoInsertByPriceList(tb_institution_id,tb_price_list_id) {
    const promise = new Promise(async (resolve, reject) => {
      try {        
        var dataProduct = await this.productGetList(tb_institution_id);
        var dataPrice = {};
        for (var item of dataProduct){
          dataPrice ={
            tb_institution_id: tb_institution_id,
            tb_price_list_id: tb_price_list_id,
            tb_product_id: item.id,
            price_tag : 0
          }
          await Tb.create(dataPrice);
        }
        resolve("Preços adicionas");
      } catch (err) {
        reject('autoInsertByPriceList: ' + err)
      }
    });
    return promise;
  }  

  static productGetList(tb_institution_id) {
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
          reject("price.productGetList: " + err);
        });
    });
    return promise;
  }  
}
module.exports = PriceController;