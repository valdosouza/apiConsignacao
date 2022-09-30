const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    tb_entity_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "tb_entity_id"
    },
    tb_mailing_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "tb_mailing_id"
    },
    tb_mailing_group_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "tb_mailing_group_id"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "createdAt"
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "updatedAt"
    }
  };
  const options = {
    tableName: "tb_entity_has_mailing",
    comment: "",
    timestamps: true,
    indexes: [{
      name: "tb_mailing_id",
      unique: false,
      type: "BTREE",
      fields: ["tb_mailing_id"]
    }, {
      name: "tb_mailing_group_id",
      unique: false,
      type: "BTREE",
      fields: ["tb_mailing_group_id"]
    }]
  };
  const EntityHasMailingModel = sequelize.define("tb_entity_has_mailing_model", attributes, options);
  return EntityHasMailingModel;
};