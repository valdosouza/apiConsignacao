const OrderSaleController = require("../controller/orderSale.controller.js");
const OrderSaleCardController = require("../controller/orderSaleCard.controller.js");

class OrderSaleEndPoint {

  static create = (req, res) => {
    
    OrderSaleController.insert(req.body)
      .then(data => {
        res.send(data);
    })
  }

  static saveOrderBySaleCard = (req, res) => {
    
    OrderSaleController.saveOrderBySaleCard(req.body)
      .then(data => {
        res.send(data);
    })
  }

  static getList(req, res) {
    
    OrderSaleController.getList(req.params.tb_institution_id )
      .then(data => {
        res.send(data);
      })
  }

  static getNewOrderSaleCard(req, res) {
    
    OrderSaleCardController.getNewOrderSaleCard(req.params.tb_institution_id,req.params.tb_price_list_id )
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {
    
    OrderSaleController.get(req.params.tb_institution_id,
                            req.params.tb_order_id )
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    
    OrderSaleController.update(req.body)
      .then(data => {
        if (data)
          res.send(req.body)
        else
          res.send(data);
      })
  }

  static delete(req, res) {

    OrderSaleController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }
  
  static closure(req, res) {
    
    OrderSaleController.closure(req.body)
      .then(data => {        
        if (data == 200){
          res.status(200).send('The OrderSale was closed');
        }else{
          if (data == 201){
            res.status(201).send('The OrderSale is already closed');
          }  
        }
      })
  }
   
  static reopen(req, res) {
    
    OrderSaleController.reopen(req.body)
      .then(data => {        
        if (data == 200){
          res.status(200).send('The OrderSale was open');
        }else{
          if (data == 201){
            res.status(201).send('The OrderSale is already open');
          }  
        }
      })
    }
}
module.exports = OrderSaleEndPoint; 