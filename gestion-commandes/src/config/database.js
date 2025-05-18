require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log('Connexion à PostgreSQL réussie !'))
  .catch((err) => console.error('Erreur de connexion à la base de données :', err));

module.exports = sequelize;