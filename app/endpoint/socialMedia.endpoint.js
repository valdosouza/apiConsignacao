const { socialMedia } = require("../model");
const db = require("../model");
const Query = db.socialMedia;

exports.save = (req, res) => {

};

exports.create = (req, res) => {
  // Validate request
  if (!req.body.id) {
    res.status(400).send({
      message: "Conteudo não pode ser em branco!"
    });
    return;
  }

  // Create a   const obj = req.body;

  // Save  in the database
  Query.create(obj)
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.status(500).send({
        message:
          error.message || "Algum Erro aconteceu!!"
      });
    });
};

