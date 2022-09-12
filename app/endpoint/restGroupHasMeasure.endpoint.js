const db = require("../model");
const Query = db.restGhMea;


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

  Query.sequelize.query(
    'SELECT m.id, m.description, ghm.parts '+
    'FROM tb_rest_group rg '+
    '  inner join tb_rest_group_has_measure ghm '+
    '  on (ghm.tb_rest_group_id = rg.id) '+
    '      and (ghm.tb_institution_id = rg.tb_institution_id) '+
    '  inner join tb_institution_has_measure ihm '+
    '  on (ihm.tb_institution_id = ghm.tb_institution_id) '+
    '    and (ihm.tb_measure_id = ghm.tb_measure_id) '+
    '  inner join tb_measure m '+
    '  on (m.id = ihm.tb_measure_id) '+
    'where rg.tb_institution_id =? ',
    { replacements: [tb_institution_id], 
    type: Query.sequelize.QueryTypes.SELECT }
  ).then(data => {
    res.send(data);  
})
};
