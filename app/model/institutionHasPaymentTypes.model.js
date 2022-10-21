const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    tb_institution_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "tb_institution_id",
      references: {
        key: "id",
        model: "tb_institution_model"
      }
    },
    tb_payment_types_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "tb_payment_types_id",
      references: {
        key: "id",
        model: "tb_payment_types_model"
      }
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
    tableName: "tb_institution_has_payment_types",
    comment: "",
    timestamps: true,
    indexes: [{
      name: "tb_payment_types_id",
      unique: false,
      type: "BTREE",
      fields: ["tb_payment_types_id"]
    }, {
      name: "updated_at",
      unique: false,
      type: "BTREE",
      fields: ["updated_at"]
    }]
  };
  const InstitutionHasPaymentTypesModel = sequelize.define("tb_institution_has_payment_types_model", attributes, options);
  return InstitutionHasPaymentTypesModel;
};