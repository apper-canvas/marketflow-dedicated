import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import todaysDealsService from '@/services/api/todaysDealsService';

const TodaysDeal = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const data = await todaysDealsService.getAll();
      setDeals(data);
    } catch (err) {
      setError('Failed to load today\'s deals');
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-surface-900 mb-2">Error Loading Deals</h2>
          <p className="text-surface-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Today's Deals</h1>
        <p className="text-surface-600">Limited time offers and special discounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <motion.div
            key={deal.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-surface-200 hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                {deal.discount}% OFF
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-surface-900 mb-2">{deal.title}</h3>
              <p className="text-surface-600 text-sm mb-3">{deal.description}</p>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-primary">${deal.salePrice}</span>
                  <span className="text-sm text-surface-500 line-through">${deal.originalPrice}</span>
                </div>
                <span className="text-sm text-red-600 font-medium">
                  Ends in {deal.timeLeft}
                </span>
              </div>
              <button className="w-full bg-primary text-white py-2 rounded hover:bg-primary-600 transition-colors">
                Shop Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TodaysDeal;