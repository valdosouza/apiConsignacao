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
  
  Query.sequelize.query(
    'SELECT rho.tb_product_id, pr.description,  rho.price_tag  '+
    'FROM  tb_rest_group_has_optional rho   '+
    '  inner join tb_product pr  '+
    '  on (pr.id = rho.tb_product_id)  '+
    '  and (pr.tb_institution_id = rho.tb_institution_id)  '+
    '  inner join tb_rest_group rg  '+
    '  on (rg.id = rho.tb_rest_group_id)  '+
    '   and (rg.tb_institution_id = rho.tb_institution_id)  '+
    'where ( rho.tb_institution_id =? ) '+ 
    '  and ( rg.description  =? ) '+
    ' order by pr.description',
      
    { replacements: [req.body.tb_institution_id,req.body.group_desc], 
    type: Query.sequelize.QueryTypes.SELECT }
  ).then(data => {
    res.send(data);  
})
};
