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
      autoIncrement: true,
      comment: null,
      field: "id"
    },
    name_company: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "name_company"
    },
    nick_trade: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "nick_trade"
    },
    aniversary: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "aniversary"
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
    },
    tb_linebusiness_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tb_linebusiness_id"
    },
    note: {
      type: DataTypes.BLOB,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "note"
    }
  };
  const options = {
    tableName: "tb_entity",
    comment: "",
    timestamps: true,
    indexes: []
  };
  const EntityModel = sequelize.define("tb_entity_model", attributes, options);
  return EntityModel;
};