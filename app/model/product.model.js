const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: "0",
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "id"
    },
    tb_institution_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: "0",
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "tb_institution_id",
      references: {
        key: "id",
        model: "tb_institution_model"
      }
    },
    identifier: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "identifier"
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "description"
    },
    tb_category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tb_category_id"
    },
    tb_financial_plans_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tb_financial_plans_id"
    },
    promotion: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: "N",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "promotion"
    },
    highlights: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: "N",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "highlights"
    },
    active: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "active"
    },
    published: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: "S",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "published"
    },
    note: {
      type: DataTypes.BLOB,  
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "note"
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
    tableName: "tb_product",
    comment: "",
    timestamps: true,
    indexes: []
  };
  const ProductModel = sequelize.define("tb_product_model", attributes, options);
  return ProductModel;
};