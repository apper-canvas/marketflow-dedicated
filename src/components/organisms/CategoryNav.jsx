import { useState } from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const CategoryNav = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const categories = [
    {
      id: 'departments',
      label: 'All Departments',
      icon: 'Menu',
      subcategories: [
        { label: 'Electronics', path: '/search?category=Electronics' },
        { label: 'Home & Kitchen', path: '/search?category=Home%20%26%20Kitchen' },
        { label: 'Fashion', path: '/search?category=Fashion' },
        { label: 'Books', path: '/search?category=Books' },
        { label: 'Sports & Outdoors', path: '/search?category=Sports%20%26%20Outdoors' },
        { label: 'Video Games', path: '/search?category=Video%20Games' }
      ]
    }
  ];

  const quickLinks = [
    { label: 'Today\'s Deals', path: '/deals', icon: 'Percent' },
    { label: 'Customer Service', path: '/help', icon: 'HelpCircle' },
    { label: 'Registry', path: '/registry', icon: 'Gift' },
    { label: 'Gift Cards', path: '/gift-cards', icon: 'CreditCard' },
    { label: 'Sell', path: '/sell', icon: 'Store' }
  ];

  return (
    <nav className="bg-surface-700 text-white border-b border-surface-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-10 space-x-6 overflow-x-auto scrollbar-hide">
          {/* All Departments Dropdown */}
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => setActiveDropdown(category.id)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 py-2 px-3 text-sm hover:bg-surface-600 rounded transition-colors whitespace-nowrap">
                <ApperIcon name={category.icon} className="w-4 h-4" />
                <span>{category.label}</span>
                <ApperIcon name="ChevronDown" className="w-3 h-3" />
              </button>

              {activeDropdown === category.id && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-surface-200 rounded-lg shadow-lg py-2 z-50">
                  {category.subcategories.map((sub, index) => (
                    <Link
                      key={index}
                      to={sub.path}
                      className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 transition-colors"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Quick Links */}
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="flex items-center space-x-1 py-2 px-3 text-sm hover:bg-surface-600 rounded transition-colors whitespace-nowrap"
            >
              <ApperIcon name={link.icon} className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;