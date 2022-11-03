const PriceListController = require("../controller/priceList.controller.js");

class PriceListEndPoint {

  static create = (req, res) => {
    
    PriceListController.insert(req.body)
      .then(data => {
        res.send(data);
    })
  }

  static getList(req, res) {
    
    PriceListController.getList(req.params.tb_institution_id )
      .then(data => {
        res.send(data);
      })
  }

  static get(req, res) {
    
    PriceListController.get(req.params.tb_institution_id,req.params.id )
      .then(data => {
        res.send(data);
      })
  }

  static update = (req, res) => {
    PriceListController.update(req.body)
      .then(data => {
        if (data)
          res.send(req.body)
        else
          res.send(data);
      })
  }

  static delete(req, res) {

    PriceListController.delete(req.body)
      .then(data => {
        res.send(data);
      })
  }
  
}

module.exports = PriceListEndPoint; 