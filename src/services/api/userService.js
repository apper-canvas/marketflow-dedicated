import userData from '@/services/mockData/user.json';

let users = [...userData];
let lastId = Math.max(...users.map(u => u.Id), 0);

const generateId = () => ++lastId;

const userService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...users];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }
    const user = users.find(u => u.Id === userId);
    return user ? { ...user } : null;
  },

  async getCurrentUser() {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Simulate getting current logged-in user (first user for demo)
    const user = users.find(u => u.Id === 1);
    return user ? { ...user } : null;
  },

  async create(userData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newUser = {
      ...userData,
      Id: generateId(),
      accountStatus: 'active',
      memberSince: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    users.push(newUser);
    return { ...newUser };
  },

  async update(id, userData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }
    
    const index = users.findIndex(u => u.Id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...users[index],
      ...userData,
      Id: userId // Ensure ID cannot be changed
    };
    users[index] = updatedUser;
    return { ...updatedUser };
  },

  async updateProfile(id, profileData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }
    
    const index = users.findIndex(u => u.Id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }

    users[index] = {
      ...users[index],
      ...profileData,
      Id: userId
    };
    return { ...users[index] };
  },

  async updatePreferences(id, preferences) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }
    
    const index = users.findIndex(u => u.Id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }

    users[index] = {
      ...users[index],
      preferences: {
        ...users[index].preferences,
        ...preferences
      }
    };
    return { ...users[index] };
  },

  async updateSecurity(id, securityData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }
    
    const index = users.findIndex(u => u.Id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }

    users[index] = {
      ...users[index],
      security: {
        ...users[index].security,
        ...securityData
      }
    };
    return { ...users[index] };
  },

  async changePassword(id, currentPassword, newPassword) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }
    
    const index = users.findIndex(u => u.Id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }

    // Simulate password validation
    if (!currentPassword || !newPassword) {
      throw new Error('Current password and new password are required');
    }

    users[index] = {
      ...users[index],
      security: {
        ...users[index].security,
        lastPasswordChange: new Date().toISOString()
      }
    };
    return { success: true };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }
    
    const index = users.findIndex(u => u.Id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }

    const deletedUser = users.splice(index, 1)[0];
    return { ...deletedUser };
  }
};

export default userService;