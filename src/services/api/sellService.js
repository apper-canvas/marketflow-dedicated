import mockData from '@/services/mockData/sell.json';

let data = [...mockData];
let nextId = Math.max(...data.map(item => item.Id)) + 1;

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const sellService = {
  async getAll() {
    await delay();
    return [...data];
  },

  async getById(id) {
    await delay();
    const numericId = parseInt(id);
    if (isNaN(numericId)) return null;
    
    const item = data.find(listing => listing.Id === numericId);
    return item ? { ...item } : null;
  },

  async create(listingData) {
    await delay();
    const newListing = {
      Id: nextId++,
      ...listingData,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      image: '/api/placeholder/300/200'
    };
    data.push(newListing);
    return { ...newListing };
  },

  async update(id, listingData) {
    await delay();
    const numericId = parseInt(id);
    if (isNaN(numericId)) throw new Error('Invalid ID');
    
    const index = data.findIndex(listing => listing.Id === numericId);
    if (index === -1) throw new Error('Listing not found');
    
    data[index] = { ...data[index], ...listingData };
    return { ...data[index] };
  },

  async delete(id) {
    await delay();
    const numericId = parseInt(id);
    if (isNaN(numericId)) throw new Error('Invalid ID');
    
    const index = data.findIndex(listing => listing.Id === numericId);
    if (index === -1) throw new Error('Listing not found');
    
    data.splice(index, 1);
    return true;
  }
};

export default sellService;