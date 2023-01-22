const OrderProductionController = require("../controller/orderProduction.controller.js");

class OrderProductionEndPoint {

  static create = (req, res) => {
    
    OrderProductionController.insert(req.body)
      .then(data => {
        res.send(data);
    })
  }

  static getList(req, res) {
    
    OrderProductionController.getList(req.params.tb_institution_id )
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {
    
    OrderProductionController.get(req.params.tb_institution_id,req.params.id )
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    OrderProductionController.update(req.body)
      .then(data => {
        if (data)
          res.send(req.body)
        else
          res.send(data);
      })
  }

  static delete(req, res) {

    OrderProductionController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }
  
  static closure(req, res) {
    
    OrderProductionController.closure(req.body)
      .then(data => {        
        if (data == 200){
          res.status(200).send('The OrderProduction was closed');
        }else{
          if (data == 201){
            res.status(201).send('The OrderProduction is already closed');
          }  
        }
      })
  }
   
  static reopen(req, res) {
    
    OrderProductionController.reopen(req.body)
      .then(data => {        
        if (data == 200){
          res.status(200).send('The OrderProduction was open');
        }else{
          if (data == 201){
            res.status(201).send('The OrderProduction is already open');
          }  
        }
      })
  }  
}

module.exports = OrderProductionEndPoint; 