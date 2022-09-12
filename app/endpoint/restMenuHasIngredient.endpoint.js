const db = require("../model");
const Query = db.restMenuHasIngredient;


// Retrieve all from the database.
exports.findAll = (req, res) => {
    
  Query.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users."
      });
    });
};

exports.getlist  = (req, res) => {
  const tb_institution_id = req.body.tb_institution_id;
  const tb_rest_menu_id = req.body.tb_rest_menu_id;

  Query.sequelize.query(
    'SELECT pr.id, pr.description '+
    'FROM  tb_product pr '+
    ' inner join tb_rest_menu_has_ingredient rhi '+
    '  on (rhi.tb_product_id = pr.id ) '+
    '  and (rhi.tb_institution_id = pr.tb_institution_id) '+
    'where ( pr.tb_institution_id =? ) '+
    '  and ( rhi.tb_rest_menu_id =? ) ',
      
    { replacements: [tb_institution_id,tb_rest_menu_id], 
    type: Query.sequelize.QueryTypes.SELECT }
  ).then(data => {
    res.send(data);  
})
};
