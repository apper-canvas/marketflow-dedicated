import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center">
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <ApperIcon name="SearchX" className="w-24 h-24 text-surface-300 mx-auto mb-4" />
            <h1 className="text-6xl font-bold text-surface-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-surface-700 mb-2">
              Page Not Found
            </h2>
            <p className="text-surface-600 max-w-md mx-auto">
              Sorry, we couldn't find the page you're looking for. 
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg">
                <ApperIcon name="Home" className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </Link>
            
            <Link to="/search">
              <Button variant="outline" size="lg">
                <ApperIcon name="Search" className="w-5 h-5 mr-2" />
                Search Products
              </Button>
            </Link>
          </div>

          <div className="mt-12">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">
              Popular Categories
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { name: 'Electronics', path: '/search?category=Electronics' },
                { name: 'Home & Kitchen', path: '/search?category=Home%20%26%20Kitchen' },
                { name: 'Fashion', path: '/search?category=Fashion' },
                { name: 'Books', path: '/search?category=Books' }
              ].map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="px-4 py-2 bg-white border border-surface-200 rounded-lg hover:border-primary hover:text-primary transition-colors text-sm"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;