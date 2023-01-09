
const UserController = require("../controller/user.controller.js");
const MailingController = require("../controller/mailing.controller.js");
const SendMailController = require("../service/sendMail.controller.js");

class UserEndPoint {

  // Create and Save a new user
  static create = (req, res) => {
    // Validate request
    if (!req.body.password) {
      res.status(400).send({
        message: "Conteúdo password não pode ser Vazio!"
      });
      return;
    }

    if (!req.body.email) {
      res.status(400).send({
        message: "Conteúdo email não pode ser Vazio!"
      });
      return;
    }    
    // Create a User
    const user = req.body;
    UserController.create(user)
      .then(data => {
      res.send(data);
    })
  };

  // Update a user by the id in the request
  static update = (req, res) => {    
    UserController.update(req.body)
      .then(data => {
      res.send(data);
    })
  };


  // Delete a user with the specified id in the request
  static delete = (req, res) => {
    const id = req.params.id;

    UserController.delete(id).then(data => {
      res.send(data);
    })
  };

  // Find a single user with an id
  static get = (req, res) => {    
    UserController.get(req.params.email)
      .then(data => {
        res.send(data);
      })
  };

  static getlist = (req, res) => {
    const tb_institution_id = req.params.tb_institution_id;

    UserController.getlist(tb_institution_id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.send(new Error("EP - Usuário: "+ err));
      });      
  };

        
}
module.exports = UserEndPoint;

