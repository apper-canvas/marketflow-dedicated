import mockCartItems from '../mockData/cartItem.json';
import productService from './productService.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let cartItems = [...mockCartItems];

class CartService {
  async getAll() {
    await delay(200);
    const itemsWithProducts = [];
    
    for (const item of cartItems) {
      try {
        const product = await productService.getById(item.productId);
        itemsWithProducts.push({
          ...item,
          product
        });
      } catch (error) {
        console.warn(`Product ${item.productId} not found for cart item`);
      }
    }
    
    return itemsWithProducts;
  }

  async addItem(productId, quantity = 1) {
    await delay(150);
    
    const existingItem = cartItems.find(item => 
      item.productId === parseInt(productId, 10) && !item.savedForLater
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newId = Math.max(...cartItems.map(item => item.Id), 0) + 1;
      cartItems.push({
        Id: newId,
        productId: parseInt(productId, 10),
        quantity,
        savedForLater: false,
        addedDate: new Date().toISOString()
      });
    }

    return { success: true };
  }

  async updateQuantity(itemId, quantity) {
    await delay(100);
    
    const item = cartItems.find(item => item.Id === parseInt(itemId, 10));
    if (!item) {
      throw new Error('Cart item not found');
    }

    if (quantity <= 0) {
      return this.removeItem(itemId);
    }

    item.quantity = quantity;
    return { success: true };
  }

  async removeItem(itemId) {
    await delay(100);
    
    const index = cartItems.findIndex(item => item.Id === parseInt(itemId, 10));
    if (index === -1) {
      throw new Error('Cart item not found');
    }

    cartItems.splice(index, 1);
    return { success: true };
  }

  async saveForLater(itemId) {
    await delay(100);
    
    const item = cartItems.find(item => item.Id === parseInt(itemId, 10));
    if (!item) {
      throw new Error('Cart item not found');
    }

    item.savedForLater = true;
    return { success: true };
  }

  async moveToCart(itemId) {
    await delay(100);
    
    const item = cartItems.find(item => item.Id === parseInt(itemId, 10));
    if (!item) {
      throw new Error('Cart item not found');
    }

    item.savedForLater = false;
    return { success: true };
  }

  async getSavedItems() {
    await delay(200);
    const savedItems = cartItems.filter(item => item.savedForLater);
    const itemsWithProducts = [];
    
    for (const item of savedItems) {
      try {
        const product = await productService.getById(item.productId);
        itemsWithProducts.push({
          ...item,
          product
        });
      } catch (error) {
        console.warn(`Product ${item.productId} not found for saved item`);
      }
    }
    
    return itemsWithProducts;
  }

  async getCartSummary() {
    await delay(100);
    const activeItems = cartItems.filter(item => !item.savedForLater);
    let subtotal = 0;
    let itemCount = 0;

    for (const item of activeItems) {
      try {
        const product = await productService.getById(item.productId);
        subtotal += product.price * item.quantity;
        itemCount += item.quantity;
      } catch (error) {
        console.warn(`Product ${item.productId} not found for cart summary`);
      }
    }

    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal >= 25 ? 0 : 5.99; // Free shipping over $25
    const total = subtotal + tax + shipping;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      itemCount
    };
  }

  async clearCart() {
    await delay(100);
    cartItems = cartItems.filter(item => item.savedForLater);
    return { success: true };
  }
}

export default new CartService();