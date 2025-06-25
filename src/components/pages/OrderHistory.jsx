import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import orderService from "@/services/api/orderService";
import cartService from "@/services/api/cartService";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [trackingData, setTrackingData] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = async (orderId) => {
    try {
      setTrackingOrder(orderId);
      const tracking = await orderService.trackOrder(orderId);
      setTrackingData(tracking);
    } catch (error) {
      toast.error('Failed to load tracking information');
    }
  };

  const handleReorder = async (orderId) => {
    try {
      const items = await orderService.reorder(orderId);
      
      // Add all items to cart
for (const item of items) {
        await cartService.addItem(item.productId, item.quantity);
      }
      
      toast.success('Items added to cart');
      if (typeof window !== 'undefined' && window.CustomEvent) {
        window.dispatchEvent(new window.CustomEvent('cartUpdated'));
      }
    } catch (error) {
      toast.error('Failed to reorder items');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'shipped':
      case 'in transit':
        return 'secondary';
      case 'delivered':
        return 'success';
      case 'cancelled':
      case 'returned':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="container mx-auto px-4 py-6">
          <div className="h-8 bg-surface-200 rounded w-48 animate-pulse mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-surface-200 p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-200 rounded w-32"></div>
                    <div className="h-4 bg-surface-200 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-surface-200 rounded w-20"></div>
                </div>
                <div className="h-20 bg-surface-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-surface-900 mb-2">Failed to load orders</h1>
          <p className="text-surface-600 mb-6">{error}</p>
          <Button onClick={loadOrders}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-surface-900 mb-8">Your Orders</h1>
          
          <div className="text-center py-16">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <ApperIcon name="Package" className="w-24 h-24 text-surface-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-surface-900 mb-4">No orders yet</h2>
              <p className="text-surface-600 mb-8 max-w-md mx-auto">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <Button size="lg" onClick={() => window.location.href = '/'}>
                Start Shopping
                <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-surface-900 mb-8">Your Orders</h1>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-surface-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-surface-50 px-6 py-4 border-b border-surface-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-surface-600">Order placed</p>
                      <p className="font-medium text-surface-900">
                        {format(new Date(order.orderDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-surface-600">Total</p>
                      <p className="font-medium text-surface-900">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-surface-600">Ship to</p>
                      <p className="font-medium text-surface-900 truncate">
                        {order.shippingAddress.name}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-surface-600">Order #</p>
                      <p className="font-medium text-surface-900">
                        {order.Id.toString().padStart(6, '0')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    
                    <div className="flex gap-2">
                      {order.trackingNumber && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTrackOrder(order.Id)}
                        >
                          <ApperIcon name="Truck" className="w-4 h-4 mr-1" />
                          Track
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorder(order.Id)}
                      >
                        <ApperIcon name="RotateCcw" className="w-4 h-4 mr-1" />
                        Reorder
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-surface-100 rounded border border-surface-200 flex items-center justify-center">
                        <ApperIcon name="Package" className="w-6 h-6 text-surface-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-surface-900 truncate">
                          {item.title}
                        </h3>
                        <p className="text-sm text-surface-600">
                          Quantity: {item.quantity} • ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      
                      <div className="text-lg font-semibold text-surface-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Info */}
                {order.deliveryDate && (
                  <div className="mt-6 p-4 bg-surface-50 rounded-lg">
                    <div className="flex items-center">
                      <ApperIcon name="Truck" className="w-5 h-5 text-secondary mr-2" />
                      <span className="text-sm text-surface-700">
                        {order.status === 'Delivered' ? 'Delivered on' : 'Expected delivery:'}{' '}
                        <span className="font-medium">
                          {format(new Date(order.deliveryDate), 'EEEE, MMM d')}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tracking Modal */}
        {trackingData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-surface-900">
                    Order Tracking
                  </h3>
                  <button
                    onClick={() => setTrackingData(null)}
                    className="text-surface-400 hover:text-surface-600"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-surface-600">Order #{trackingData.orderId}</p>
                  {trackingData.trackingNumber && (
                    <p className="text-sm text-surface-600">
                      Tracking: {trackingData.trackingNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  {trackingData.events.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        index === 0 ? 'bg-primary' : 'bg-surface-300'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-surface-900">
                          {event.status}
                        </p>
                        <p className="text-sm text-surface-600">
                          {event.description}
                        </p>
                        <p className="text-xs text-surface-500">
                          {format(new Date(event.date), 'MMM d, yyyy h:mm a')} • {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;