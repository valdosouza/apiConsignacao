const Base = require('../controller/base.controller.js')
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.orderSale;


const Customer = require("../controller/customer.controller.js");

class OrderConsigmentController extends Base {

    static async getNumberNext(institutionID) {
        const promise = new Promise((resolve, reject) => {
            Tb.sequelize.query(
                'Select max(number) maxNumber ' +
                'from tb_order_sale s ' +
                'where ( s.tb_institution_id=? ) ',
                {
                    replacements: [institutionID],
                    type: Tb.sequelize.QueryTypes.SELECT
                }).then(data => {
                    if (data[0].maxNumber == null)
                        data[0].maxNumber = 0;
                    resolve(data[0].maxNumber + 1);
                })
                .catch(err => {
                    reject(1);
                });
        });
        return promise;
    }

    static async insert(order) {

        const numberNext = await this.getNumberNext(order.institutionID);

        const promise = new Promise((resolve, reject) => {

            const customer = JSON.parse(order.customer);
            const data = {
                id: order.id,
                tb_institution_id: order.institutionID,
                terminal: 0,
                tb_salesman_id: order.institutionID,
                number: numberNext,
                tb_customer_id: customer.id
            };
            Tb.create(data)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    console.log(err);
                    reject("Erro:" + err);
                });
        });
        return promise;
    }

    static async geList(institutionID) {
        const promise = new Promise((resolve, reject) => {
            Tb.sequelize.query(
                'select od.id, ods.number, od.dt_record, et.name_company, et.nick_trade, sum((odi.quantity * odi.unit_value)-odi.discount_value) order_value '+
                'from tb_order od '+
                '   inner join tb_order_sale ods '+
                '   on (ods.id = od.id) '+
                '   and (ods.tb_institution_id = od.tb_institution_id) '+
                '   inner join tb_entity et '+
                '   on (et.id = ods.tb_customer_id) '+
                '   inner join tb_order_item odi '+
                '   on (odi.tb_order_id = od.id) '+
                '   and (odi.tb_institution_id = od.tb_institution_id) '+
                'where od.tb_institution_id =? '+
                'and ods.tb_salesman_id =? '+
                'and od.dt_record >=? '+
                'group by od.id, ods.number, od.dt_record, et.name_company, et.nick_trade '+
                'order by ods.number ',
                {
                    replacements: [6825,6838,"2021-01-20"],
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
module.exports = OrderConsigmentController;