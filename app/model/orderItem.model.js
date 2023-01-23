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
    tb_order_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "tb_order_id"
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
    kind: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "kind"
    },    

    tb_stock_list_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tb_stock_list_id"
    },
    tb_price_list_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tb_price_list_id"
    },
    tb_product_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tb_product_id"
    },
    
    quantity: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "quantity"
    },
    unit_value: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "unit_value"
    },
    discount_aliqu: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "discount_aliqu"
    },
    discount_value: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "discount_value"
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
    tableName: "tb_order_item",
    timestamps: true,
    comment: "",
    indexes: [{
      name: "tb_product_id",
      unique: false,
      type: "BTREE",
      fields: ["tb_product_id"]
    }, {
      name: "tb_order_id",
      unique: false,
      type: "BTREE",
      fields: ["tb_order_id"]
    }, {
      name: "tb_institution_id",
      unique: false,
      type: "BTREE",
      fields: ["tb_institution_id"]
    }, {
      name: "tb_stock_list_id",
      unique: false,
      type: "BTREE",
      fields: ["tb_stock_list_id"]
    }]
  };
  const OrderItemModel = sequelize.define("tb_order_item_model", attributes, options);
  return OrderItemModel;
};