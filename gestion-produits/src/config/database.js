require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("✅ Connexion à PostgreSQL réussie !"))
  .catch((err) => console.error("❌ Erreur de connexion à la DB :", err));

module.exports = sequelize;