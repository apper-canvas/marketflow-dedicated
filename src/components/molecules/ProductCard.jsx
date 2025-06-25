import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import StarRating from '@/components/atoms/StarRating';
import cartService from '@/services/api/cartService';
import { toast } from 'react-toastify';

const ProductCard = ({ product, className = '' }) => {
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await cartService.addItem(product.Id, 1);
      toast.success(`${product.title} added to cart`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const discountPercentage = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/product/${product.Id}`)}
      className={`bg-white rounded-lg border border-surface-200 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden ${className}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isPrime && (
            <Badge variant="prime" size="xs">
              <ApperIcon name="Zap" className="w-3 h-3 mr-1" />
              Prime
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="deal" size="xs">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="shadow-lg"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-sm font-medium text-surface-900 line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="mb-2">
          <StarRating 
            rating={product.rating} 
            reviewCount={product.reviewCount}
            size="xs"
          />
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-surface-900">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-surface-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Delivery Info */}
        {product.isPrime && (
          <div className="flex items-center text-xs text-surface-600 mb-3">
            <ApperIcon name="Truck" className="w-3 h-3 mr-1" />
            FREE delivery tomorrow
          </div>
        )}

        {/* Stock Status */}
        <div className="flex items-center justify-between">
          {product.inStock ? (
            <span className="text-xs text-success">In Stock</span>
          ) : (
            <span className="text-xs text-error">Out of Stock</span>
          )}
          
          {product.stockCount < 10 && product.inStock && (
            <span className="text-xs text-warning">
              Only {product.stockCount} left
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;