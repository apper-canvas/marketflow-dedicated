import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import sellService from '@/services/api/sellService';

const Sell = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price: '',
    category: 'electronics',
    condition: 'new',
    images: []
  });

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const data = await sellService.getAll();
      setListings(data);
    } catch (error) {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      await sellService.create(newListing);
      toast.success('Listing created successfully');
      setNewListing({
        title: '',
        description: '',
        price: '',
        category: 'electronics',
        condition: 'new',
        images: []
      });
      setShowCreateForm(false);
      loadListings();
    } catch (error) {
      toast.error('Failed to create listing');
    }
  };

  const handleDeleteListing = async (id) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        await sellService.delete(id);
        toast.success('Listing deleted successfully');
        loadListings();
      } catch (error) {
        toast.error('Failed to delete listing');
      }
    }
  };

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing & Accessories' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'books', label: 'Books & Media' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'other', label: 'Other' }
  ];

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Sell on MarketFlow</h1>
        <p className="text-surface-600">List your items and reach millions of buyers</p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Create Listing</span>
        </button>
      </div>

      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-surface-900 mb-4">Create New Listing</h2>
          <form onSubmit={handleCreateListing} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Title</label>
              <input
                type="text"
                value={newListing.title}
                onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                className="w-full border border-surface-300 rounded px-3 py-2"
                placeholder="What are you selling?"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  value={newListing.price}
                  onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                  className="w-full border border-surface-300 rounded px-3 py-2"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Category</label>
                <select
                  value={newListing.category}
                  onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                  className="w-full border border-surface-300 rounded px-3 py-2"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Condition</label>
                <select
                  value={newListing.condition}
                  onChange={(e) => setNewListing({ ...newListing, condition: e.target.value })}
                  className="w-full border border-surface-300 rounded px-3 py-2"
                >
                  {conditions.map(cond => (
                    <option key={cond.value} value={cond.value}>{cond.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
              <textarea
                value={newListing.description}
                onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                className="w-full border border-surface-300 rounded px-3 py-2 h-24"
                placeholder="Describe your item in detail..."
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
              >
                Create Listing
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-surface-200 text-surface-700 px-4 py-2 rounded hover:bg-surface-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <motion.div
            key={listing.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 bg-surface-100">
              <img
                src={listing.image || '/api/placeholder/300/200'}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleDeleteListing(listing.Id)}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-surface-900 mb-2 line-clamp-2">{listing.title}</h3>
              <p className="text-surface-600 text-sm mb-3 line-clamp-2">{listing.description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-primary">${listing.price}</span>
                <span className="text-sm bg-surface-100 text-surface-700 px-2 py-1 rounded">
                  {listing.condition}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-surface-500">
                <span>{listing.category}</span>
                <span className={`px-2 py-1 rounded ${
                  listing.status === 'active' ? 'bg-green-100 text-green-800' :
                  listing.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                  'bg-surface-100 text-surface-800'
                }`}>
                  {listing.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Sell;