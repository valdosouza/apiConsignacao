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
    used: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "used"
    }
  };
  const options = {
    tableName: "tb_entity_seq",
    comment: "",
    indexes: []
  };
  const EntitySeqModel = sequelize.define("tb_entity_seq_model", attributes, options);
  return EntitySeqModel;
};