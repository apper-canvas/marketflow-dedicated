import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import productService from "@/services/api/productService";
import cartService from "@/services/api/cartService";
import ApperIcon from "@/components/ApperIcon";
import Cart from "@/components/pages/Cart";
import Home from "@/components/pages/Home";
import ProductCard from "@/components/molecules/ProductCard";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import StarRating from "@/components/atoms/StarRating";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productData, recommendedData] = await Promise.all([
        productService.getById(id),
        productService.getRecommended(id).catch(() => [])
      ]);
      
      setProduct(productData);
      setRecommended(recommendedData);
      setSelectedImage(0);
    } catch (err) {
      setError(err.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

const handleAddToCart = async () => {
    if (!product?.inStock) return;
    
    try {
      setAddingToCart(true);
      await cartService.addItem(product.Id, quantity);
      toast.success(`${product.title} added to cart`);
// Trigger cart update event
      if (typeof window !== 'undefined') {
        if (typeof window.CustomEvent !== 'undefined') {
          window.dispatchEvent(new window.CustomEvent('cartUpdated'));
        } else {
          // Fallback for older browsers
          const event = document.createEvent('Event');
          event.initEvent('cartUpdated', true, true);
          window.dispatchEvent(event);
        }
      }
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

const handleBuyNow = async () => {
    if (!product?.inStock) return;
    
    try {
      await cartService.addItem(product.Id, quantity);
      navigate('/cart');
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Skeleton */}
            <div>
              <div className="aspect-square bg-surface-200 rounded-lg animate-pulse mb-4"></div>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-16 h-16 bg-surface-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="space-y-4">
              <div className="h-8 bg-surface-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-surface-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-10 bg-surface-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-20 bg-surface-200 rounded animate-pulse"></div>
              <div className="h-12 bg-surface-200 rounded animate-pulse"></div>
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
          <h1 className="text-2xl font-bold text-surface-900 mb-2">Product not found</h1>
          <p className="text-surface-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }
if (!product) {
    return null;
  }

  const discountPercentage = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  return (
    <div className="min-h-screen bg-surface-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-surface-600">
            <button onClick={() => navigate('/')} className="hover:text-secondary">
              Home
            </button>
<ApperIcon name="ChevronRight" className="w-4 h-4" />
            <button onClick={() => navigate(`/search?category=${product?.category || ''}`)} className="hover:text-secondary">
              {product?.category}
            </button>
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
            <span className="text-surface-900 truncate">{product?.title}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-white rounded-lg border border-surface-200 overflow-hidden mb-4"
>
              <img
                src={product?.images?.[selectedImage] || ''}
                alt={product?.title || 'Product'}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
{/* Thumbnail Images */}
            {product?.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {product?.images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                      selectedImage === index 
                        ? 'border-primary' 
                        : 'border-surface-200 hover:border-surface-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product?.title || 'Product'} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
<div>
              <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 mb-2">
                {product?.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <StarRating 
                  rating={product?.rating || 0} 
                  reviewCount={product?.reviewCount || 0}
                  size="md"
                />
                <span className="text-surface-500">|</span>
                <span className="text-sm text-surface-600">
                  Brand: <span className="font-medium">{product?.brand}</span>
                </span>
              </div>

<div className="flex items-center gap-2 mb-4">
                {product?.isPrime && (
                  <Badge variant="prime">
                    <ApperIcon name="Zap" className="w-3 h-3 mr-1" />
                    Prime
                  </Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge variant="deal">
                    Save {discountPercentage}%
                  </Badge>
                )}
                <Badge variant={product?.inStock ? 'success' : 'error'}>
                  {product?.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
            </div>

            {/* Price */}
            <div>
<div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-surface-900">
                  ${product?.price?.toFixed(2) || '0.00'}
                </span>
                {product?.originalPrice > product?.price && (
                  <span className="text-lg text-surface-500 line-through">
                    ${product?.originalPrice?.toFixed(2) || '0.00'}
                  </span>
                )}
              </div>
              
              {product?.isPrime && (
                <div className="flex items-center text-sm text-surface-600">
                  <ApperIcon name="Truck" className="w-4 h-4 mr-2" />
                  FREE delivery by {product?.deliveryDate ? new Date(product.deliveryDate).toLocaleDateString() : 'tomorrow'}
                </div>
              )}
              
              {product?.stockCount < 10 && product?.inStock && (
                <p className="text-sm text-warning mt-2">
                  Only {product.stockCount} left in stock - order soon
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <label className="text-sm font-medium text-surface-700 mr-3">
                  Quantity:
                </label>
                <div className="flex items-center border border-surface-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-surface-50 disabled:opacity-50"
                  >
                    <ApperIcon name="Minus" className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                    className="p-2 hover:bg-surface-50 disabled:opacity-50"
                  >
                    <ApperIcon name="Plus" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
<Button
                onClick={handleAddToCart}
                disabled={!product?.inStock || addingToCart}
                loading={addingToCart}
                fullWidth
                size="lg"
                className="font-bold"
              >
                <ApperIcon name="ShoppingCart" className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              
<Button
                onClick={handleBuyNow}
                disabled={!product?.inStock}
                variant="cart"
                fullWidth
                size="lg"
              >
                Buy Now
              </Button>
            </div>

            {/* Product Features */}
{product?.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-surface-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <ApperIcon name="Check" className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-surface-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white rounded-lg border border-surface-200 p-6 mb-12">
<h2 className="text-xl font-bold text-surface-900 mb-4">Product Description</h2>
          <p className="text-surface-700 leading-relaxed">{product?.description}</p>
        </div>

{/* Recommended Products */}
        {recommended?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-surface-900 mb-6">Customers also viewed</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommended?.map((product, index) => (
                <motion.div
                  key={product.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;