const Base = require('./base.controller.js')
const db = require("../model");
const Tb = db.stockStatement;

class StockStatementController extends Base {
    
    static async insert(stockStatement) {        
        const promise = new Promise((resolve, reject) => {            
            Tb.create(stockStatement)
                .then((data) => {
                    resolve(data);
                })
                .catch(err => {
                    reject("Erro:"+ err);
                });
        });
        return promise;        
    }    

    static getList(tb_institution_id) {
        const promise = new Promise((resolve, reject) => {
          Tb.sequelize.query(
            'select  * ' +
            'from tb_stock_statement '+
            'where tb_institution_id=?',
            {
              replacements: [tb_institution_id ],
              type: Tb.sequelize.QueryTypes.SELECT
            }).then(data => {
              resolve(data);
            })
            .catch(err => {
              reject(new Error("stockStatement.gelist:" + err));
            });
        });
        return promise;
    }        
}
module.exports = StockStatementController