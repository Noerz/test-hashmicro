const BaseModel = require('./BaseModel');

/**
 * ProductModel - Extends BaseModel with product-specific math operations
 * Demonstrates: Mathematics (price calculation), nested loops (stats), nested if (stock logic)
 */
class ProductModel extends BaseModel {
  constructor() {
    super('products');
  }

  // Get product with calculated fields (Mathematics)
  getWithCalculations(id) {
    const product = this.findById(id);
    if (!product) return null;
    return this._applyCalculations(product);
  }

  // Apply discount and tax math to a product
  _applyCalculations(product) {
    const TAX_RATE = 0.11; // PPN 11%
    const discountAmount = (product.price * product.discount) / 100;
    const priceAfterDiscount = product.price - discountAmount;
    const taxAmount = priceAfterDiscount * TAX_RATE;
    const finalPrice = priceAfterDiscount + taxAmount;

    return {
      ...product,
      discount_amount: Math.round(discountAmount),
      price_after_discount: Math.round(priceAfterDiscount),
      tax_amount: Math.round(taxAmount),
      final_price: Math.round(finalPrice),
      stock_status: this._getStockStatus(product.stock)
    };
  }

  // Nested if for stock status logic
  _getStockStatus(stock) {
    if (stock <= 0) {
      return { label: 'Out of Stock', color: 'danger' };
    } else if (stock <= 5) {
      if (stock <= 2) {
        return { label: 'Critical Stock', color: 'danger' };
      } else {
        return { label: 'Low Stock', color: 'warning' };
      }
    } else if (stock <= 20) {
      return { label: 'Available', color: 'success' };
    } else {
      return { label: 'In Stock', color: 'success' };
    }
  }

  // Get all products with calculations + category join
  getAllWithDetails() {
    const CategoryModel = require('./CategoryModel');
    const products = this.findAll();
    const result = [];

    // Nested loop: for each product, find matching category
    for (let i = 0; i < products.length; i++) {
      const product = this._applyCalculations(products[i]);
      const categories = CategoryModel.findAll();
      for (let j = 0; j < categories.length; j++) {
        if (categories[j].id === product.category_id) {
          product.category_name = categories[j].name;
          break;
        }
      }
      if (!product.category_name) product.category_name = 'Uncategorized';
      result.push(product);
    }
    return result;
  }

  // Math: get inventory statistics using nested loops
  getStats() {
    const products = this.findAll();
    let totalValue = 0;
    let totalStock = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let maxPrice = 0;
    let minPrice = Infinity;

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      // Nested if inside loop
      if (p.stock <= 0) {
        outOfStockCount++;
      } else if (p.stock <= 5) {
        lowStockCount++;
      }

      totalStock += p.stock;
      const discounted = p.price * (1 - p.discount / 100);

      if (discounted > maxPrice) maxPrice = discounted;
      if (discounted < minPrice) minPrice = discounted;

      totalValue += discounted * p.stock;
    }

    return {
      total_products: products.length,
      total_stock: totalStock,
      total_inventory_value: Math.round(totalValue),
      avg_stock: products.length > 0 ? Math.round(totalStock / products.length) : 0,
      low_stock_count: lowStockCount,
      out_of_stock_count: outOfStockCount,
      max_price: maxPrice === 0 ? 0 : Math.round(maxPrice),
      min_price: minPrice === Infinity ? 0 : Math.round(minPrice)
    };
  }

  // Search products
  search(keyword) {
    const kw = keyword.toLowerCase();
    return this.findAll().filter(p =>
      p.name.toLowerCase().includes(kw) ||
      (p.description && p.description.toLowerCase().includes(kw))
    );
  }
}

module.exports = new ProductModel();
