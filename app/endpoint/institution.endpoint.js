const InstitutionController = require("../controller/institution.controller.js");

class InstitutionEndPoint {


  static create(req, res) {
    InstitutionController.insert(req.body).then(data => {
      res.send(data);
    })
  }

  static findAll = (req, res) => {
    InstitutionController.findAll(req.body).then(data => {
      res.send(data);
    })
  };

  static getDelivery = (req, res) => {

    if (!req.body.tb_institution_id) {
      return res.status(400).send('Informe um Código de Estabelecimento!')
    }
    InstitutionController.getDelivery(req.body).then(data => {
      res.send(data);
    })
  };

}
module.exports = InstitutionEndPoint;




