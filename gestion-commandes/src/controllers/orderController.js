const Order = require('../models/order');
const axios = require("axios");

exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity, status } = req.body;

    const productResponse = await axios.get(`http://api-service:3000/products/${productId}`);
    console.log("Produit reçu :", productResponse.data); 
    const product = productResponse.data;

    if (!product) {
      return res.status(404).json({ error: "Produit introuvable." });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Stock insuffisant." });
    }

    const order = await Order.create({ productId, quantity, status });

    await axios.put(`http://api-service:3000/products/${productId}`, {
      ...product,
      stock: product.stock - quantity
    });

    res.status(201).json(order);
  } catch (error) {
  console.error("❌ Erreur lors de la création de la commande :", error);
  res.status(500).json({ error: error.message || "Erreur lors de la création de la commande." });
}
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes.' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée.' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la commande.' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { productId, quantity, status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée.' });
    }
    await order.update({ productId, quantity, status });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la commande.' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée.' });
    }
    await order.destroy();
    res.json({ message: 'Commande supprimée avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la commande.' });
  }
};