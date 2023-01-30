const MailingController = require("../controller/mailing.controller.js");

class MailingEndPoint {

  // Create and Save a new mailing
  static create = (req, res) => {
    // Validate request
    if (!req.body.password) {
      res.status(400).send({
        message: "Conteúdo não pode ser Vazio!"
      });
      return;
    }

    // Create a mailing
    const mailng = req.body;
    MailingController.create(mailng)
      .then(data => {
        res.send(data);
    })
  };

  // Update a mailing by the id in the request
  static update = (req, res) => {
    const id = req.params.id;
    const mailing = req.body;
    MailingController.update(id, mailing)
      .then(data => {
        res.send(data);
    })
  };

  // Delete a mailing with the specified id in the request
  static delete = (req, res) => {
    const id = req.params.id;

    MailingController.delete(id)
      .then(data => {
        res.send(data);
    })
  };

  static findAll = (req, res) => {

    MailingController.findAll()
      .then(data => {
        res.send(data);
      })
  }

  // Find a single mailing with an id
  static findOne = (req, res) => {
    const email = req.params.email;
    MailingController.findOne(email)
      .then(data => {
        res.send(data);
    })
  };

  static getlist = (req, res) => {   
    MailingController.getlist()
      .then(data => {
      res.send(data);
    })
  }
}
module.exports = MailingEndPoint;

