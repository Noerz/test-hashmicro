const BaseModel = require('./BaseModel');

/**
 * CategoryModel - Extends BaseModel for category management
 */
class CategoryModel extends BaseModel {
  constructor() {
    super('categories');
  }

  // Get category with product count (nested loop)
  getAllWithProductCount() {
    const ProductModel = require('./ProductModel');
    const categories = this.findAll();
    const products = ProductModel.findAll();
    const result = [];

    for (let i = 0; i < categories.length; i++) {
      let count = 0;
      let totalValue = 0;

      for (let j = 0; j < products.length; j++) {
        if (products[j].category_id === categories[i].id) {
          count++;
          totalValue += products[j].price * (1 - products[j].discount / 100);
        }
      }

      result.push({
        ...categories[i],
        product_count: count,
        total_value: Math.round(totalValue)
      });
    }
    return result;
  }

  // Check if category has products
  hasProducts(id) {
    const ProductModel = require('./ProductModel');
    const products = ProductModel.findAll({ category_id: parseInt(id) });
    return products.length > 0;
  }
}

module.exports = new CategoryModel();
