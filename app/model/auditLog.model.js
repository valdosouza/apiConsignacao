const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    id: {
      type: DataTypes.STRING(32),
      defaultValue: DataTypes.UUIDV4,      
      allowNull: false,      
      primaryKey: true,
      comment: null,
      field: "id"
    },
    tb_institution_id: {
      type: DataTypes.INTEGER(11),      
      allowNull: false,      
      primaryKey: true,
      comment: null,
      field: "tb_institution_id"
    },

    tb_user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tb_user_id"
    },
    kind: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "kind"
    },
    table_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "table_name"
    },
    record_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "record_id"
    },
    result: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "result"
    },
    kind: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "",
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "kind"
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
    tableName: "tb_audit_log",
    comment: "",
    timestamps: true,
    indexes: []
  };
  const AuditLogModel = sequelize.define("tb_audit_log_model", attributes, options);
  return AuditLogModel;
};