
const Base = require('../controller/base.controller.js')
const db = require("../model");
const Tb = db.order;
class OrderController extends Base {

    static async getIdNext(institutionID) {
        const promise = new Promise((resolve, reject) => {
            Tb.sequelize.query(
                'Select max(id) maxID ' +
                'from tb_order o ' +
                'where ( o.tb_institution_id=? ) ',
                {
                    replacements: [institutionID],
                    type: Tb.sequelize.QueryTypes.SELECT
                }).then(data => {
                    resolve(data[0].maxID + 1);
                })
                .catch(err => {
                    reject(0);
                });
        });
        return promise;
    }


    static async insert(order) {
        
        
        const idSeq = await this.getIdNext(order.institutionID);
        //const objSon = await JSON.parse(order);
            
        const promise = new Promise((resolve, reject) => {
            
            const data = {
                id: idSeq,
                tb_institution_id: order.institutionID,
                terminal: 0,
                tb_user_id: order.institutionID,                
                origin: "W",
                status: 'P',
                being_used: '',
                obj_json: order
            };
            
            Tb.create(data)
                .then(data => {                    
                    resolve(data);
                })
                .catch(err => {
                    reject("Erro:"+ err);
                });
        });
        return promise;
    }
    
    static async findOne(data) {
        
        const promise = new Promise((resolve, reject) => {
            Tb.sequelize.query(
                'Select * ' +
                'from tb_order o ' +
                'where ( o.tb_institution_id=? ) '+
                ' and (id=?) ',
                {
                    replacements: [data.institutionID,data.orderID],
                    type: Tb.sequelize.QueryTypes.SELECT
                }).then(data => {                    
                    resolve(data);
                })
                .catch(err => {
                    reject(new Error("Erro: " + err));
                });
        });
        return promise;
    }

    static async sincronize(data) {
        const promise = new Promise((resolve, reject) => {
            Tb.sequelize.query(
                'Select o.id,o.updated_at, obj_json ' +
                'from tb_order o ' +
                'where ( o.tb_institution_id=? ) '+
                ' and (o.updated_at >?) ',
                {
                    replacements: [data.institutionID,data.updatedAT],
                    type: Tb.sequelize.QueryTypes.SELECT
                }).then(data => {                                        
                    //resolve(JSON.parse(data[0].obj_json));
                    var obj = {
                        "obj_json": []
                      };
                    for (var item of data) {
                        //console.log(item.obj_json);
                        var itemModificado = JSON.parse(item.obj_json);                        
                        itemModificado.orderID  = item.id;
                        itemModificado.updated_at = item.updated_at;
                        obj.obj_json.push(itemModificado);
                    }
                    resolve(obj);
                })
                .catch(err => {
                    reject(new Error("Erro: " + err));
                });
        });
        return promise;
    }

}
module.exports = OrderController;