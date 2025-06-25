import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import cartService from "@/services/api/cartService";
import orderService from "@/services/api/orderService";
import addressService from "@/services/api/addressService";

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  const [paymentMethod, setPaymentMethod] = useState({
    type: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const steps = [
    { id: 1, title: 'Shipping Address', icon: 'MapPin' },
    { id: 2, title: 'Payment Method', icon: 'CreditCard' },
    { id: 3, title: 'Review Order', icon: 'CheckCircle' }
  ];

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    try {
      setLoading(true);
      
      const [items, cartSummary, defaultAddress] = await Promise.all([
        cartService.getAll(),
        cartService.getCartSummary(),
        addressService.getDefault().catch(() => null)
      ]);

      const activeItems = items.filter(item => !item.savedForLater);
      
      if (activeItems.length === 0) {
        navigate('/cart');
        return;
      }

      setCartItems(activeItems);
      setSummary(cartSummary);
      
      if (defaultAddress) {
        setShippingAddress(defaultAddress);
      }
    } catch (error) {
      toast.error('Failed to load checkout data');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const validateShippingAddress = () => {
    const required = ['name', 'street', 'city', 'state', 'zip'];
    const missing = required.filter(field => !shippingAddress[field]?.trim());
    
    if (missing.length > 0) {
      toast.error('Please fill in all shipping address fields');
      return false;
    }
    
    if (!/^\d{5}(-\d{4})?$/.test(shippingAddress.zip)) {
      toast.error('Please enter a valid ZIP code');
      return false;
    }
    
    return true;
  };

  const validatePaymentMethod = () => {
    if (paymentMethod.type === 'card') {
      const required = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
      const missing = required.filter(field => !paymentMethod[field]?.trim());
      
      if (missing.length > 0) {
        toast.error('Please fill in all payment details');
        return false;
      }
      
      if (!/^\d{16}$/.test(paymentMethod.cardNumber.replace(/\s/g, ''))) {
        toast.error('Please enter a valid card number');
        return false;
      }
      
      if (!/^\d{2}\/\d{2}$/.test(paymentMethod.expiryDate)) {
        toast.error('Please enter expiry date in MM/YY format');
        return false;
      }
      
      if (!/^\d{3,4}$/.test(paymentMethod.cvv)) {
        toast.error('Please enter a valid CVV');
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateShippingAddress()) return;
    if (currentStep === 2 && !validatePaymentMethod()) return;
    
    setCurrentStep(prev => Math.min(3, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handlePlaceOrder = async () => {
    if (!validateShippingAddress() || !validatePaymentMethod()) return;
    
    try {
      setSubmitting(true);
      
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          title: item.product.title
        })),
        subtotal: summary.subtotal,
        tax: summary.tax,
        shipping: summary.shipping,
        total: summary.total,
        shippingAddress,
        paymentMethod: {
          type: paymentMethod.type,
          last4: paymentMethod.cardNumber.slice(-4)
        }
      };

      const order = await orderService.create(orderData);
      await cartService.clearCart();
toast.success('Order placed successfully!');
      navigate(`/orders`);
      
      // Trigger cart update event
      try {
        const event = new (window.CustomEvent || Event)('cartUpdated', {
          bubbles: true,
          cancelable: true
        });
        window.dispatchEvent(event);
      } catch (eventError) {
        console.warn('Failed to dispatch cart update event:', eventError);
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 bg-surface-200 rounded w-48 animate-pulse mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-surface-200 rounded mb-4"></div>
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-12 bg-surface-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-surface-200 rounded mb-4"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-surface-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-surface-900 mb-8">Checkout</h1>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step.id <= currentStep 
                      ? 'bg-primary border-primary text-white' 
                      : 'border-surface-300 text-surface-500'
                  }`}>
                    {step.id < currentStep ? (
                      <ApperIcon name="Check" className="w-5 h-5" />
                    ) : (
                      <ApperIcon name={step.icon} className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${
                    step.id <= currentStep ? 'text-surface-900' : 'text-surface-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      step.id < currentStep ? 'bg-primary' : 'bg-surface-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Content */}
            <div>
              {/* Step 1: Shipping Address */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg border border-surface-200 p-6"
                >
                  <h2 className="text-xl font-semibold text-surface-900 mb-6">
                    Shipping Address
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Full Name"
                        value={shippingAddress.name}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Input
                        label="Street Address"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, street: e.target.value }))}
                        placeholder="Enter your street address"
                      />
                    </div>
                    
                    <Input
                      label="City"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Enter city"
                    />
                    
                    <Input
                      label="State"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="Enter state"
                    />
                    
                    <Input
                      label="ZIP Code"
                      value={shippingAddress.zip}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, zip: e.target.value }))}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg border border-surface-200 p-6"
                >
                  <h2 className="text-xl font-semibold text-surface-900 mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentType"
                          value="card"
                          checked={paymentMethod.type === 'card'}
                          onChange={(e) => setPaymentMethod(prev => ({ ...prev, type: e.target.value }))}
                          className="mr-3"
                        />
                        <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                        Credit/Debit Card
                      </label>
                    </div>

                    {paymentMethod.type === 'card' && (
                      <div className="ml-8 space-y-4">
                        <Input
                          label="Card Number"
                          value={paymentMethod.cardNumber}
                          onChange={(e) => {
                            // Format card number with spaces
                            const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                            if (value.replace(/\s/g, '').length <= 16) {
                              setPaymentMethod(prev => ({ ...prev, cardNumber: value }));
                            }
                          }}
                          placeholder="1234 5678 9012 3456"
                        />
                        
                        <Input
                          label="Name on Card"
                          value={paymentMethod.cardName}
                          onChange={(e) => setPaymentMethod(prev => ({ ...prev, cardName: e.target.value }))}
                          placeholder="Enter cardholder name"
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Expiry Date"
                            value={paymentMethod.expiryDate}
                            onChange={(e) => {
                              // Format MM/YY
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                value = value.substring(0, 2) + '/' + value.substring(2, 4);
                              }
                              setPaymentMethod(prev => ({ ...prev, expiryDate: value }));
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          
                          <Input
                            label="CVV"
                            value={paymentMethod.cvv}
                            onChange={(e) => {
                              if (/^\d{0,4}$/.test(e.target.value)) {
                                setPaymentMethod(prev => ({ ...prev, cvv: e.target.value }));
                              }
                            }}
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Shipping Address Review */}
                  <div className="bg-white rounded-lg border border-surface-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-surface-900">Shipping Address</h3>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                        Edit
                      </Button>
                    </div>
                    <div className="text-surface-700">
                      <p>{shippingAddress.name}</p>
                      <p>{shippingAddress.street}</p>
                      <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
                    </div>
                  </div>

                  {/* Payment Method Review */}
                  <div className="bg-white rounded-lg border border-surface-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-surface-900">Payment Method</h3>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center text-surface-700">
                      <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                      <span>Card ending in {paymentMethod.cardNumber.slice(-4)}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white rounded-lg border border-surface-200 p-6">
                    <h3 className="text-lg font-semibold text-surface-900 mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.Id} className="flex items-center gap-4">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-surface-900 truncate">
                              {item.product.title}
                            </h4>
                            <p className="text-sm text-surface-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-lg font-semibold text-surface-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  <ApperIcon name="ChevronLeft" className="w-4 h-4 mr-2" />
                  Back
                </Button>

                {currentStep < 3 ? (
                  <Button onClick={handleNext}>
                    Next
                    <ApperIcon name="ChevronRight" className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handlePlaceOrder}
                    loading={submitting}
                    disabled={submitting}
                    variant="cart"
                    size="lg"
                  >
                    Place Order
                  </Button>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:sticky lg:top-6 h-fit">
              <div className="bg-white rounded-lg border border-surface-200 p-6">
                <h3 className="text-lg font-semibold text-surface-900 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-surface-700">
                    <span>Items ({summary.itemCount}):</span>
                    <span>${summary.subtotal?.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-surface-700">
                    <span>Shipping & handling:</span>
                    <span>{summary.shipping === 0 ? 'FREE' : `$${summary.shipping?.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="flex justify-between text-surface-700">
                    <span>Tax:</span>
                    <span>${summary.tax?.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-surface-200 pt-3">
                    <div className="flex justify-between text-xl font-bold text-surface-900">
                      <span>Order Total:</span>
                      <span>${summary.total?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {summary.shipping === 0 && (
                  <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                    <div className="flex items-center text-success text-sm">
                      <ApperIcon name="Truck" className="w-4 h-4 mr-2" />
                      FREE shipping included
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;