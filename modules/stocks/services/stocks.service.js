const { stocks } = require('../tests/stocks.mock');

module.exports = {
  getAllStockItems: () => {
    return stocks;
  },
  createStockItem: (itemData) => {
    const newItem = {
      id: stocks.length + 1,
      ...itemData,
      last_updated: new Date()
    };
    stocks.push(newItem);
    return newItem;
  }
};