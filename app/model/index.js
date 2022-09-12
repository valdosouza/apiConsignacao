const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  dbConfig.DB, 
  dbConfig.USER, 
  dbConfig.PASSWORD,
     { host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        pool: { max: dbConfig.pool.max,
                min: dbConfig.pool.min,
                acquire: dbConfig.pool.acquire,
                idle: dbConfig.pool.idle
              },  
        define: { underscored: true,
                  freezeTableName: true, // use singular table name
                  timestamps: false // I don't want timestamp fields by default
                },
        dialectOptions: { //useUTC: false, // for reading from database
                          dateStrings: true,
                          typeCast(field, next) {            
                            if (field.type === 'DATETIME') {
                              return field.string();
                            }
                            return next();
                          }
                        },
        timezone: '-03:00',
      }
);

const db = {};

db.Sequelize = Sequelize;

db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.restGhMea = require("./restGroupHasMeasure.model.js")(sequelize, Sequelize);
db.restMenu = require("./restMenu.model.js")(sequelize, Sequelize);
db.restMenuHasIngredient = require("./restMenuHasIngredient.model.js")(sequelize, Sequelize);
db.restGroupHasOptional = require("./restGroupHasOptional.model.js")(sequelize, Sequelize);
db.restGhAtt = require("./restGroupHasAttribute.model.js")(sequelize, Sequelize);
db.paymentType = require("./payment_types.model.js")(sequelize, Sequelize);

db.entity = require("./entity.model.js")(sequelize, Sequelize);
db.address = require("./address.model.js")(sequelize, Sequelize);
db.phone = require("./phone.model.js")(sequelize, Sequelize);
db.mailing = require("./mailing.model.js")(sequelize, Sequelize);
db.socialMedia = require("./socialMedia.model.js")(sequelize, Sequelize);
db.person = require("./person.model.js")(sequelize, Sequelize);
db.company = require("./company.model.js")(sequelize, Sequelize);
db.restSubgroup = require("./restSubgroup.model.js")(sequelize, Sequelize);
db.restGroup = require("./restGroup.model.js")(sequelize, Sequelize);
db.restButton = require("./Buttton.model.js")(sequelize, Sequelize);//Manter os nomes assim por questão de organização
db.restButtonHasMenu = require("./restSubgroup.model.js")(sequelize, Sequelize);
db.restPizza = require("./restMenu.model.js")(sequelize, Sequelize);
db.restCalzone = require("./restMenu.model.js")(sequelize, Sequelize);
db.restEdge = require("./restMenu.model.js")(sequelize, Sequelize);
db.restDough = require("./restMenu.model.js")(sequelize, Sequelize);
db.restBeverage = require("./restMenu.model.js")(sequelize, Sequelize);

db.institution = require("./institution.model.js")(sequelize, Sequelize);
db.customer = require("./customer.model.js")(sequelize, Sequelize);
db.order = require("./order.model.js")(sequelize, Sequelize);
db.orderSale = require("./orderSale.model.js")(sequelize, Sequelize);
db.financial = require("./financial.model.js")(sequelize, Sequelize);
db.financialBills = require("./financial_bills.model.js")(sequelize, Sequelize);
db.financialPAyment = require("./financial_payment.model.js")(sequelize, Sequelize);
db.orderConsignment = require("./orderConsignment.model.js")(sequelize, Sequelize);
db.product = require("./product.model.js")(sequelize, Sequelize);
db.orderItemDetached = require("./orderItemDetached.model.js")(sequelize, Sequelize);
db.orderItemDetail = require("./orderItemDetail.model.js")(sequelize, Sequelize);
db.deliveryRange = require("./deliveryRange.model.js")(sequelize, Sequelize);

module.exports = db;