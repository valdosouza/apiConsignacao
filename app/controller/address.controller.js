const moment = require('moment');
const Base = require('../controller/base.controller.js')
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.address;

class AddressController extends Base {


    static async insert(address) {       
        const promise = new Promise((resolve, reject) => {
            Tb.create(address)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject("Erro:"+ err);
                });
        });
        return promise;
    }
   

}
module.exports = AddressController;
