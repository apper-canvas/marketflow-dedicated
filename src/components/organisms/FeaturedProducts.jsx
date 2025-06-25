import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import ProductCard from '@/components/molecules/ProductCard';
import Button from '@/components/atoms/Button';
import productService from '@/services/api/productService';

const FeaturedProducts = ({ title = "Featured Products", className = '' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getFeatured();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load featured products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={`py-8 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-surface-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-surface-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface-200 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`py-8 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load products</h3>
            <p className="text-surface-600 mb-4">{error}</p>
            <Button onClick={loadFeaturedProducts}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className={`py-8 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <ApperIcon name="Package" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">No featured products available</h3>
            <p className="text-surface-600">Check back later for featured products.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-8 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-surface-900">{title}</h2>
          <Link to="/search">
            <Button variant="outline" size="sm">
              See All
              <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {products.map((product, index) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;