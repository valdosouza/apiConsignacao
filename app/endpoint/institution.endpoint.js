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

  // Find a single user with an id
  static getInstitution = (req, res) => {
    const id = req.params.id;
    InstitutionController.getInstitution(id).then(data => {
      res.send(data);
    })
  };

  static getList(req, res) {

    InstitutionController.getList(req.body).then(data => {
      res.send(data);
    })
  }
  static update = (req, res,next) => {    
    const institution = req.body;
    InstitutionController.update(institution)
      .then((data) => {
        res.header("Access-Control-Allow-Origin", "*"),
        res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE"),
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"),
        res.send(data);
        next();              
      })
  }

  static delete(req, res) {

    InstitutionController.delete(req.body).then(data => {
      res.send(data);
    })
  }   
}

module.exports = InstitutionEndPoint;