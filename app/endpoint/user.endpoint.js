const UserController = require("../controller/user.controller.js");
const MailingController = require("../controller/mailing.controller.js");


class UserEndPoint {

  // Create and Save a new user
  static create = (req, res) => {
    // Validate request
    if (!req.body.password) {
      res.status(400).send({
        message: "Conteúdo não pode ser Vazio!"
      });
      return;
    }

    // Create a User
    const user = req.body;
    UserController.create(user).then(data => {
      res.send(data);
    })
  };

  // Update a user by the id in the request
  static update = (req, res) => {
    const id = req.params.id;

    UserController.update(id, user).then(data => {
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

  static findAll = (req, res) => {

    UserController.findAll()
      .then(data => {
        res.send(data);
      })
  }

  // Find a single user with an id
  static findOne = (req, res) => {
    const id = req.params.id;
    UserController.findOne(id).then(data => {
      res.send(data);
    })
  };

  static getlist = (req, res) => {
    const tb_institution_id = req.body.tb_institution_id;

    UserController.getlist(tb_institution_id).then(data => {
      res.send(data);
    })
  }

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
    }
}
module.exports = UserEndPoint;

