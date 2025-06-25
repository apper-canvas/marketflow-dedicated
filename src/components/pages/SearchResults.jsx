import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProductCard from '@/components/molecules/ProductCard';
import FilterSidebar from '@/components/molecules/FilterSidebar';
import Button from '@/components/atoms/Button';
import productService from '@/services/api/productService';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  const [filters, setFilters] = useState({
    category: category,
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    primeOnly: false,
    sortBy: 'relevance'
  });

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'reviews', label: 'Most Reviewed' }
  ];

  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    setFilters(prev => ({
      ...prev,
      category: params.category || '',
      minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
      minRating: params.minRating ? parseFloat(params.minRating) : undefined,
      primeOnly: params.primeOnly === 'true',
      sortBy: params.sortBy || 'relevance'
    }));
  }, [searchParams]);

  useEffect(() => {
    searchProducts();
  }, [query, filters]);

  const searchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const searchFilters = { ...filters };
      // Clean up undefined values
      Object.keys(searchFilters).forEach(key => {
        if (searchFilters[key] === undefined || searchFilters[key] === '') {
          delete searchFilters[key];
        }
      });

      const results = await productService.search(query, searchFilters);
      setProducts(results);
    } catch (err) {
      setError(err.message || 'Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== false) {
        params.set(key, value.toString());
      }
    });
    
    setSearchParams(params);
  };

  const handleSortChange = (sortBy) => {
    handleFilterChange({ ...filters, sortBy });
  };

  const getResultsText = () => {
    if (loading) return 'Searching...';
    if (products.length === 0) return 'No results found';
    
    const resultsText = `${products.length.toLocaleString()} result${products.length !== 1 ? 's' : ''}`;
    
    if (query && category) {
      return `${resultsText} for "${query}" in ${category}`;
    } else if (query) {
      return `${resultsText} for "${query}"`;
    } else if (category) {
      return `${resultsText} in ${category}`;
    }
    
    return resultsText;
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-surface-900 mb-2">
            {getResultsText()}
          </h1>
          
          {/* Sort and Filter Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
                Filters
              </Button>
              
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-surface-600">Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="text-sm border border-surface-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <ApperIcon name="Grid3X3" className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ApperIcon name="List" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-6">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border border-surface-200 h-80 animate-pulse">
                    <div className="aspect-square bg-surface-200 rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                      <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                      <div className="h-6 bg-surface-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">Search failed</h3>
                <p className="text-surface-600 mb-4">{error}</p>
                <Button onClick={searchProducts}>
                  Try Again
                </Button>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="text-center py-12">
                <ApperIcon name="Search" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">No products found</h3>
                <p className="text-surface-600 mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button onClick={() => handleFilterChange({
                  category: '',
                  minPrice: undefined,
                  maxPrice: undefined,
                  minRating: undefined,
                  primeOnly: false,
                  sortBy: 'relevance'
                })}>
                  Clear Filters
                </Button>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product, index) => (
                  <motion.div
                    key={product.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;