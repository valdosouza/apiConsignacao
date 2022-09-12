
const Base = require('./base.controller.js')  
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.restPizza;
class RestPizzaController extends Base {


  static create = (data) => {
    const promise = new Promise((resolve, reject) => {
      Tb.create(data)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(new Error("RestPizza - " + err));
        });
    });
    return promise;
  }

  static update = (data) => {
    const promise = new Promise((resolve, reject) => {
      Tb.update(req.body, {
        where: { id: data.id }
      })
        .then(num => {
          if (num == 1) {
            resolve("RestPizza foi atualizada com sucesso.");
          } else {
            resolve("Nao foi possivel atualizar com id=${id}. Talvez RestPizza não foi encontrada ou req.body está vazio!");
          }
        })
        .catch(err => {
          reject(new Error("RestPizza - " + err));
        });
    });
  }

  static getList(body) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'SELECT DISTINCT rm.id, rm.description , price_tag ,me.description measure, st.link_url '+
        'FROM tb_rest_menu  rm   '+
        '  inner join tb_rest_menu_has_product rhp  '+
        '  on (rhp.tb_rest_menu_id = rm.id )  '+
        '  and (rhp.tb_institution_id = rm.tb_institution_id)   '+
        '  inner join tb_product pr   '+
        '  on (rhp.tb_product_id = pr.id)   '+
        '  and (rhp.tb_institution_id = pr.tb_institution_id) '+
        '  inner join tb_price pi  '+
        '  on (pi.tb_product_id = pr.id)  '+
        '      and (pr.tb_institution_id = pi.tb_institution_id)  '+
        '  inner join tb_stock st  '+
        '  on (st.tb_merchandise_id = pr.id)  '+
        '  and (st.tb_institution_id = pr.tb_institution_id) '+
        '  inner join tb_measure me '+
        '  on (me.id = st.tb_measure_id)  '+
        '  inner join tb_rest_group rg '+
        '  on (rg.id = rm.tb_rest_group_id) '+
        '  and (rg.tb_institution_id = rm.tb_institution_id) '+        
        'where st.outline = "N" '+
        ' and ( pi.tb_price_list_id =1 ) '+
        ' and rg.description = "PIZZA" '+    
        ' and ( pr.active = "S")  '+
        'and ( pr.tb_institution_id =? ) '+        
        'and ( st.tb_measure_id =? ) '+
        'order by rm.description ',
        {
          replacements: [body.tb_institution_id,body.tb_measure_id ],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("RestSubGRupo:" + err));
        });
    });
    return promise;
  }
}

module.exports =  RestPizzaController; 