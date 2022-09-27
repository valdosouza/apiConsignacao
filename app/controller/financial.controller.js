const Base = require('../controller/base.controller.js')
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.financial;


class FinancialController extends Base {

     static async getClosed(body) {
        const promise = new Promise((resolve, reject) => {
            var paramters = [body.initialDate, body.finalDate, body.institution];            
            var sqltext =  'select pt.description paymentType , sum(fn.tag_value) totalValue, count(od.id) totalQtty '+
            'from tb_order od  '+
            '    inner join tb_financial fn  '+
            '    on ( fn.tb_order_id = od.id ) and  ( fn.tb_institution_id = od.tb_institution_id )  '+
            '    inner join tb_order_sale ors  '+
            '    on ( ors.id = od.id ) and  ( ors.tb_institution_id = od.tb_institution_id )  '+
            '    inner join tb_payment_types pt  '+
            '    on (pt.id = fn.tb_payment_types_id)  ';
            if ( body.terminal != "Todos"){
                sqltext += ' inner join tb_devices dv '+
                           ' on (od.terminal = dv.id)  and (od.tb_institution_id = dv.tb_institution_id)';     
                paramters = [body.initialDate, body.finalDate, body.institution, body.terminal];
            }
            sqltext += 'where od.dt_record between ? and ?  '+
                       ' and fn.tb_institution_id = ? ';
            if ( body.terminal != "Todos"){
                sqltext += ' and (dv.description = ? )';    
            }
            sqltext += ' group by 1 '+
                       ' order by 2 desc ';
            Tb.sequelize.query(
                sqltext,
                {
                    replacements: paramters,
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
module.exports =FinancialController;