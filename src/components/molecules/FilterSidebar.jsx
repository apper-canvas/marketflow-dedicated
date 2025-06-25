import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const FilterSidebar = ({ filters, onFilterChange, className = '' }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
    prime: true
  });

  const categories = [
    'Electronics',
    'Home & Kitchen',
    'Fashion',
    'Books',
    'Sports & Outdoors',
    'Video Games',
    'Health & Personal Care',
    'Beauty & Personal Care'
  ];

  const priceRanges = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 to $50', min: 25, max: 50 },
    { label: '$50 to $100', min: 50, max: 100 },
    { label: '$100 to $200', min: 100, max: 200 },
    { label: '$200 & Above', min: 200, max: 9999 }
  ];

  const ratings = [4, 3, 2, 1];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? '' : category
    });
  };

  const handlePriceRangeChange = (range) => {
    const isSelected = filters.minPrice === range.min && filters.maxPrice === range.max;
    onFilterChange({
      ...filters,
      minPrice: isSelected ? undefined : range.min,
      maxPrice: isSelected ? undefined : range.max
    });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({
      ...filters,
      minRating: filters.minRating === rating ? undefined : rating
    });
  };

  const handlePrimeToggle = () => {
    onFilterChange({
      ...filters,
      primeOnly: !filters.primeOnly
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      primeOnly: false
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
    if (filters.minRating) count++;
    if (filters.primeOnly) count++;
    return count;
  };

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-surface-200 pb-4 mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-medium text-surface-900 hover:text-surface-700"
      >
        {title}
        <ApperIcon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          className="w-4 h-4" 
        />
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 space-y-2 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`bg-white p-4 rounded-lg border border-surface-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-surface-900 flex items-center">
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="primary" size="xs" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Prime Filter */}
      <FilterSection
        title="Prime Delivery"
        isExpanded={expandedSections.prime}
        onToggle={() => toggleSection('prime')}
      >
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.primeOnly}
            onChange={handlePrimeToggle}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center mr-3 transition-colors ${
            filters.primeOnly 
              ? 'bg-primary border-primary' 
              : 'border-surface-300 hover:border-primary'
          }`}>
            {filters.primeOnly && (
              <ApperIcon name="Check" className="w-3 h-3 text-white" />
            )}
          </div>
          <div className="flex items-center">
            <ApperIcon name="Zap" className="w-4 h-4 text-secondary mr-1" />
            <span className="text-sm">Prime FREE delivery</span>
          </div>
        </label>
      </FilterSection>

      {/* Category Filter */}
      <FilterSection
        title="Category"
        isExpanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
      >
        {categories.map((category) => (
          <label key={category} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={filters.category === category}
              onChange={() => handleCategoryChange(category)}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${
              filters.category === category 
                ? 'bg-primary border-primary' 
                : 'border-surface-300 hover:border-primary'
            }`}>
              {filters.category === category && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <span className="text-sm text-surface-700">{category}</span>
          </label>
        ))}
      </FilterSection>

      {/* Price Filter */}
      <FilterSection
        title="Price"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        {priceRanges.map((range, index) => {
          const isSelected = filters.minPrice === range.min && filters.maxPrice === range.max;
          return (
            <label key={index} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={isSelected}
                onChange={() => handlePriceRangeChange(range)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${
                isSelected 
                  ? 'bg-primary border-primary' 
                  : 'border-surface-300 hover:border-primary'
              }`}>
                {isSelected && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className="text-sm text-surface-700">{range.label}</span>
            </label>
          );
        })}
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection
        title="Customer Reviews"
        isExpanded={expandedSections.rating}
        onToggle={() => toggleSection('rating')}
      >
        {ratings.map((rating) => (
          <label key={rating} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={filters.minRating === rating}
              onChange={() => handleRatingChange(rating)}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${
              filters.minRating === rating 
                ? 'bg-primary border-primary' 
                : 'border-surface-300 hover:border-primary'
            }`}>
              {filters.minRating === rating && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <ApperIcon
                    key={i}
                    name="Star"
                    className={`w-3 h-3 ${
                      i < rating ? 'text-yellow-400 fill-current' : 'text-surface-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-surface-700 ml-2">& Up</span>
            </div>
          </label>
        ))}
      </FilterSection>
    </div>
  );
};

export default FilterSidebar;