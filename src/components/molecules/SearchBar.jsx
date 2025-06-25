import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const SearchBar = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const popularSearches = [
    'iPhone 15',
    'Wireless headphones',
    'Smart TV',
    'Instant Pot',
    'Nintendo Switch',
    'Running shoes',
    'Coffee maker',
    'Bluetooth speaker'
  ];

  const recentSearches = [
    'Samsung TV',
    'Apple AirPods',
    'Yoga mat'
  ];

  useEffect(() => {
    if (query.length > 1) {
      const filtered = popularSearches.filter(search =>
        search.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsActive(false);
      setQuery('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsActive(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`relative flex-1 max-w-2xl ${className}`}>
      <div className="relative flex">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsActive(true)}
            onBlur={() => setTimeout(() => setIsActive(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="Search MarketFlow"
            className="w-full pl-4 pr-12 py-2.5 text-surface-900 bg-white border-2 border-primary/20 rounded-l-md focus:outline-none focus:border-primary transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <Button
          onClick={() => handleSearch()}
          className="px-4 py-2.5 bg-primary hover:bg-accent text-white rounded-r-md rounded-l-none border-2 border-l-0 border-primary"
        >
          <ApperIcon name="Search" className="w-5 h-5" />
        </Button>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white border border-surface-200 rounded-b-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-surface-500 px-3 py-2 uppercase tracking-wide">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 text-surface-700 hover:bg-surface-50 rounded flex items-center"
                  >
                    <ApperIcon name="Search" className="w-4 h-4 mr-3 text-surface-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {query.length === 0 && (
              <>
                {recentSearches.length > 0 && (
                  <div className="p-2 border-b border-surface-100">
                    <div className="text-xs font-medium text-surface-500 px-3 py-2 uppercase tracking-wide">
                      Recent Searches
                    </div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="w-full text-left px-3 py-2 text-surface-700 hover:bg-surface-50 rounded flex items-center"
                      >
                        <ApperIcon name="Clock" className="w-4 h-4 mr-3 text-surface-400" />
                        {search}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="p-2">
                  <div className="text-xs font-medium text-surface-500 px-3 py-2 uppercase tracking-wide">
                    Popular Searches
                  </div>
                  {popularSearches.slice(0, 5).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-3 py-2 text-surface-700 hover:bg-surface-50 rounded flex items-center"
                    >
                      <ApperIcon name="TrendingUp" className="w-4 h-4 mr-3 text-surface-400" />
                      {search}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;