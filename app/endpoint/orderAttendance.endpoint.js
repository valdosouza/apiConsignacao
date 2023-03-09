const OrderAttendanceController = require("../controller/orderAttendance.controller.js");
const CashierController = require('../controller/cashier.controller.js');

class OrderAttendanceEndPoint {

  static create = (req, res) => {
    OrderAttendanceController.getNotFinished(req.body)
      .then(async data => {        
        if(data) {        
          //Como a Order não foi finalizara realizar um "rollback/cleanUp"
          await OrderAttendanceController.cleanUp(data.tb_institution_id,data.id)
          req.body.id = data.id;          
          await OrderAttendanceController.update(req.body)
          .then(async data=>{            
            await CashierController.autoCreate(req.body.tb_institution_id, req.body.tb_user_id);
            res.send(data);  
          })
        }else{
          OrderAttendanceController.insert(req.body)
            .then(async data => {
              await CashierController.autoCreate(req.body.tb_institution_id, req.body.tb_user_id);
              res.send(data);
            })
        }
      })
  }

  static getList(req, res) {

    OrderAttendanceController.getList(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {

    OrderAttendanceController.get(req.params.tb_institution_id, req.params.id)
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    OrderAttendanceController.update(req.body)
      .then(data => {
        if (data)
          res.send(req.body)
        else
          res.send(data);
      })
  }

  static delete(req, res) {

    OrderAttendanceController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }

  static closure(req, res) {

    OrderAttendanceController.closure(req.body)
      .then(data => {
        if (data == 200) {
          res.status(200).send('The OrderStockTransfer was closed');
        } else {
          if (data == 201) {
            res.status(201).send('The OrderStockTransfer is already closed');
          }
        }
      })
  }

  static reopen(req, res) {

    OrderAttendanceController.reopen(req.body)
      .then(data => {
        if (data == 200) {
          res.status(200).send('The OrderStockTransfer was open');
        } else {
          if (data == 201) {
            res.status(201).send('The OrderStockTransfer is already open');
          }
        }
      })
  }

  static cleanup(req, res) {

    OrderAttendanceController.cleanUp(req.body.tb_institution,req.body.id)
      .then(data => {
        res.status(200).json({message: data})        
      })
  }  
}

module.exports = OrderAttendanceEndPoint; 