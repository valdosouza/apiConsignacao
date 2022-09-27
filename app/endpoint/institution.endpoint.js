const InstitutionController = require("../controller/institution.controller.js");

class InstitutionEndPoint {

  static create = (req, res) => {
    const institution = req.body;
    InstitutionController.insert(institution)
      .then(data => {
        institution.id = data.id;
        res.send(institution);
    })
  }

  static getList(req, res) {

    InstitutionController.getList(req.body).then(data => {
      res.send(data);
    })
  }
  static update = (req, res) => {
    const id = req.params.id;
    const institution = req.body;
    InstitutionController.update(institution).then(data => {
      res.send(data);
    })
  }

  static delete(req, res) {

    InstitutionController.delete(req.body).then(data => {
      res.send(data);
    })
  }   
}

module.exports = InstitutionEndPoint;




