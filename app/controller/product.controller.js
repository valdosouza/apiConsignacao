const Base = require('../controller/base.controller.js')
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.orderSale;


class ProductController extends Base {

     static async geList(institutionID) {
        const promise = new Promise((resolve, reject) => {
            Tb.sequelize.query(
                'select pr.id, pr.description product, pk.description package, stb.quantity  '+
                'from tb_product pr  '+
                '  inner join tb_merchandise me  '+
                '  on (me.id = pr.id)  '+
                '      and (me.tb_institution_id = pr.tb_institution_id)  '+
                '  inner  join tb_stock st  '+
                '  on (st.tb_merchandise_id = me.id)  '+
                '      and (st.tb_institution_id = me.tb_institution_id)  '+
                '  inner join tb_stock_balance stb  '+
                '  on (stb.tb_merchandise_id = me.id)  '+
                '      and  (stb.tb_institution_id = me.tb_institution_id)  '+
                '  inner join tb_package pk  '+
                '  on (pk.id = st.tb_package_id)  '+
                'where ( pr.id > 0 ) and ( pr.active = "S" )  '+
                ' and (tb_stock_list_id =1)  '+
                ' and ( me.tb_institution_id =? )  '+
                ' order by pr.description  ',
                {
                    replacements: [6825],
                    type: Tb.sequelize.QueryTypes.SELECT
                }).then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(1);
                });
        });
        return promise;
    }

}
module.exports =ProductController;