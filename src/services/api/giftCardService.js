import mockData from '@/services/mockData/giftCard.json';

let data = [...mockData];
let nextId = Math.max(...data.map(item => item.Id)) + 1;

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const generateGiftCardCode = () => {
  return Math.random().toString(36).substr(2, 12).toUpperCase();
};

const giftCardService = {
  async getAll() {
    await delay();
    return [...data];
  },

  async getById(id) {
    await delay();
    const numericId = parseInt(id);
    if (isNaN(numericId)) return null;
    
    const item = data.find(card => card.Id === numericId);
    return item ? { ...item } : null;
  },

  async create(cardData) {
    await delay();
    const newCard = {
      Id: nextId++,
      ...cardData,
      code: generateGiftCardCode(),
      balance: parseFloat(cardData.amount),
      status: 'active',
      purchaseDate: new Date().toISOString().split('T')[0]
    };
    data.push(newCard);
    return { ...newCard };
  },

  async update(id, cardData) {
    await delay();
    const numericId = parseInt(id);
    if (isNaN(numericId)) throw new Error('Invalid ID');
    
    const index = data.findIndex(card => card.Id === numericId);
    if (index === -1) throw new Error('Gift card not found');
    
    data[index] = { ...data[index], ...cardData };
    return { ...data[index] };
  },

  async delete(id) {
    await delay();
    const numericId = parseInt(id);
    if (isNaN(numericId)) throw new Error('Invalid ID');
    
    const index = data.findIndex(card => card.Id === numericId);
    if (index === -1) throw new Error('Gift card not found');
    
    data.splice(index, 1);
    return true;
  },

  async redeem(code) {
    await delay();
    const card = data.find(c => c.code === code && c.status === 'active' && c.balance > 0);
    if (!card) throw new Error('Invalid or expired gift card');
    
    const amount = card.balance;
    card.balance = 0;
    card.status = 'redeemed';
    card.redeemedAt = new Date().toISOString().split('T')[0];
    
    return { amount };
  }
};

export default giftCardService;