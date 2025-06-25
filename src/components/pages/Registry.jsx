import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import registryService from '@/services/api/registryService';

const Registry = () => {
  const [registries, setRegistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRegistry, setNewRegistry] = useState({
    name: '',
    type: 'wedding',
    eventDate: '',
    description: ''
  });

  useEffect(() => {
    loadRegistries();
  }, []);

  const loadRegistries = async () => {
    try {
      setLoading(true);
      const data = await registryService.getAll();
      setRegistries(data);
    } catch (error) {
      toast.error('Failed to load registries');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRegistry = async (e) => {
    e.preventDefault();
    try {
      await registryService.create(newRegistry);
      toast.success('Registry created successfully');
      setNewRegistry({ name: '', type: 'wedding', eventDate: '', description: '' });
      setShowCreateForm(false);
      loadRegistries();
    } catch (error) {
      toast.error('Failed to create registry');
    }
  };

  const registryTypes = [
    { value: 'wedding', label: 'Wedding', icon: 'Heart' },
    { value: 'baby', label: 'Baby Shower', icon: 'Baby' },
    { value: 'birthday', label: 'Birthday', icon: 'Gift' },
    { value: 'anniversary', label: 'Anniversary', icon: 'Calendar' },
    { value: 'holiday', label: 'Holiday', icon: 'Star' }
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
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Gift Registries</h1>
        <p className="text-surface-600">Create and manage your gift registries</p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Create Registry</span>
        </button>
      </div>

      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-surface-900 mb-4">Create New Registry</h2>
          <form onSubmit={handleCreateRegistry} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Registry Name</label>
              <input
                type="text"
                value={newRegistry.name}
                onChange={(e) => setNewRegistry({ ...newRegistry, name: e.target.value })}
                className="w-full border border-surface-300 rounded px-3 py-2"
                placeholder="e.g., John & Jane's Wedding"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Registry Type</label>
                <select
                  value={newRegistry.type}
                  onChange={(e) => setNewRegistry({ ...newRegistry, type: e.target.value })}
                  className="w-full border border-surface-300 rounded px-3 py-2"
                >
                  {registryTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Event Date</label>
                <input
                  type="date"
                  value={newRegistry.eventDate}
                  onChange={(e) => setNewRegistry({ ...newRegistry, eventDate: e.target.value })}
                  className="w-full border border-surface-300 rounded px-3 py-2"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
              <textarea
                value={newRegistry.description}
                onChange={(e) => setNewRegistry({ ...newRegistry, description: e.target.value })}
                className="w-full border border-surface-300 rounded px-3 py-2 h-20"
                placeholder="Tell guests about your special event..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
              >
                Create Registry
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
        {registries.map((registry) => {
          const registryType = registryTypes.find(t => t.value === registry.type);
          return (
            <motion.div
              key={registry.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary-100 p-2 rounded">
                  <ApperIcon name={registryType?.icon || 'Gift'} className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-surface-900">{registry.name}</h3>
                  <p className="text-sm text-surface-600">{registryType?.label}</p>
                </div>
              </div>
              <p className="text-surface-700 mb-3">{registry.description}</p>
              <div className="flex items-center justify-between text-sm text-surface-500 mb-4">
                <span>Event: {registry.eventDate}</span>
                <span>{registry.itemCount} items</span>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-primary text-white py-2 rounded text-sm hover:bg-primary-600 transition-colors">
                  View Registry
                </button>
                <button className="bg-surface-200 text-surface-700 px-3 py-2 rounded text-sm hover:bg-surface-300 transition-colors">
                  <ApperIcon name="Share" className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Registry;