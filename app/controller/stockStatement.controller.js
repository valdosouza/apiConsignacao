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
        .catch(error => {
          reject("Erro:" + error);
        });
    });
    return promise;
  }
  
  static getByAudit(params) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'SELECT id '+
        'FROM tb_stock_statement  '+
        'WHERE tb_institution_id =? '+
        ' and terminal = ? '+
        ' and tb_order_id = ? '+
        ' and tb_order_item_id = ? '+
        ' and operation = ? ',
        {
          replacements: [params.tb_institution_id, params.terminal, params.tb_order_id, params.tb_order_item_id,params.operation],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data.length > 0){
            resolve(data[0]);
          }else{
            resolve({id:0});
          }
        })
        .catch(error => {
          reject(new Error("stockStatement.gelist:" + error));
        });
    });
    return promise;
  }

  static getListByOrder(tb_institution_id, tb_order_id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize.query(
        'select  * ' +
        'from tb_stock_statement ' +
        'where tb_institution_id=?' +
        ' and (tb_order_id =?)',
        {
          replacements: [tb_institution_id, tb_order_id],
          type: Tb.sequelize.QueryTypes.SELECT
        }).then(data => {
            resolve(data);          
        })
        .catch(error => {
          reject(new Error("stockStatement.gelist:" + error));
        });
    });
    return promise;
  }

  static async cleanUp(tb_institution_id, id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const items = await this.getListByOrder(tb_institution_id, id);
        var valida = true;
        for (var stockStatement of items) {
          //Caso nesta ordem já tenha Cleanup, a operação está rodando em duplicidade
          if (stockStatement.kind == "CleanUp") {
            valida = false;
          }
        }
        if (valida) {
          for (var stockStatement of items) {
            if (stockStatement.direction = "S") {
              stockStatement.direction = "E";
            } else {
              stockStatement.direction = "S";
            }
            stockStatement.id = 0;
            stockStatement.note = `Erro no atendimento - Invertendo Operação`
            stockStatement.kind = 'CleanUp'
            await this.insert(stockStatement);
          }
        }
        resolve("clenUp executado com sucesso!");
      } catch (error) {
        reject('StockStatement.cleanUp ' + error);
      }
    });
    return promise;
  }
}
module.exports = StockStatementController