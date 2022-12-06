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
        defaultValue: "0",
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "terminal"
      },
      tb_entity_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "tb_entity_id"
      },        
      number: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "number"
      },
      direction: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: "null",
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "direction"
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
      tableName: "tb_order_stock_adjust",
      comment: "",
      timestamps : true,
      indexes: []
    };
    const TbOrderStockAdjustModel = sequelize.define("tb_order_stock_adjust_model", attributes, options);
    return TbOrderStockAdjustModel;
  };