import mockData from '@/services/mockData/registry.json';

let data = [...mockData];
let nextId = Math.max(...data.map(item => item.Id)) + 1;

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const registryService = {
  async getAll() {
    await delay();
    return [...data];
  },

  async getById(id) {
    await delay();
    const numericId = parseInt(id);
    if (isNaN(numericId)) return null;
    
    const item = data.find(registry => registry.Id === numericId);
    return item ? { ...item } : null;
  },

  async create(registryData) {
    await delay();
    const newRegistry = {
      Id: nextId++,
      ...registryData,
      itemCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    data.push(newRegistry);
    return { ...newRegistry };
  },

  async update(id, registryData) {
    await delay();
    const numericId = parseInt(id);
    if (isNaN(numericId)) throw new Error('Invalid ID');
    
    const index = data.findIndex(registry => registry.Id === numericId);
    if (index === -1) throw new Error('Registry not found');
    
    data[index] = { ...data[index], ...registryData };
    return { ...data[index] };
  },

  async delete(id) {
    await delay();
    const numericId = parseInt(id);
    if (isNaN(numericId)) throw new Error('Invalid ID');
    
    const index = data.findIndex(registry => registry.Id === numericId);
    if (index === -1) throw new Error('Registry not found');
    
    data.splice(index, 1);
    return true;
  }
};

export default registryService;