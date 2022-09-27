db = require("../model");
Oper = db.customer;
const EntityController = require("../controller/entity.controller.js");
const PersonController = require("../controller/person.controller.js");
const CompanyController = require("../controller/company.controller.js");
const AddressController = require("../controller/address.controller.js");
const PhoneController = require("../controller/phone.controller.js");

class CustomerController {

  static async insert(customer) {
    const promise = new Promise((resolve, reject) => {
      Tb.create(customer)
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject("Erro:" + err);
        });
    });
    return promise;
  }

  static getByKey(data) {
    Oper.sequelize.query(
      'Select c.* ' +
      'from tb_customer c ' +
      'where ( c.tb_institution_id =? ) ' +
      ' and ( c.id =? ) ',
      {
        replacements: [data.tb_customer_id, data.tb_institution_id],
        type: Oper.sequelize.QueryTypes.SELECT
      })
      .then(data => {
        if (!data) {
          return false;
        } else {
          return data;
        };
      })
  }


  static getByPhone(phone) {

    switch ((phone.length)) {
      case 13:
        phone = phone.substr(5, 8);
        break;
      case 12:
        phone = phone.substr(4, 8);
        break;
      case 11:
        phone = phone.substr(3, 8);
        break;
      case 10:
        phone = phone.substr(2, 8);
        break;
    }

    const promise = new Promise((resolve, reject) => {
      Oper.sequelize.query(
        'Select et.id, et.nick_trade, ad.zip_code, ad.street, ' +
        'ad.nmbr, ad.complement, ad.neighborhood, c.name locality, ' +
        's.abbreviation state, ad.longitude ,  ad.latitude, ph.address_kind, ph.number ' +
        'from tb_entity et   ' +
        '  inner join tb_address ad ' +
        '  on (ad.id =et.id) ' +
        '  left join tb_city c ' +
        '  on (c.id = ad.tb_city_id) ' +
        '  inner join tb_state s ' +
        '  on (s.id = ad.tb_state_id) ' +
        '  inner join tb_phone ph ' +
        '  on (ph.id = ad.id) ' +
        'where ( ph.number like ?) ' +
        'limit 0,1 ',
        {
          replacements: ["%" + phone],
          type: Oper.sequelize.QueryTypes.SELECT
        }).then(data => {
          if (data[0] != null)
            resolve(data);
          else
            resolve(null);
        })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao buscar o telefone"));
        });
    });
    return promise;
  };

  static getByDocFiscal(docFiscal) {

    const promise = new Promise((resolve, reject) => {
      (async () => {
        let result = "";
        if (docFiscal.length > 0) {
          if (docFiscal.length == 11) {
            await PersonController.getByCPF(docFiscal)
              .then(data => {
                result = data;
              })
          } else {
            await CompanyController.getByCNPJ(docFiscal)
              .then(data => {
                result = data;
              })
          }
        }
        return result;
      })()
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Erro: " + err));
        });
    });
    return promise;
  };

  static saveObject(customer) {

    const promise = new Promise((resolve, reject) => {
      (async () => {
        let result = 'não';

        //Verifica se o fone existe
        await this.getByPhone(customer.phone)
          .then(data => {
            result = data;
          })

        if (!result) {
          //Verifica se existe CPF ou CNPJ          
          await this.getByDocFiscal(customer.docFiscal)
            .then(data => {
              if (data.id > 0) {
                //se encontrou por algum docFiscal só registrar o Telefone 
                customer.id = data.id;
                this.saveAddress(customer);
                this.savePhone(customer);
              } else {
                //Se não encontrou faz o registro completo.
                this.saveEntity(customer)
                  .then((data) => {
                    customer.id = data.id;
                    if (customer.docFiscal.length > 0) {
                      if (customer.docFiscal.length == 11) {
                        this.savePerson(customer);
                      } else {
                        this.saveCompany(customer);
                      }
                    }
                    this.saveAddress(customer);
                    this.savePhone(customer);
                  })
              }

            });
        } else {
          customer.id = resul.id;
          this.saveAddress(customer);
        }
        return result;

      })()
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Erro: " + err));
        });


    });
    return promise;
  }
  static async saveEntity(customer) {

    const promise = new Promise((resolve, reject) => {
      const entity = {
        id: 0,
        name_company: customer.name,
        nick_trade: customer.name,
        note: "",
      }
      EntityController.insert(entity)
        .then((data) => {
          customer.id = data.id;
          resolve(customer);
        })
        .catch(err => {
          reject(new Error("Erro: " + err));
        });
    });
    return promise;
  }

  static savePerson(customer) {
    const person = {
      id: customer.id,
      cpf: customer.docFiscal
    }
    PersonController.insert(person);
  }

  static saveCompany(customer) {
    const Company = {
      id: customer.id,
      cpf: customer.docFiscal
    }
    CompanyController.insert(Company);
  }

  static saveAddress(customer) {
    const address = {
      id: customer.id,
      street: customer.street,
      nmbr: customer.number,
      complement: customer.complement,
      neighborhood: customer.neighborhood,
      kind: "RESIDENCIAL",
      zip_code: customer.zipCode,
      tb_country_id: "1058",
      tb_state_id: "41",
      tb_city_id: "4004",
      main: "S"
    };
    AddressController.insert(address);
  };

  static savePhone(customer) {
    const phone = {
      id: customer.id,
      kind: "Celular",
      contact: customer.name,
      number: customer.phone,
      address_kind: "delivery"
    };
    PhoneController.insert(phone);
  }



  static getList(parameter) {

    const promise = new Promise((resolve, reject) => {
      Oper.sequelize.query(
        'SELECT distinct ct.id, et.name_company,et.nick_trade, ' +
        'ad.street, ad.nmbr, ad.neighborhood, ad.kind  ' +
        'FROM tb_customer ct  ' +
        '  INNER JOIN tb_entity et  ' +
        '  on (ct.id = et.id)  ' +
        '  inner join tb_address ad  ' +
        '  on (ad.id = et.id)  ' +
        'where (ct.tb_institution_id =?) ',
        {
          replacements: [6825],
          type: Oper.sequelize.QueryTypes.SELECT
        }).then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(new Error("Algum erro aconteceu ao buscar o cliente"));
        });
    });
    return promise;
  };





}
module.exports = CustomerController; 