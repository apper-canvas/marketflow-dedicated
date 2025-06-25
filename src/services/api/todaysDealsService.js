import mockData from '@/services/mockData/todaysDeals.json';

let data = [...mockData];
let nextId = Math.max(...data.map(item => item.Id)) + 1;

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const todaysDealsService = {
  async getAll() {
    await delay();
    return [...data];
  },

  async getById(id) {
    await delay();
    const numericId = parseInt(id);
    if (isNaN(numericId)) return null;
    
    const item = data.find(deal => deal.Id === numericId);
    return item ? { ...item } : null;
  },

  async create(dealData) {
    await delay();
    const newDeal = {
      Id: nextId++,
      ...dealData,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    data.push(newDeal);
    return { ...newDeal };
  },

  async update(id, dealData) {
    await delay();
    const numericId = parseInt(id);
    if (isNaN(numericId)) throw new Error('Invalid ID');
    
    const index = data.findIndex(deal => deal.Id === numericId);
    if (index === -1) throw new Error('Deal not found');
    
    data[index] = { ...data[index], ...dealData };
    return { ...data[index] };
  },

  async delete(id) {
    await delay();
    const numericId = parseInt(id);
    if (isNaN(numericId)) throw new Error('Invalid ID');
    
    const index = data.findIndex(deal => deal.Id === numericId);
    if (index === -1) throw new Error('Deal not found');
    
    data.splice(index, 1);
    return true;
  }
};

export default todaysDealsService;