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
        .catch(error => {
          reject("price.insert:" + error);
        });
    });
    return promise;
  }

  static async update(body) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        Tb.update({ quantity: body.quantity }, {
          where: {
            tb_institution_id: body.tb_institution_id,
            tb_stock_list_id: body.tb_stock_list_id,
            tb_merchandise_id: body.tb_merchandise_id
          }
        }).then((data)=>{
          resolve(data);
        })
      } catch (error) {
          reject('StockBalance.update:'+error);
      }
    });
    return promise;
  }

  static getList(tb_institution_id, tb_stock_list_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ' +
        'stb.tb_institution_id, ' +
        'stb.tb_stock_list_id, ' +
        'stl.description name_stock_list, ' +
        'stb.tb_merchandise_id, ' +
        'prd.description name_merchandise, ' +
        'stb.quantity ' +
        'from tb_stock_balance stb ' +
        '  inner join tb_stock_list stl   ' +
        '  on (stl.id = stb.tb_stock_list_id) ' +
        '    and (stl.tb_institution_id = stb.tb_institution_id) ' +
        '  inner join tb_product prd ' +
        '  on (prd.id = stb.tb_merchandise_id)  ' +
        'where stb.tb_institution_id =? ' +
        '  and stb.tb_stock_list_id =? ',
        {
          replacements: [tb_institution_id, tb_stock_list_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            var dataResult = {
              id: data[0].id,
              tb_institution_id: data[0].tb_institution_id,
              tb_stock_list_id: data[0].tb_stock_list_id,
              name_stock_list: data[0].name_stock_list,
            };
            var items = [];
            var itemResult = {};
            for (var item of data) {
              itemResult = {
                tb_merchandise_id: item.tb_merchandise_id,
                name_merchandise: item.name_merchandise,
                quantity: item.quantity
              }
              items.push(itemResult);
            }
            dataResult.items = items;
            resolve(dataResult);
          } else {
            var dataResult = {
              id: 0,
              tb_institution_id: tb_institution_id,
              tb_stock_list_id: 0,
              name_stock_list: "",
            };
            var items = [];
            dataResult.items = items;
            resolve(dataResult);

          }
        })
        .catch(error => {
          reject("StockBalance.getlist: " + error);
        });
    });
    return promise;
  }

  static getBySalesman(tb_institution_id, tb_salesman_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ' +
        'stb.tb_institution_id,' +
        'stb.tb_stock_list_id,' +
        'stl.description name_stock_list, ' +
        'stb.tb_merchandise_id, ' +
        'prd.description name_merchandise, ' +
        'stb.quantity ' +
        'from tb_stock_balance stb ' +
        '  inner join tb_stock_list stl   ' +
        '  on (stl.id = stb.tb_stock_list_id) ' +
        '    and (stl.tb_institution_id = stb.tb_institution_id) ' +
        '  inner join tb_product prd ' +
        '  on (prd.id = stb.tb_merchandise_id)  ' +
        '  inner join tb_entity_has_stock_list ehs  ' +
        '  on (ehs.tb_stock_list_id = stb.tb_stock_list_id)  ' +
        '    and (ehs.tb_institution_id = stb.tb_institution_id) ' +
        '  inner join tb_collaborator c ' +
        '  on (c.id = ehs.tb_entity_id) ' +
        '    and (c.tb_institution_id = ehs.tb_institution_id) ' +
        'where stb.tb_institution_id =?   ' +
        ' and ehs.tb_entity_id =?   ' +
        ' and ehs.profile = ? ',
        {
          replacements: [tb_institution_id, tb_salesman_id, 'salesman'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            var dataResult = {
              id: data[0].id,
              tb_institution_id: data[0].tb_institution_id,
              tb_stock_list_id: data[0].tb_stock_list_id,
              name_stock_list: data[0].name_stock_list,
            };
            var items = [];
            var itemResult = {};
            for (var item of data) {
              itemResult = {
                tb_merchandise_id: item.tb_merchandise_id,
                name_merchandise: item.name_merchandise,
                quantity: Number(item.quantity)
              }
              items.push(itemResult);
            }
            dataResult.items = items;
            resolve(dataResult);
          } else {
            var dataResult = {
              id: 0,
              tb_institution_id: tb_institution_id,
              tb_stock_list_id: 0,
              name_stock_list: "",
            };
            var items = [];
            dataResult.items = items;
            resolve(dataResult);

          }
        })
        .catch(error => {
          reject("StockBalance.getListByEnitity: " + error);
        });
    });
    return promise;
  }

  static getAllCustomer(tb_institution_id, tb_salesman_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select stb.tb_merchandise_id, prd.description name_merchandise, sum(stb.quantity) quantity ' +
        'from tb_stock_balance stb ' +
        '    inner join tb_stock_list stl ' +
        '    on (stl.id = stb.tb_stock_list_id) ' +
        '        and (stl.tb_institution_id = stb.tb_institution_id) ' +
        '    inner join tb_product prd ' +
        '    on (prd.id = stb.tb_merchandise_id) ' +
        '        and (prd.tb_institution_id = stb.tb_institution_id) ' +
        '    inner join tb_entity_has_stock_list ehs ' +
        '    on (ehs.tb_stock_list_id = stb.tb_stock_list_id) ' +
        '        and (ehs.tb_institution_id = stb.tb_institution_id)  ' +
        '    inner join tb_customer ctm ' +
        '    on (ctm.id = ehs.tb_entity_id) ' +
        '    inner join tb_region rgn ' +
        '    on (rgn.id = ctm.tb_region_id) ' +
        'where (rgn.tb_institution_id =?) ' +
        '  and (rgn.tb_salesman_id = ?) ' +
        '  and ehs.profile = ? ' +
        'group by 1,2 ',
        {
          replacements: [tb_institution_id, tb_salesman_id, 'customer'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            var dataResult = {
              id: data[0].id,
              tb_institution_id: data[0].tb_institution_id,
              tb_stock_list_id: data[0].tb_stock_list_id,
              name_stock_list: data[0].name_stock_list,
            };
            var items = [];
            var itemResult = {};
            for (var item of data) {
              itemResult = {
                tb_merchandise_id: item.tb_merchandise_id,
                name_merchandise: item.name_merchandise,
                quantity: Number(item.quantity)
              }
              items.push(itemResult);
            }
            dataResult.items = items;
            resolve(dataResult);
          } else {
            var dataResult = {
              id: 0,
              tb_institution_id: tb_institution_id,
              tb_stock_list_id: 0,
              name_stock_list: "",
            };
            var items = [];
            dataResult.items = items;
            resolve(dataResult);
          }
        })
        .catch(error => {
          reject("StockBalance.getListAllCustomer: " + error);
        });
    });
    return promise;
  }

  static getAllCustomerByProduct(tb_institution_id, tb_salesman_id,tb_product_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ctm.id, stb.tb_merchandise_id, etd.nick_trade name_customer, prd.description name_product, sum(stb.quantity) quantity '+
        'from tb_stock_balance stb '+
        '    inner join tb_stock_list stl  '+
        '    on (stl.id = stb.tb_stock_list_id)  '+
        '        and (stl.tb_institution_id = stb.tb_institution_id)  '+
        '    inner join tb_product prd  '+
        '    on (prd.id = stb.tb_merchandise_id)  '+
        '        and (prd.tb_institution_id = stb.tb_institution_id)  '+
        '    inner join tb_entity_has_stock_list ehs  '+
        '    on (ehs.tb_stock_list_id = stb.tb_stock_list_id)  '+
        '        and (ehs.tb_institution_id = stb.tb_institution_id)   '+
        '    inner join tb_customer ctm  '+
        '    on (ctm.id = ehs.tb_entity_id)  '+
        '    inner join tb_region rgn  '+
        '    on (rgn.id = ctm.tb_region_id)  '+
        '    inner join tb_entity etd '+
        '    on (etd.id = ctm.id) '+
        'where (rgn.tb_institution_id =?)  '+
        '  and (rgn.tb_salesman_id = ?)  '+
        '  and ehs.profile = ?  '+
        '  and (prd.id = ?) '+
        'group by 1,2,3,4 ',
        {
          replacements: [tb_institution_id, tb_salesman_id, 'customer',tb_product_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            var dataResult = {
              tb_institution_id: data[0].tb_institution_id,
              tb_merchandise_id: data[0].tb_merchandise_id,
              name_product: data[0].name_product,              
            };
            var items = [];
            var itemResult = {};
            for (var item of data) {
              itemResult = {                
                name_customer: item.name_customer,
                quantity: parseInt(item.quantity)
              }
              items.push(itemResult);
            }
            dataResult.items = items;
            resolve(dataResult);
          } else {
            var dataResult = {              
              tb_institution_id: tb_institution_id,
              tb_merchandise_id: 0,
              name_product: "",
            };
            var items = [];
            dataResult.items = items;
            resolve(dataResult);
          }
        })
        .catch(error => {
          reject("StockBalance.getListAllCustomerByProduct: " + error);
        });
    });
    return promise;
  }

  static getAllBySalesman(tb_institution_id, tb_salesman_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        '  select ' +
        '  tb_merchandise_id, ' +
        '  name_merchandise, ' +
        '  sum(quantity) quantity ' +
        'from ( ' +
        '  select  ' +
        '  stb.tb_merchandise_id,  ' +
        '  prd.description name_merchandise,  ' +
        '  sum(stb.quantity) quantity ' +
        '  from tb_stock_balance stb  ' +
        '    inner join tb_stock_list stl    ' +
        '    on (stl.id = stb.tb_stock_list_id)  ' +
        '      and (stl.tb_institution_id = stb.tb_institution_id)  ' +

        '    inner join tb_product prd  ' +
        '    on (prd.id = stb.tb_merchandise_id)   ' +
        '     and (prd.tb_institution_id = stb.tb_institution_id)  ' +

        '    inner join tb_entity_has_stock_list ehs   ' +
        '    on (ehs.tb_stock_list_id = stb.tb_stock_list_id)   ' +
        '      and (ehs.tb_institution_id = stb.tb_institution_id)  ' +

        '    inner join tb_customer ct  ' +
        '    on (ct.id = ehs.tb_entity_id)  ' +
        '      and (ct.tb_institution_id = ehs.tb_institution_id)  ' +

        '    inner join tb_region rg ' +
        '    on (rg.id = ct.tb_region_id) ' +
        '      and (ct.tb_institution_id = ehs.tb_institution_id) ' +


        '  where stb.tb_institution_id =? ' +
        '  and rg.tb_salesman_id =? ' +
        '  and ehs.profile = ? ' +
        '  group by 1,2 ' +
        '   union ' +
        '   select  ' +
        '   stb.tb_merchandise_id,  ' +
        '   prd.description name_merchandise, ' +
        '   stb.quantity  ' +
        '   from tb_stock_balance stb ' +
        '     inner join tb_stock_list stl ' +
        '     on (stl.id = stb.tb_stock_list_id)  ' +
        '       and (stl.tb_institution_id = stb.tb_institution_id)  ' +

        '     inner join tb_product prd  ' +
        '     on (prd.id = stb.tb_merchandise_id)   ' +
        '      and (prd.tb_institution_id = stb.tb_institution_id)  ' +

        '     inner join tb_entity_has_stock_list ehs   ' +
        '     on (ehs.tb_stock_list_id = stb.tb_stock_list_id)   ' +
        '       and (ehs.tb_institution_id = stb.tb_institution_id)  ' +

        '     inner join tb_collaborator c  ' +
        '     on (c.id = ehs.tb_entity_id)  ' +
        '       and (c.tb_institution_id = ehs.tb_institution_id) ' +

        '   where stb.tb_institution_id =?   ' +
        '   and ehs.tb_entity_id =? ' +
        '   and ehs.profile = ? ' +
        ' ) tb_stock_by_salesman ' +
        ' group by 1,2  ',
        {
          replacements: [tb_institution_id, tb_salesman_id, 'customer', tb_institution_id, tb_salesman_id, 'salesman'],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0) {
            var dataResult = {
              id: data[0].id,
              tb_institution_id: data[0].tb_institution_id,
              tb_stock_list_id: data[0].tb_stock_list_id,
              name_stock_list: data[0].name_stock_list,
            };
            var items = [];
            var itemResult = {};
            for (var item of data) {
              itemResult = {
                tb_merchandise_id: item.tb_merchandise_id,
                name_merchandise: item.name_merchandise,
                quantity: Number(item.quantity)
              }
              items.push(itemResult);
            }
            dataResult.items = items;
            resolve(dataResult);
          } else {
            var dataResult = {
              id: 0,
              tb_institution_id: tb_institution_id,
              tb_stock_list_id: 0,
              name_stock_list: "",
            };
            var items = [];
            dataResult.items = items;
            resolve(dataResult);

          }
        })
        .catch(error => {
          reject("StockBalance.getListAllCustomer: " + error);
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
          .catch(error => {
              reject("Erro:"+ error);
          });
      */
    });
    return promise;
  }

  static autoInsertByStokcList(tb_institution_id, tb_stock_list_id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        var dataProduct = await this.productGetList(tb_institution_id);
        var dataPrice = {};
        for (var item of dataProduct) {
          dataPrice = {
            tb_institution_id: tb_institution_id,
            tb_stock_list_id: tb_stock_list_id,
            tb_merchandise_id: item.id,
            quantity: 0
          }
          await Tb.create(dataPrice);
        }
        resolve("Estoque adicionado");
      } catch (error) {
        reject('autoInsertByStockList: ' + error);
      }
    });
    return promise;
  }

  static productGetList(tb_institution_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select ' +
        'id, ' +
        'tb_institution_id, ' +
        'description, ' +
        'active ' +
        'from tb_product p ' +
        'where (p.tb_institution_id =? ) ',
        {
          replacements: [tb_institution_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(error => {
          reject("stockBalance." + error);
        });
    });
    return promise;
  }


}
module.exports = StockBalanceController;