require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(express.json());

app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API Gestion des Commandes !');
});

sequelize.sync().then(() => {
  console.log('📦 Base de données synchronisée !');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});