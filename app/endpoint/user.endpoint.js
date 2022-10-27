
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
    UserController.update(req.params.id,req.body)
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

  static authenticate = (req, res) => {

    if (!req.body.email || !req.body.password) {
      return res.status(400).send('Informe usuário e senha!')
    }
    
    MailingController.findOne(req.body.email)
      .then(data => {
        if (!data) return res.send("'e-mail não encontrado!'");
      })

    UserController.getUserAuth(req.body.email, req.body.password)
      .then(data => {  
        if ((!data) || (!data[0])) return res.json({ 
          auth: false, 
          id: 0,
          institution : 0,
          username : "",
          jwt: "" });    

        UserController.generateJWT(data)
          .then(data => {
            return res.json(data);
          })  
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "' - Algum erro aconteceu!'"
            });
          });
      })
  };
  
  static authorization = (req, res) => {
    return res.json("entrei");          
    const token = req.headers['x-access-token'];  
    
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
      UserController.authorization(token)
      .then(data=>{          
          return res.json(data);          
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
      .then(data=>{          
        SendMailController.recoveryPassword(data)
        .then(data=>{          
          res.json(data);
          });        
        });                       
    };

    static changePassword = (req, res) => {
      // Validate request
      if (!req.body.salt) {
        res.status(400).send({
          message: "Codidgo Salt não pode ser Vazio!"
        });
        return;
      }
      if (!req.body.user) {
        res.status(400).send({
          message: "Codidgo usuário não pode ser Vazio!"
        });
        return;
      }

      UserController.changePassword(req.body)
        .then(data=>{          
            return res.json(data);          
        });      
      }    
}
module.exports = UserEndPoint;

