
const UserController = require("../controller/user.controller.js");
const MailingController = require("../controller/mailing.controller.js");
const SendMailController = require("../service/sendMail.controller.js");

class AuthEndPoint {

  static authenticate = (req, res) => {

    if (!req.body.email || !req.body.password) {
      return res.status(400).send('Informe usuário e senha!')
    }

    MailingController.findOne(req.body.email)
      .then(data => {
        console
        if (!data) {
          const dataReturn = {
            "auth": false,
            "id": 0,
            "tb_institution_id": 0,
            "username": req.body.email,
            "password": '',
            "jwt": '',
            "error": "'e-mail não encontrado!'"
          };
          return res.send(dataReturn);
        } else {
          UserController.getUserAuth(req.body.email, req.body.password)
            .then(data => {
              if (data.length == 0) {
                const dataReturn = {
                  "auth": false,
                  "id": 0,
                  "tb_institution_id": 0,
                  "username": '',
                  "password": '',
                  "jwt": '',
                  "error": "Autenticacão falhou, Revise as informações."
                };
                return res.json(dataReturn);
              } else {
                UserController.generateJWT(data)
                  .then(data => {
                    return res.json(data);
                  })
                  .catch(error => {
                    res.status(500).send({
                      message:
                        error.message || "' - Algum erro aconteceu!'"
                    });
                  });
              }
            })
        }
      })
  };

  static authorization = (req, res) => {

    return res.status(200).send({
      "message": "Valid Token",
      "result": true
    });

  };

  static recoveryPassword = (req, res) => {
    // Validate request
    if (!req.body.email) {
      res.status(400).send({
        message: "Conteúdo não pode ser Vazio!"
      });
      return;
    }

    UserController.recoveryPassword(req.body.email)
      .then(data => {
        SendMailController.recoveryPassword(data)
          .then(data => {
            res.json(data);
          });

      });

  };

  static changePassword = (req, res) => {
    // Validate request      
    if (!req.body.salt) {
      res.status(400).send({
        message: "Codigo Salt não pode ser Vazio!"
      });
      return;
    }
    if (!req.body.tb_user_id) {
      res.status(400).send({
        message: "Codidgo usuário não pode ser Vazio!"
      });
      return;
    }
    if (!req.body.newPassword) {
      res.status(400).send({
        message: "A Nova senha não pode ser vazia!"
      });
      return;
    }

    UserController.getSalt(req.body)
      .then(data => {
        if (data[0]) {
          UserController.changePassword(req.body)
            .then(data => {
              return res.json(data);
            });
        } else {
          return res.json("Codigo Verificador não encontrado");
        };
      });
  }
}
module.exports = AuthEndPoint;

