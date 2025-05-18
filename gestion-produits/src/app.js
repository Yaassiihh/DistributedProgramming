require("dotenv").config();
const express = require("express");
const sequelize = require("./config/database");

const app = express();
app.use(express.json());

const productRoutes = require("./routes/productRoutes");
app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Gestion des Produits !");
});

require("./models/product");

sequelize.sync().then(() => {
  console.log("Base de données synchronisée !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});