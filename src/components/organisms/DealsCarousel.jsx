import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import ProductCard from '@/components/molecules/ProductCard';
import Button from '@/components/atoms/Button';
import productService from '@/services/api/productService';

const DealsCarousel = ({ className = '' }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4
  };

  useEffect(() => {
    loadDeals();
  }, []);

  useEffect(() => {
    if (deals.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => 
          prev + itemsPerPage.xl >= deals.length ? 0 : prev + itemsPerPage.xl
        );
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [deals]);

  const loadDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getDeals();
      setDeals(data);
    } catch (err) {
      setError(err.message || 'Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerPage.xl >= deals.length ? 0 : prev + itemsPerPage.xl
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, deals.length - itemsPerPage.xl) : prev - itemsPerPage.xl
    );
  };

  if (loading) {
    return (
      <section className={`py-8 bg-surface-50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-surface-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-surface-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface-200 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`py-8 bg-surface-50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load deals</h3>
            <p className="text-surface-600 mb-4">{error}</p>
            <Button onClick={loadDeals}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (deals.length === 0) {
    return (
      <section className={`py-8 bg-surface-50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <ApperIcon name="Percent" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">No deals available right now</h3>
            <p className="text-surface-600">Check back later for amazing deals.</p>
          </div>
        </div>
      </section>
    );
  }

  const maxIndex = Math.max(0, deals.length - itemsPerPage.xl);

  return (
    <section className={`py-8 bg-surface-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <ApperIcon name="Percent" className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-2xl font-bold text-surface-900">Today's Deals</h2>
          </div>
          <Link to="/deals">
            <Button variant="outline" size="sm">
              See All Deals
              <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          {deals.length > itemsPerPage.xl && (
            <>
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                <ApperIcon name="ChevronLeft" className="w-5 h-5" />
              </button>
              
              <button
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                <ApperIcon name="ChevronRight" className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Carousel Container */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {deals.slice(currentIndex, currentIndex + itemsPerPage.xl).map((product) => (
                  <ProductCard key={product.Id} product={product} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          {deals.length > itemsPerPage.xl && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: Math.ceil(deals.length / itemsPerPage.xl) }).map((_, index) => {
                const slideIndex = index * itemsPerPage.xl;
                const isActive = currentIndex === slideIndex;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(slideIndex)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      isActive ? 'bg-primary' : 'bg-surface-300'
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DealsCarousel;