import mockProducts from '../mockData/product.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProductService {
  async getAll() {
    await delay(300);
    return [...mockProducts];
  }

  async getById(id) {
    await delay(200);
    const product = mockProducts.find(p => p.Id === parseInt(id, 10));
    if (!product) {
      throw new Error('Product not found');
    }
    return { ...product };
  }

  async getByCategory(category) {
    await delay(300);
    return mockProducts.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    ).map(p => ({ ...p }));
  }

  async search(query, filters = {}) {
    await delay(400);
    let results = [...mockProducts];

    // Text search
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.category) {
      results = results.filter(p => 
        p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Price range filter
    if (filters.minPrice !== undefined) {
      results = results.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(p => p.price <= filters.maxPrice);
    }

    // Rating filter
    if (filters.minRating) {
      results = results.filter(p => p.rating >= filters.minRating);
    }

    // Prime filter
    if (filters.primeOnly) {
      results = results.filter(p => p.isPrime);
    }

    // Sort results
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'reviews':
          results.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        default:
          // Relevance (default order)
          break;
      }
    }

    return results;
  }

  async getFeatured() {
    await delay(250);
    return mockProducts
      .filter(p => p.rating >= 4.5)
      .slice(0, 6)
      .map(p => ({ ...p }));
  }

  async getDeals() {
    await delay(250);
    return mockProducts
      .filter(p => p.originalPrice > p.price)
      .slice(0, 8)
      .map(p => ({ ...p }));
  }

  async getRecommended(productId) {
    await delay(300);
    const currentProduct = mockProducts.find(p => p.Id === parseInt(productId, 10));
    if (!currentProduct) return [];

    return mockProducts
      .filter(p => 
        p.Id !== parseInt(productId, 10) && 
        p.category === currentProduct.category
      )
      .slice(0, 4)
      .map(p => ({ ...p }));
  }
}

export default new ProductService();