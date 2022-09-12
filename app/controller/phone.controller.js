const moment = require('moment');
const Base = require('../controller/base.controller.js')
const db = require("../model");
const Op = db.Sequelize.Op;
const Tb = db.phone;

class PhoneController extends Base {
    static async insert(phone) {       
        const promise = new Promise((resolve, reject) => {
            Tb.create(phone)
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
module.exports = PhoneController;