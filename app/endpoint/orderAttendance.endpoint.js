const OrderAttendanceController = require("../controller/orderAttendance.controller.js");

class OrderAttendanceEndPoint {

  static create = (req, res) => {
    
    OrderAttendanceController.insert(req.body)
      .then(data => {
        res.send(data);
    })
  }

  static getList(req, res) {
    
    OrderAttendanceController.getList(req.params.tb_institution_id )
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {
    
    OrderAttendanceController.get(req.params.tb_institution_id,req.params.id )
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
  
  static close(req, res) {
    
    OrderAttendanceController.close(req.body)
      .then(data => {        
        if (data == 200){
          res.status(200).send('The OrderStockTransfer was closed');
        }else{
          if (data == 201){
            res.status(201).send('The OrderStockTransfer is already closed');
          }  
        }
      })
  }
   
  static reopen(req, res) {
    
    OrderAttendanceController.reopen(req.body)
      .then(data => {        
        if (data == 200){
          res.status(200).send('The OrderStockTransfer was open');
        }else{
          if (data == 201){
            res.status(201).send('The OrderStockTransfer is already open');
          }  
        }
      })
  }
}

module.exports = OrderAttendanceEndPoint; 