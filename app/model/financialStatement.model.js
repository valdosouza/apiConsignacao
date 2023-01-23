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
        defaultValue: "0",
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "terminal"
      },
      tb_bank_account_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue: 0,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "tb_bank_account_id"
      },
      dt_record: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "dt_record"
      },
      tb_bank_historic_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue: 0,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "tb_bank_historic_id"
      },
      credit_value: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "credit_value"
      },
      debit_value: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "debit_value"
      },
      manual_history: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "manual_history"
      },
      kind: {
        type: DataTypes.STRING(1),
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "kind"
      },    
      settled_code: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "settled_code"
      },
      tb_user_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "tb_user_id"
      },
      future: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "future"
      },
      dt_original: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "dt_original"
      },
      doc_reference: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "doc_reference"
      },
      conferred: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "conferred"
      },
      tb_payment_types_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "tb_payment_types_id"
      },
      tb_financial_plans_id_cre: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: "0",
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "tb_financial_plans_id_cre"
      },
      tb_financial_plans_id_deb: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: "0",
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "tb_financial_plans_id_deb"
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
      tableName: "tb_financial_statement",
      comment: "",
      timestamps: true,
    };
    const TbFinancialStatementModel = sequelize.define("tb_financial_statement_model", attributes, options);
    return TbFinancialStatementModel;
  };