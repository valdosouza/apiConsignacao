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
      kind: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: null,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "kind"
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
      leftover: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: "0",
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "leftover"
      },
      devolution: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: "0",
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "devolution"
      },
      new_consignment: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: "0",
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "new_consignment"
      },
      qty_consigned: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: "0",
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "qty_consigned"
      },
      qty_sold: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: "0",
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "qty_sold"
      },
      unit_value: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: "0",
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "unit_value"
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
      tableName: "tb_order_consignment_item",
      comment: "",
      timestamps: true,
      indexes: []
    };
    const TbOrderConsignmentItemModel = sequelize.define("tb_order_consignment_item_model", attributes, options);
    return TbOrderConsignmentItemModel;
  };