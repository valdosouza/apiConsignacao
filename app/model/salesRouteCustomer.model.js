const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    tb_sales_route_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "tb_sales_route_id"
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
    tb_customer_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "tb_customer_id"
    },
    sequence: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "sequence"
    },    
    active: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: "S",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "active"
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
    tableName: "tb_sales_route_customer",
    comment: "",
    timestamps: true    
  };
  const SalesRouteCustomerModel = sequelize.define("tb_sales_route_customer_model", attributes, options);
  return SalesRouteCustomerModel;
};