const DeliveryController = require("../controller/delivery.controller.js");

class DeliveryEndPoint {

  static save(req, res) {
    
    DeliveryController.save(req.body)
      .then(data => {       
        res.status(200).send();
      })
      .catch(error => {
        res.status(500).send({
          message:
            error.message || "' - DeliveryEndPoint!'"
        });
      });
    
  }

  
  static findOne = (req, res) => {
    
    DeliveryController.findOne(req.params)
      .then(data => {
        res.send(data);
      })
      .catch(error => {
        res.status(500).send({
          message:
            error.message || "' - DeliveryEndPoint!'"
        });
      });
  };
  
  static syncronize = (req, res) => {
    DeliveryController.sincronize(req.params)
      .then(data => {
        res.send(data);
      })
      .catch(error => {
        res.status(500).send({
          message:
            error.message || "' - DeliveryEndPoint!'"
        });
      });
  };



}
module.exports = DeliveryEndPoint; 