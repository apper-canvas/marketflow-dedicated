import mockAddresses from '../mockData/address.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let addresses = [...mockAddresses];

class AddressService {
  async getAll() {
    await delay(200);
    return [...addresses];
  }

  async getById(id) {
    await delay(100);
    const address = addresses.find(a => a.Id === parseInt(id, 10));
    if (!address) {
      throw new Error('Address not found');
    }
    return { ...address };
  }

  async create(addressData) {
    await delay(300);
    const newId = Math.max(...addresses.map(addr => addr.Id), 0) + 1;
    const newAddress = {
      Id: newId,
      ...addressData,
      isDefault: addressData.isDefault || false
    };

    // If this is set as default, unset others
    if (newAddress.isDefault) {
      addresses.forEach(addr => addr.isDefault = false);
    }

    addresses.push(newAddress);
    return { ...newAddress };
  }

  async update(id, addressData) {
    await delay(250);
    const index = addresses.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Address not found');
    }

    // If this is set as default, unset others
    if (addressData.isDefault) {
      addresses.forEach(addr => addr.isDefault = false);
    }

    addresses[index] = {
      ...addresses[index],
      ...addressData,
      Id: parseInt(id, 10)
    };

    return { ...addresses[index] };
  }

  async delete(id) {
    await delay(200);
    const index = addresses.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Address not found');
    }

    const wasDefault = addresses[index].isDefault;
    addresses.splice(index, 1);

    // If we deleted the default address, make the first one default
    if (wasDefault && addresses.length > 0) {
      addresses[0].isDefault = true;
    }

    return { success: true };
  }

  async getDefault() {
    await delay(100);
    const defaultAddress = addresses.find(a => a.isDefault);
    return defaultAddress ? { ...defaultAddress } : null;
  }

  async setDefault(id) {
    await delay(150);
    const address = addresses.find(a => a.Id === parseInt(id, 10));
    if (!address) {
      throw new Error('Address not found');
    }

    // Unset all defaults
    addresses.forEach(addr => addr.isDefault = false);
    
    // Set new default
    address.isDefault = true;
    
    return { ...address };
  }
}

export default new AddressService();