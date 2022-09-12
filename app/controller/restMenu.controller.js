const db = require("../model");
const Query = db.restMenu;


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
  const tb_measure_id = req.body.tb_measure_id;

  Query.sequelize.query(
    'SELECT DISTINCT rm.description, price_tag  '+
    'FROM tb_rest_menu  rm  '+
    '  inner join tb_rest_menu_has_product rhp '+
    '  on (rhp.tb_rest_menu_id = rm.id ) '+
    '  and (rhp.tb_institution_id = rm.tb_institution_id)  '+      
    '  inner join tb_product pr  '+
    '  on (rhp.tb_product_id = pr.id)  '+
    '  and (rhp.tb_institution_id = pr.tb_institution_id) '+
    '  inner join tb_price pi '+
    '  on (pi.tb_product_id = pr.id) '+
    '      and (pr.tb_institution_id = pi.tb_institution_id)     '+
    '  inner join tb_stock st '+
    '  on (st.tb_merchandise_id = pr.id) '+
    '  and (st.tb_institution_id = pr.tb_institution_id)     '+
    'where st.outline = "N" '+
    ' and pi.tb_price_list_id = 1  '+
    'and  pr.tb_institution_id =? '+
    'and st.tb_measure_id =? '+
    'order by rm.description ',
      
    { replacements: [tb_institution_id,tb_measure_id], 
    type: Query.sequelize.QueryTypes.SELECT }
  ).then(data => {
    res.send(data);  
})
};
