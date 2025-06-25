import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import cartService from "@/services/api/cartService";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [summary, setSummary] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    itemCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [items, saved, cartSummary] = await Promise.all([
        cartService.getAll(),
        cartService.getSavedItems(),
        cartService.getCartSummary()
      ]);
      
      const activeItems = items.filter(item => !item.savedForLater);
      
      setCartItems(activeItems);
      setSavedItems(saved);
      setSummary(cartSummary);
    } catch (err) {
      setError(err.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

const handleItemUpdate = () => {
    loadCartData();
    // Trigger cart update event for header
    if (typeof window !== 'undefined' && window.CustomEvent) {
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } else if (typeof window !== 'undefined') {
      // Fallback for older browsers
      const event = document.createEvent('Event');
      event.initEvent('cartUpdated', true, true);
      window.dispatchEvent(event);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="container mx-auto px-4 py-6">
          <div className="h-8 bg-surface-200 rounded w-48 animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-surface-200 p-4 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-surface-200 rounded"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                      <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                      <div className="h-8 bg-surface-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg border border-surface-200 p-6 h-fit animate-pulse">
              <div className="space-y-4">
                <div className="h-6 bg-surface-200 rounded w-1/2"></div>
                <div className="h-4 bg-surface-200 rounded"></div>
                <div className="h-4 bg-surface-200 rounded"></div>
                <div className="h-12 bg-surface-200 rounded"></div>
              </div>
            </div>
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
          <h1 className="text-2xl font-bold text-surface-900 mb-2">Failed to load cart</h1>
          <p className="text-surface-600 mb-6">{error}</p>
          <Button onClick={loadCartData}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && savedItems.length === 0) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-surface-900 mb-8">Shopping Cart</h1>
          
          <div className="text-center py-16">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <ApperIcon name="ShoppingCart" className="w-24 h-24 text-surface-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-surface-900 mb-4">Your cart is empty</h2>
              <p className="text-surface-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
              </p>
              <Link to="/">
                <Button size="lg">
                  Continue Shopping
                  <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-surface-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-surface-900">
                    Cart ({summary.itemCount} item{summary.itemCount !== 1 ? 's' : ''})
                  </h2>
                  <Link to="/" className="text-secondary hover:text-secondary/80 text-sm">
                    Continue Shopping
                  </Link>
                </div>

                <div className="space-y-4">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.Id}
                        item={item}
                        onUpdate={handleItemUpdate}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Saved for Later */}
            {savedItems.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-surface-900 mb-4">
                  Saved for Later ({savedItems.length} item{savedItems.length !== 1 ? 's' : ''})
                </h2>
                
                <div className="space-y-4">
                  <AnimatePresence>
                    {savedItems.map((item) => (
                      <CartItem
                        key={`saved-${item.Id}`}
                        item={item}
                        onUpdate={handleItemUpdate}
                        savedForLater={true}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-surface-200 p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-surface-900 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-surface-700">
                    <span>Items ({summary.itemCount}):</span>
                    <span>${summary.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-surface-700">
                    <span>Shipping & handling:</span>
                    <span>{summary.shipping === 0 ? 'FREE' : `$${summary.shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="flex justify-between text-surface-700">
                    <span>Tax:</span>
                    <span>${summary.tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-surface-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-surface-900">
                      <span>Order Total:</span>
                      <span>${summary.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {summary.shipping === 0 && (
                  <div className="bg-success/10 border border-success/20 rounded-lg p-3 mb-4">
                    <div className="flex items-center text-success text-sm">
                      <ApperIcon name="Truck" className="w-4 h-4 mr-2" />
                      Your order qualifies for FREE shipping
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => navigate('/checkout')}
                  variant="cart"
                  fullWidth
                  size="lg"
                  className="mb-3"
                >
                  Proceed to Checkout
                </Button>

                <div className="text-xs text-surface-600 text-center">
                  By placing your order, you agree to our terms and conditions
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;