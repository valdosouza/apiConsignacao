const Base = require("../controller/base.controller.js");
const db = require("../model");
const Tb = db.address;
class AddressController extends Base {
  static async getById(id) {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize
        .query(
          "Select  " +
          "a.id, " +
          "a.street, " +
          "a.nmbr, " +
          "a.complement, " +
          "a.neighborhood, " +
          "a.region, " +
          "a.kind, " +
          "a.zip_code, " +
          "a.tb_country_id, " +
          "cy.name name_country, " +
          "a.tb_state_id, " +
          "st.name name_state, " +
          "a.tb_city_id, " +
          "ct.name name_city, " +
          "a.main, " +
          "a.longitude, " +
          "a.latitude, " +
          "a.createdAt, " +
          "a.updatedAt " +
          "from tb_address a " +
          "    inner join tb_city ct   " +
          "    on (ct.id = a.tb_city_id)   " +
          "    inner join tb_state st   " +
          "    on (st.id = a.tb_state_id)   " +
          "    inner join tb_country cy  " +
          "    on (cy.id = a.tb_country_id)  " +
          "where ( a.id =?) ",
          {
            replacements: [id],
            type: Tb.sequelize.QueryTypes.SELECT,
          }
        )
        .then((data) => {
          if (data.length > 0) resolve(data[0]);
          else resolve(data);
        })
        .catch((error) => {
          reject("Address.getById: " + error);
        });
    });
    return promise;
  }

  static async save(address) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        delete address.name_country;
        delete address.name_state;
        delete address.name_city;
        var resultAddress = await this.getById(address.id);

        if (resultAddress.length == 0) {
          this.insert(address);
        } else {
          this.update(address);
        }
        resolve(address);
      } catch (error) {
        reject("Address.save: " + error);
      }
    });
    return promise;
  }

  static async insert(address) {
    const promise = new Promise((resolve, reject) => {
      delete address.name_country;
      delete address.name_state;
      delete address.name_city;
      Tb.create(address)
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject("Erro:" + error);
        });
    });
    return promise;
  }

  static getList() {
    const promise = new Promise((resolve, reject) => {
      Tb.sequelize
        .query("select  * " + "from tb_address " + "where id is not null", {
          type: Tb.sequelize.QueryTypes.SELECT,
        })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(new Error("Address.getlist:" + error));
        });
    });
    return promise;
  }

  static async update(address) {
    const promise = new Promise((resolve, reject) => {
      Tb.update(address, {
        where: { id: address.id, kind: address.kind },
      }).catch((error) => {
        reject("Address.update:" + error);
      });
    });
    return promise;
  }

  static async delete(address) {
    const promise = new Promise((resolve, reject) => {
      resolve("Em Desenvolvimento");
      /*
        Tb.delete(address)
            .then((data) => {
                resolve(data);
            })
            .catch(error => {
                reject("Erro:"+ error);
            });
        */
    });
    return promise;
  }
}

module.exports = AddressController;
