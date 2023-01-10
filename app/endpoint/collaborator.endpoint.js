const CollaboratorController = require("../controller/collaborator.controller.js");
const { entity } = require("../model/index.js");

class CollaboratorEndPoint {

  static save = (req, res) => {
    try {
      CollaboratorController.save(req.body)
        .then(data => {
          var dataRes = {
            id: data.entity.id,
            name_company: data.entity.name_company,
            nick_trade: data.entity.nick_trade,
            doc_kind: "",
            doc_number: "",
            tb_linebusiness_id: entity.tb_linebusiness_id,
            name_linebusiness: "",
          };
          if (data.person.id > 0) {
            dataRes.doc_kind = "F";
            dataRes.doc_number = data.person.cpf;
          } else {
            dataRes.doc_kind = "J";
            dataRes.doc_number = data.company.cnpj;
          };
          res.send(dataRes);
        })
    } catch (err) {
      res.send(err);
    }
  }

  static get = (req, res) => {
    CollaboratorController.get(req.params.tb_institution_id, req.params.id)
      .then(data => {
        res.send(data);
      })
  };

  static getList = (req, res) => {

    CollaboratorController.getList(req.params.tb_institution_id)
      .then(data => {
        res.send(data);
      })
  };

  static delete(req, res) {

    CollaboratorController.delete(req.body).then(data => {
      res.send(data);
    })
  }
}

module.exports = CollaboratorEndPoint;