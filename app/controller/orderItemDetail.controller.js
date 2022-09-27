const Base = require('./base.controller.js')
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.orderItemDetail;

class OrderItemDetailController extends Base {

    static async getIdNext(institutionID, orderID) {
        const promise = new Promise((resolve, reject) => {

            Tb.sequelize.query(
                'Select max(id) maxId ' +
                'from tb_order_item_detail i  ' +
                'where ( i.tb_institution_id=? )  ' +
                ' and (tb_order_id=? ) ' +
                ' and (terminal=0 ) ',
                {
                    replacements: [institutionID, orderID],
                    type: Tb.sequelize.QueryTypes.SELECT
                }).then(data => {
                    if (data[0].maxId == null)
                        data[0].maxId = 0;
                    resolve(data[0].maxId + 1);
                })
                .catch(err => {
                    reject(1);
                });
        });
        return promise;
    }

    static async insert(detail, orderdetached) {
        
        var idNext = await this.getIdNext(orderdetached.tb_institution_id, orderdetached.tb_order_id);
        const promise = new Promise((resolve) => {   
            
            for (let item of detail) {
                
                const data = {
                    id: idNext,
                    tb_institution_id: orderdetached.tb_institution_id,
                    tb_order_id: orderdetached.tb_order_id,
                    terminal: 0,
                    tb_order_item_id: 0,
                    tb_order_item_detached_id: orderdetached.id,
                    description: item.description,
                    unit_value: item.priceTag,
                    kind: item.kind,
                    note: item.note
                };                 
                 Tb.create(data);
                idNext++;


            }
            resolve("deu");
        });
        return promise;
    }
}
module.exports = OrderItemDetailController;