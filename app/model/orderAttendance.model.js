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
    tb_salesman_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "tb_salesman_id"
    },
    tb_customer_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tb_customer_id"
    },
    tb_price_list_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tb_price_list_id"
    },
    visited: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: "N",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "visited"
    },    
    charged: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: "N",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "charged"
    },
    recall: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: "N",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "recall"
    },
    finished: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: "N",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "finished"
    },
    latitude: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "latitude"
    },
    longitude: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "0",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "longitude"
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
    tableName: "tb_order_attendance",
    comment: "",
    timestamps: true,
    indexes: []
  };
  const TbOrderAttendanceModel = sequelize.define("tb_order_attendance_model", attributes, options);
  return TbOrderAttendanceModel;
};