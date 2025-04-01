const stockService = require('../services/stocks.service');

module.exports = {
  getAll: (req, res, next) => {
    try {
      const stockItems = stockService.getAllStockItems();
      res.json(stockItems);
    } catch (err) {
      next(err);
    }
  },
  create: (req, res, next) => {
    try {
      const newItem = stockService.createStockItem(req.body);
      res.status(201).json(newItem);
    } catch (err) {
      next(err);
    }
  }
};