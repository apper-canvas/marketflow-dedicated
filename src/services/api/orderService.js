import mockOrders from '../mockData/order.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let orders = [...mockOrders];

class OrderService {
  async getAll() {
    await delay(300);
    return orders
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      .map(order => ({ ...order }));
  }

  async getById(id) {
    await delay(200);
    const order = orders.find(o => o.Id === parseInt(id, 10));
    if (!order) {
      throw new Error('Order not found');
    }
    return { ...order };
  }

  async create(orderData) {
    await delay(500);
    
    const newId = Math.max(...orders.map(order => order.Id), 0) + 1;
    const newOrder = {
      Id: newId,
      ...orderData,
      status: 'Processing',
      orderDate: new Date().toISOString(),
      trackingNumber: null
    };

    orders.unshift(newOrder);
    return { ...newOrder };
  }

  async getOrderStatuses() {
    await delay(100);
    return [
      'Processing',
      'Confirmed',
      'Shipped',
      'In Transit',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
      'Returned'
    ];
  }

  async trackOrder(orderId) {
    await delay(400);
    const order = orders.find(o => o.Id === parseInt(orderId, 10));
    if (!order) {
      throw new Error('Order not found');
    }

    // Mock tracking events
    const trackingEvents = [
      {
        date: order.orderDate,
        status: 'Order Placed',
        location: 'Online',
        description: 'Your order has been received and is being processed.'
      }
    ];

    if (order.status !== 'Processing') {
      trackingEvents.push({
        date: new Date(new Date(order.orderDate).getTime() + 2 * 60 * 60 * 1000).toISOString(),
        status: 'Order Confirmed',
        location: 'Fulfillment Center',
        description: 'Your order has been confirmed and is being prepared for shipment.'
      });
    }

    if (['Shipped', 'In Transit', 'Out for Delivery', 'Delivered'].includes(order.status)) {
      trackingEvents.push({
        date: new Date(new Date(order.orderDate).getTime() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'Shipped',
        location: 'Seattle, WA',
        description: 'Your package has been shipped and is on its way.'
      });
    }

    if (['In Transit', 'Out for Delivery', 'Delivered'].includes(order.status)) {
      trackingEvents.push({
        date: new Date(new Date(order.deliveryDate).getTime() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'In Transit',
        location: 'Portland, OR',
        description: 'Your package is in transit to the destination.'
      });
    }

    if (['Out for Delivery', 'Delivered'].includes(order.status)) {
      trackingEvents.push({
        date: new Date(new Date(order.deliveryDate).getTime() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'Out for Delivery',
        location: order.shippingAddress.city + ', ' + order.shippingAddress.state,
        description: 'Your package is out for delivery and will arrive today.'
      });
    }

    if (order.status === 'Delivered') {
      trackingEvents.push({
        date: order.deliveryDate,
        status: 'Delivered',
        location: order.shippingAddress.city + ', ' + order.shippingAddress.state,
        description: 'Your package has been delivered.'
      });
    }

    return {
      orderId: order.Id,
      trackingNumber: order.trackingNumber,
      currentStatus: order.status,
      estimatedDelivery: order.deliveryDate,
      events: trackingEvents.reverse()
    };
  }

  async reorder(orderId) {
    await delay(300);
    const order = orders.find(o => o.Id === parseInt(orderId, 10));
    if (!order) {
      throw new Error('Order not found');
    }

    // Return the items for adding to cart
    return order.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));
  }
}

export default new OrderService();