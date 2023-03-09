const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  dbConfig.DB, 
  dbConfig.USER, 
  dbConfig.PASSWORD,
     {  host: dbConfig.HOST,      
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
        dialectOptions: { dateStrings: true,
                          typeCast(field, next) {            
                            if ((field.type === 'DATETIME') || (field.type === 'DATE') ){
                              return field.string();
                            }
                            return next();
                          }
                        },
        timezone: "-03:00",
        seederStorage: "sequelize",        
      }
);

const db = {};

db.Sequelize = Sequelize;

db.state = require("./state.model.js")(sequelize, Sequelize);
db.city = require("./city.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.restGhMea = require("./restGroupHasMeasure.model.js")(sequelize, Sequelize);
db.restMenu = require("./restMenu.model.js")(sequelize, Sequelize);
db.restMenuHasIngredient = require("./restMenuHasIngredient.model.js")(sequelize, Sequelize);
db.restGroupHasOptional = require("./restGroupHasOptional.model.js")(sequelize, Sequelize);
db.restGhAtt = require("./restGroupHasAttribute.model.js")(sequelize, Sequelize);

db.paymentTypes = require("./payment_types.model.js")(sequelize, Sequelize);
db.institutionHasPaymentType = require("./institutionHasPaymentTypes.model.js")(sequelize, Sequelize);

db.lineBusiness = require("./linebusiness.model.js")(sequelize, Sequelize);
db.institutionHasLineBusiness = require("./institutionHasLinebusiness.model.js")(sequelize, Sequelize);

db.pricelist = require("./priceList.model.js")(sequelize, Sequelize);
db.price = require("./price.model.js")(sequelize, Sequelize);

db.salesroute = require("./salesRoute.model.js")(sequelize, Sequelize);
db.salesroutecustomer = require("./salesRouteCustomer.model.js")(sequelize, Sequelize);

db.entity = require("./entity.model.js")(sequelize, Sequelize);
db.entityHasMailing = require("./entityHasMailing.model.js")(sequelize, Sequelize);
db.entityHasStockList = require("./entityHasStockList.model.js")(sequelize, Sequelize);

db.address = require("./address.model.js")(sequelize, Sequelize);
db.phone = require("./phone.model.js")(sequelize, Sequelize);
db.mailing = require("./mailing.model.js")(sequelize, Sequelize);
db.mailingGroup = require("./mailingGroupModel.js")(sequelize, Sequelize);
db.socialMedia = require("./socialMedia.model.js")(sequelize, Sequelize);
db.person = require("./person.model.js")(sequelize, Sequelize);
db.company = require("./company.model.js")(sequelize, Sequelize);
db.institution = require("./institution.model.js")(sequelize, Sequelize);
db.stockList = require("./stockList.model.js")(sequelize, Sequelize);
db.stockBalance = require("./stockBalance.model.js")(sequelize, Sequelize);
db.stockStatement = require("./stockStatement.model.js")(sequelize, Sequelize);

db.collaborator = require("./collaborator.model.js")(sequelize, Sequelize);

db.customer = require("./customer.model.js")(sequelize, Sequelize);

db.product = require("./product.model.js")(sequelize, Sequelize);
db.order = require("./order.model.js")(sequelize, Sequelize);
db.orderitem = require("./orderItem.model.js")(sequelize, Sequelize);
db.orderproduction = require("./orderProduction.model.js")(sequelize, Sequelize);
db.orderbonus = require("./orderBonus.model.js")(sequelize, Sequelize);
db.orderstockadjust = require("./orderStockAdjust.model.js")(sequelize, Sequelize);
db.ordersale = require("./orderSale.model.js")(sequelize, Sequelize);
db.ordersalecard = require("./orderSaleCard.model.js")(sequelize, Sequelize);
db.orderstocktransfer = require("./orderStockTransfer.model.js")(sequelize, Sequelize);
db.orderconsignment = require("./orderConsignment.model.js")(sequelize, Sequelize);
db.orderconsignmentcard = require("./orderConsignmentCard.model.js")(sequelize, Sequelize);
db.orderpaid = require("./orderPaid.model.js")(sequelize, Sequelize);
db.orderattendance = require("./orderAttendance.model.js")(sequelize, Sequelize);
db.cashier = require("./cashier.model.js")(sequelize, Sequelize);
db.cashierclosure = require("./cashierClosure.model.js")(sequelize, Sequelize);
db.orderloadcard = require("./orderLoadCard.model.js")(sequelize, Sequelize);


db.restSubgroup = require("./restSubgroup.model.js")(sequelize, Sequelize);
db.restGroup = require("./restGroup.model.js")(sequelize, Sequelize);
db.restButton = require("./Buttton.model.js")(sequelize, Sequelize);//Manter os nomes assim por questão de organização
db.restButtonHasMenu = require("./restSubgroup.model.js")(sequelize, Sequelize);
db.restPizza = require("./restMenu.model.js")(sequelize, Sequelize);
db.restCalzone = require("./restMenu.model.js")(sequelize, Sequelize);
db.restEdge = require("./restMenu.model.js")(sequelize, Sequelize);
db.restDough = require("./restMenu.model.js")(sequelize, Sequelize);
db.restBeverage = require("./restMenu.model.js")(sequelize, Sequelize);


db.TbInstitutionHasUser = require("./institutionHasUser.model.js")(sequelize, Sequelize);
db.order = require("./order.model.js")(sequelize, Sequelize);
db.orderSale = require("./orderSale.model.js")(sequelize, Sequelize);
db.financial = require("./financial.model.js")(sequelize, Sequelize);
db.financialPayment = require("./financial_payment.model.js")(sequelize, Sequelize);
db.financialStatement = require("./financialStatement.model.js")(sequelize, Sequelize);
db.orderConsignment = require("./orderConsignment.model.js")(sequelize, Sequelize);

db.orderItemDetached = require("./orderItemDetached.model.js")(sequelize, Sequelize);
db.orderItemDetail = require("./orderItemDetail.model.js")(sequelize, Sequelize);
db.deliveryRange = require("./deliveryRange.model.js")(sequelize, Sequelize);

module.exports = db;