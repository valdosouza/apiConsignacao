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
    street: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "não informado",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "street"
    },
    nmbr: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "sn",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "nmbr"
    },
    complement: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "complement"
    },
    neighborhood: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "neighborhood"
    },
    region: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "region"
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
    zip_code: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "zip_code"
    },
    tb_country_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tb_country_id",
      references: {
        key: "id",
        model: "tb_country_model"
      }
    },
    tb_state_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tb_state_id",
      references: {
        key: "id",
        model: "tb_state_model"
      }
    },
    tb_city_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "tb_city_id",
      references: {
        key: "id",
        model: "tb_city_model"
      }
    },
    main: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "Y",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "main"
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
    tableName: "tb_address",
    comment: "",
    timestamps: true,
    indexes: [{
      name: "fk_country_to_address",
      unique: false,
      type: "BTREE",
      fields: ["tb_country_id"]
    }, {
      name: "fk_state_to_address",
      unique: false,
      type: "BTREE",
      fields: ["tb_state_id"]
    }, {
      name: "fk_city_to_address",
      unique: false,
      type: "BTREE",
      fields: ["tb_city_id"]
    }]
  };
  const AddressModel = sequelize.define("tb_address_model", attributes, options);
  return AddressModel;
};