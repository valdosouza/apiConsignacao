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
    description: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "description"
    },
    main: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'N',
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "main"
    },
    active: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'S',
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
    },
  };
  const options = {
    tableName: "tb_stock_list",
    comment: "",
    timestamps: true,
    indexes: []
  };
  const StockListModel = sequelize.define("tb_stock_list_model", attributes, options);
  return StockListModel;
};