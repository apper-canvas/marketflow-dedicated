import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import customerServiceService from '@/services/api/customerServiceService';

const CustomerService = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: ''
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await customerServiceService.getAll();
      setTickets(data);
    } catch (error) {
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      await customerServiceService.create(newTicket);
      toast.success('Support ticket created successfully');
      setNewTicket({ subject: '', category: 'general', priority: 'medium', description: '' });
      setShowCreateForm(false);
      loadTickets();
    } catch (error) {
      toast.error('Failed to create support ticket');
    }
  };

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'order', label: 'Order Issue' },
    { value: 'shipping', label: 'Shipping Problem' },
    { value: 'refund', label: 'Refund Request' },
    { value: 'technical', label: 'Technical Support' }
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
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
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Customer Service</h1>
        <p className="text-surface-600">Get help with your orders and account</p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Create Support Ticket</span>
        </button>
      </div>

      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-surface-900 mb-4">Create Support Ticket</h2>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Subject</label>
              <input
                type="text"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="w-full border border-surface-300 rounded px-3 py-2"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Category</label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                  className="w-full border border-surface-300 rounded px-3 py-2"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Priority</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  className="w-full border border-surface-300 rounded px-3 py-2"
                >
                  {priorities.map(pri => (
                    <option key={pri.value} value={pri.value}>{pri.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
              <textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                className="w-full border border-surface-300 rounded px-3 py-2 h-24"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
              >
                Create Ticket
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

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.Id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-surface-900">{ticket.subject}</h3>
                <p className="text-sm text-surface-600">Ticket #{ticket.Id}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-surface-100 text-surface-800'
              }`}>
                {ticket.status}
              </span>
            </div>
            <p className="text-surface-700 mb-3">{ticket.description}</p>
            <div className="flex items-center justify-between text-sm text-surface-500">
              <span>Category: {ticket.category}</span>
              <span>Created: {ticket.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerService;