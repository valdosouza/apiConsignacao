const {
    DataTypes
  } = require('sequelize');
  
  module.exports = sequelize => {
    const attributes = {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "id"
      },
      tb_institution_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "tb_institution_id"
      },
      terminal: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "terminal"
      },
      tb_product_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "tb_product_id"
      },
      stock_balance: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: "0",
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "stock_balance"
      },
      sale: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: "0",
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "sale"
      },
      bonus: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: "0",
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "bonus"
      },
      adjust: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: "0",
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "adjust"
      },
      new_load: {
        type: DataTypes.DECIMAL,
        allowll: true,
        defaultValue: "0",
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "new_load"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "createdAt"
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "updatedAt"
      }
    };
    const options = {
      tableName: "tb_order_load_card",
      comment: "",
      timestamps: true,
      indexes: []
    };
    const TbOrderLoadCardModel = sequelize.define("tb_order_load_card_model", attributes, options);
    return TbOrderLoadCardModel;
  };