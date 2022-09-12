const db = require("../model");
const Query = db.restGhAtt;


// Retrieve all from the database.
exports.findAll = (req, res) => {
    
  Query.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Attriutes."
      });
    });
};

exports.getlist  = (req, res) => {
  const tb_institution_id = req.body.tb_institution_id;
  const kind = req.body.kind;

  Query.sequelize.query(
    'SELECT rgha. id, rgha.description, rgha.kind, rgha.price_tag '+
    'FROM tb_rest_group_has_attribute  rgha '+
    'where rgha.tb_institution_id =? '+
    'and rgha.kind =? ',      
    { replacements: [tb_institution_id,kind], 
    type: Query.sequelize.QueryTypes.SELECT }
  ).then(data => {
    res.send(data);  
})
};
