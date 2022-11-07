const Base = require('./base.controller.js')
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.orderItemDetached;
const OrderItemDetail = require("../controller/orderItemDetail.controller.js");

class OrderItemDetachedController extends Base {

    static async getIdNext(institutionID, orderID) {
        const promise = new Promise((resolve, reject) => {

            Tb.sequelize.query(
                'Select max(id) maxId ' +
                'from tb_order_item_detached i  ' +
                'where ( i.tb_institution_id=? )  ' +
                ' and (tb_order_id=? ) ',
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

    static async insert(item, order) {
        var idNext = await this.getIdNext(order.institutionID, order.id);

        const promise = new Promise((resolve,reject) => {
            const data = {
                id: idNext,
                tb_institution_id: order.institutionID,
                tb_order_id: order.id,
                terminal: 0,
                nr_item: idNext,
                description: item.description,
                measure: item.measure,
                parts: item.parts,
                parts_max: item.partsMax,
                quantity: item.qtde,
                unit_value: item.priceTag
            };
            try{
                Tb.create(data);
                resolve("ok");                                
            }catch{
                reject("falha");
            }                
        });
        return promise;
    }


    static async insertList(order) {
        const promise = new Promise((resolve, reject) => {
            var items = JSON.parse(order.items);            
            for (var item of items) {                
                var res = this.insert(item, order);                
            }
            resolve("ok");
        });
        return promise;
    }
}
module.exports = OrderItemDetachedController;