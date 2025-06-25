import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import giftCardService from '@/services/api/giftCardService';

const GiftCards = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('buy');
  const [newGiftCard, setNewGiftCard] = useState({
    amount: '',
    recipientEmail: '',
    recipientName: '',
    message: '',
    design: 'classic'
  });
  const [redeemCode, setRedeemCode] = useState('');

  useEffect(() => {
    loadGiftCards();
  }, []);

  const loadGiftCards = async () => {
    try {
      setLoading(true);
      const data = await giftCardService.getAll();
      setGiftCards(data);
    } catch (error) {
      toast.error('Failed to load gift cards');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseGiftCard = async (e) => {
    e.preventDefault();
    try {
      await giftCardService.create(newGiftCard);
      toast.success('Gift card purchased successfully');
      setNewGiftCard({
        amount: '',
        recipientEmail: '',
        recipientName: '',
        message: '',
        design: 'classic'
      });
      loadGiftCards();
    } catch (error) {
      toast.error('Failed to purchase gift card');
    }
  };

  const handleRedeemGiftCard = async (e) => {
    e.preventDefault();
    try {
      const result = await giftCardService.redeem(redeemCode);
      toast.success(`Gift card redeemed! $${result.amount} added to your account`);
      setRedeemCode('');
      loadGiftCards();
    } catch (error) {
      toast.error('Invalid gift card code');
    }
  };

  const giftCardDesigns = [
    { value: 'classic', label: 'Classic Blue', preview: 'bg-blue-500' },
    { value: 'festive', label: 'Festive Red', preview: 'bg-red-500' },
    { value: 'elegant', label: 'Elegant Gold', preview: 'bg-yellow-500' },
    { value: 'modern', label: 'Modern Purple', preview: 'bg-purple-500' }
  ];

  const predefinedAmounts = [25, 50, 100, 250, 500];

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
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Gift Cards</h1>
        <p className="text-surface-600">Purchase and redeem gift cards</p>
      </div>

      <div className="mb-6">
        <div className="border-b border-surface-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('buy')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'buy'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-surface-500 hover:text-surface-700'
              }`}
            >
              Buy Gift Cards
            </button>
            <button
              onClick={() => setActiveTab('redeem')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'redeem'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-surface-500 hover:text-surface-700'
              }`}
            >
              Redeem Gift Card
            </button>
            <button
              onClick={() => setActiveTab('my-cards')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-cards'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-surface-500 hover:text-surface-700'
              }`}
            >
              My Gift Cards
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'buy' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-surface-900 mb-6">Purchase Gift Card</h2>
          <form onSubmit={handlePurchaseGiftCard} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-3">Amount</label>
              <div className="grid grid-cols-5 gap-3 mb-3">
                {predefinedAmounts.map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setNewGiftCard({ ...newGiftCard, amount: amount.toString() })}
                    className={`py-2 px-3 border rounded text-sm font-medium ${
                      newGiftCard.amount === amount.toString()
                        ? 'border-primary bg-primary text-white'
                        : 'border-surface-300 text-surface-700 hover:border-primary'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={newGiftCard.amount}
                onChange={(e) => setNewGiftCard({ ...newGiftCard, amount: e.target.value })}
                placeholder="Custom amount"
                className="w-full border border-surface-300 rounded px-3 py-2"
                min="1"
                max="1000"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={newGiftCard.recipientName}
                  onChange={(e) => setNewGiftCard({ ...newGiftCard, recipientName: e.target.value })}
                  className="w-full border border-surface-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Recipient Email</label>
                <input
                  type="email"
                  value={newGiftCard.recipientEmail}
                  onChange={(e) => setNewGiftCard({ ...newGiftCard, recipientEmail: e.target.value })}
                  className="w-full border border-surface-300 rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-3">Design</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {giftCardDesigns.map(design => (
                  <button
                    key={design.value}
                    type="button"
                    onClick={() => setNewGiftCard({ ...newGiftCard, design: design.value })}
                    className={`p-3 border rounded-lg text-center ${
                      newGiftCard.design === design.value
                        ? 'border-primary bg-primary-50'
                        : 'border-surface-300 hover:border-primary'
                    }`}
                  >
                    <div className={`w-full h-16 ${design.preview} rounded mb-2`}></div>
                    <span className="text-sm font-medium">{design.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Personal Message</label>
              <textarea
                value={newGiftCard.message}
                onChange={(e) => setNewGiftCard({ ...newGiftCard, message: e.target.value })}
                className="w-full border border-surface-300 rounded px-3 py-2 h-20"
                placeholder="Add a personal message..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded font-medium hover:bg-primary-600 transition-colors"
            >
              Purchase Gift Card
            </button>
          </form>
        </motion.div>
      )}

      {activeTab === 'redeem' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-surface-900 mb-6">Redeem Gift Card</h2>
          <form onSubmit={handleRedeemGiftCard} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Gift Card Code</label>
              <input
                type="text"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value)}
                className="w-full border border-surface-300 rounded px-3 py-2"
                placeholder="Enter your gift card code"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded font-medium hover:bg-primary-600 transition-colors"
            >
              Redeem Gift Card
            </button>
          </form>
        </motion.div>
      )}

      {activeTab === 'my-cards' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {giftCards.map((card) => (
            <div key={card.Id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-surface-900">Gift Card #{card.Id}</h3>
                  <p className="text-sm text-surface-600">Code: {card.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">${card.balance}</p>
                  <p className="text-sm text-surface-600">Balance</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-surface-500">
                <span>Purchased: {card.purchaseDate}</span>
                <span className={`px-2 py-1 rounded ${
                  card.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-surface-100 text-surface-800'
                }`}>
                  {card.status}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default GiftCards;