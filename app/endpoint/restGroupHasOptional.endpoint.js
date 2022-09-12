const db = require("../model");
const Query = db.restGroupHasOptional;


// Retrieve all from the database.
exports.findAll = (req, res) => {
    
  Query.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Algum erro aconteceu!"
      });
    });
};

exports.getlist  = (req, res) => {
  const tb_institution_id = req.body.tb_institution_id;
  const tb_rest_group_id = req.body.tb_rest_group_id;

  Query.sequelize.query(
    'SELECT rho.id, rho.description,  rho.price_tag '+
    'FROM  tb_rest_group_has_optional rho '+
    'where ( rho.tb_institution_id =? ) '+ 
    '  and ( rho.tb_rest_group_id =? ) ',
      
    { replacements: [tb_institution_id,tb_rest_group_id], 
    type: Query.sequelize.QueryTypes.SELECT }
  ).then(data => {
    res.send(data);  
})
};
