const ServicesController = require("../service/distance.js");

class ServicesEndPoint {

  static distance(req, res) {

    ServicesController.distance(req.body).then(data => {
      res.send(data);
    })

  }

  static deliveryValue(req, res) {
    ServicesController.deliveryValue(req.body).then(data => {
      res.send(data);
    })
  }


  static existWord(req, res) {
    ServicesController.existWord(req.body).then(data => {
      res.send(data);
    })

  }
  static teste(req, res) {
    
    


  }  
}
module.exports = ServicesEndPoint; 