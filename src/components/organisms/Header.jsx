import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import cartService from '@/services/api/cartService';

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCartCount();
  }, []);

  const loadCartCount = async () => {
    try {
      const summary = await cartService.getCartSummary();
      setCartCount(summary.itemCount);
    } catch (error) {
      console.error('Failed to load cart count:', error);
    }
  };

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      loadCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const accountMenuItems = [
    { label: 'Your Orders', path: '/orders', icon: 'Package2' },
    { label: 'Account Settings', path: '/account', icon: 'Settings' },
    { label: 'Customer Service', path: '/help', icon: 'HelpCircle' },
  ];

  return (
    <header className="bg-surface-800 text-white sticky top-0 z-40">
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded">
              <ApperIcon name="Store" className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">MarketFlow</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Account Menu */}
            <div className="relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-surface-700 transition-colors"
              >
                <ApperIcon name="User" className="w-5 h-5" />
                <span className="hidden sm:block text-sm">Account</span>
                <ApperIcon name="ChevronDown" className="w-4 h-4" />
              </button>

              {showAccountMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-surface-200 rounded-lg shadow-lg py-1 z-50">
                  {accountMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowAccountMenu(false)}
                      className="flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-50"
                    >
                      <ApperIcon name={item.icon} className="w-4 h-4 mr-3" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center space-x-1 px-2 py-1 rounded hover:bg-surface-700 transition-colors"
            >
              <div className="relative">
                <ApperIcon name="ShoppingCart" className="w-6 h-6" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </motion.span>
                )}
              </div>
              <span className="hidden sm:block text-sm">Cart</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Header;