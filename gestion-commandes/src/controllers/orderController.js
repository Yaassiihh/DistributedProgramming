const Order = require('../models/order');

exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity, status } = req.body;
    const order = await Order.create({ productId, quantity, status });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la commande.' });
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