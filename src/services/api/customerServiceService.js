import mockData from '@/services/mockData/customerService.json';

let data = [...mockData];
let nextId = Math.max(...data.map(item => item.Id)) + 1;

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const customerServiceService = {
  async getAll() {
    await delay();
    return [...data];
  },

  async getById(id) {
    await delay();
    const numericId = parseInt(id);
    if (isNaN(numericId)) return null;
    
    const item = data.find(ticket => ticket.Id === numericId);
    return item ? { ...item } : null;
  },

  async create(ticketData) {
    await delay();
    const newTicket = {
      Id: nextId++,
      ...ticketData,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    data.push(newTicket);
    return { ...newTicket };
  },

  async update(id, ticketData) {
    await delay();
    const numericId = parseInt(id);
    if (isNaN(numericId)) throw new Error('Invalid ID');
    
    const index = data.findIndex(ticket => ticket.Id === numericId);
    if (index === -1) throw new Error('Ticket not found');
    
    data[index] = { 
      ...data[index], 
      ...ticketData,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    return { ...data[index] };
  },

  async delete(id) {
    await delay();
    const numericId = parseInt(id);
    if (isNaN(numericId)) throw new Error('Invalid ID');
    
    const index = data.findIndex(ticket => ticket.Id === numericId);
    if (index === -1) throw new Error('Ticket not found');
    
    data.splice(index, 1);
    return true;
  }
};

export default customerServiceService;