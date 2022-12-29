const ProdcutController = require("../controller/product.controller.js");

class ProductEndPoint {

  static create = (req, res) => {
    
    ProdcutController.insert(req.body)
      .then(data => {
        res.send(data);
    })
  }

  static getList(req, res) {
    
    ProdcutController.getList(req.params.tb_institution_id )
      .then(data => {
        res.send(data);
      })
  }

  static priceListGetAll(req, res) {
    
    ProdcutController.priceListGetAll(req.params.tb_institution_id )
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {
    
    ProdcutController.get(req.params.tb_institution_id,req.params.id )
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    ProdcutController.update(req.body)
      .then(data => {
        if (data)
          res.send(req.body)
        else
          res.send(data);
      })
  }

  static delete(req, res) {

    ProdcutController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }
  
}

module.exports = ProductEndPoint; 