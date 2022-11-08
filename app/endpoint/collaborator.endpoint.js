const CollaboratorController = require("../controller/collaborator.controller.js");

class CollaboratorEndPoint {

  static create = (req, res) => {
    try{      
      CollaboratorController.save(req.body)
        .then(data => {        
          res.send(data);
      })
    } catch (err) {
      res.send(err);
    }
  }

  static getCollaborator = (req, res) => {
    const id = req.params.id;
    CollaboratorController.getCollaborator(id)
      .then(data => {
        res.send(data);
      })
  };

  static getList = (req, res) => {
    const tb_institution_id = req.params.tb_institution_id;
    CollaboratorController.getList(tb_institution_id)
      .then(data => {
        res.send(data);
      })
  };

  static delete(req, res) {

    CollaboratorController.delete(req.body).then(data => {
      res.send(data);
    })
  }   
}

module.exports = CollaboratorEndPoint;