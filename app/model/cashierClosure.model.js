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
      tb_cashier_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "tb_cashier_id"
      },
      description: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "description"
      },
      kind: {
        type: DataTypes.STRING(25),
        allowNull: true,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "kind"
      },
      tag_value: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "tag_value"
      },
      color: {
        type: DataTypes.STRING(25),
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "color"
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
      tableName: "tb_cashier_closure",
      comment: "",
      timestamps : true    
    };
    const CashierClosureModel = sequelize.define("tb_cashier_closure_model", attributes, options);
    return CashierClosureModel;
  };