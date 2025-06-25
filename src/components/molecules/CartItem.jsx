import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import cartService from '@/services/api/cartService';
import { toast } from 'react-toastify';

const CartItem = ({ item, onUpdate, savedForLater = false }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);

  const { product } = item;

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > 99) return;
    
    setUpdating(true);
    try {
      await cartService.updateQuantity(item.Id, newQuantity);
      setQuantity(newQuantity);
      onUpdate?.();
      toast.success('Quantity updated');
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    setUpdating(true);
    try {
      await cartService.removeItem(item.Id);
      onUpdate?.();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleSaveForLater = async () => {
    setUpdating(true);
    try {
      if (savedForLater) {
        await cartService.moveToCart(item.Id);
        toast.success('Item moved to cart');
      } else {
        await cartService.saveForLater(item.Id);
        toast.success('Item saved for later');
      }
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to update item');
    } finally {
      setUpdating(false);
    }
  };

  const itemTotal = product.price * quantity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-4 p-4 bg-white border border-surface-200 rounded-lg"
    >
      {/* Product Image */}
      <Link to={`/product/${product.Id}`} className="flex-shrink-0">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-24 h-24 object-cover rounded-md"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <Link
              to={`/product/${product.Id}`}
              className="text-secondary hover:text-secondary/80 font-medium line-clamp-2"
            >
              {product.title}
            </Link>
            
            <div className="flex items-center gap-2 mt-1">
              {product.isPrime && (
                <Badge variant="prime" size="xs">
                  <ApperIcon name="Zap" className="w-3 h-3 mr-1" />
                  Prime
                </Badge>
              )}
              {product.inStock ? (
                <span className="text-sm text-success">In Stock</span>
              ) : (
                <span className="text-sm text-error">Out of Stock</span>
              )}
            </div>

            {product.isPrime && (
              <p className="text-sm text-surface-600 mt-1">
                FREE delivery tomorrow
              </p>
            )}
          </div>

          {/* Price */}
          <div className="text-right ml-4">
            <div className="text-lg font-bold text-surface-900">
              ${itemTotal.toFixed(2)}
            </div>
            {quantity > 1 && (
              <div className="text-sm text-surface-600">
                ${product.price.toFixed(2)} each
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-4">
          {!savedForLater && (
            <div className="flex items-center border border-surface-300 rounded">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || updating}
                className="p-1 hover:bg-surface-50 disabled:opacity-50"
              >
                <ApperIcon name="Minus" className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 99 || updating}
                className="p-1 hover:bg-surface-50 disabled:opacity-50"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={handleRemove}
            disabled={updating}
            className="text-sm text-surface-600 hover:text-error transition-colors"
          >
            Delete
          </button>

          <button
            onClick={handleSaveForLater}
            disabled={updating}
            className="text-sm text-secondary hover:text-secondary/80 transition-colors"
          >
            {savedForLater ? 'Move to Cart' : 'Save for Later'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;