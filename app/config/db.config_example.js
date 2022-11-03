module.exports = {
  HOST: "127.0.0.1",   
  USER: "",
  PASSWORD: "",
  DB: "",
  dialect: "mysql",
  PORT: "3306",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};