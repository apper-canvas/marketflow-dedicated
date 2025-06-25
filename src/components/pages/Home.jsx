import { motion } from 'framer-motion';
import FeaturedProducts from '@/components/organisms/FeaturedProducts';
import DealsCarousel from '@/components/organisms/DealsCarousel';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { Link } from 'react-router-dom';

const Home = () => {
  const categories = [
    {
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300',
      path: '/search?category=Electronics',
      icon: 'Smartphone'
    },
    {
      name: 'Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300',
      path: '/search?category=Home%20%26%20Kitchen',
      icon: 'Home'
    },
    {
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300',
      path: '/search?category=Fashion',
      icon: 'Shirt'
    },
    {
      name: 'Books',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      path: '/search?category=Books',
      icon: 'Book'
    },
    {
      name: 'Sports & Outdoors',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
      path: '/search?category=Sports%20%26%20Outdoors',
      icon: 'Activity'
    },
    {
      name: 'Video Games',
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300',
      path: '/search?category=Video%20Games',
      icon: 'Gamepad2'
    }
  ];

  const services = [
    {
      title: 'Fast & Free Delivery',
      description: 'Free shipping on orders over $25',
      icon: 'Truck',
      color: 'text-primary'
    },
    {
      title: 'Easy Returns',
      description: '30-day return policy',
      icon: 'RotateCcw',
      color: 'text-success'
    },
    {
      title: 'Secure Payments',
      description: 'Your data is protected',
      icon: 'Shield',
      color: 'text-secondary'
    },
    {
      title: '24/7 Support',
      description: 'We\'re here to help',
      icon: 'Headphones',
      color: 'text-warning'
    }
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-surface-800 to-surface-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Everything You Need,{' '}
              <span className="text-primary">All in One Place</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-surface-200"
            >
              Discover millions of products at unbeatable prices with fast, free delivery
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/search">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Shopping
                  <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link to="/deals">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-surface-800">
                  View Deals
                  <ApperIcon name="Percent" className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center text-surface-900 mb-12"
          >
            Shop by Category
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={category.path}
                  className="group block bg-white rounded-lg border border-surface-200 hover:border-primary hover:shadow-lg transition-all duration-200"
                >
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md">
                      <ApperIcon name={category.icon} className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-medium text-surface-900 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Deals */}
      <DealsCarousel />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Services Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-100 mb-4 ${service.color}`}>
                  <ApperIcon name={service.icon} className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-surface-600">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-surface-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold mb-4"
            >
              Stay Updated with Great Deals
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-surface-200 mb-8"
            >
              Get exclusive offers and new arrivals delivered to your inbox
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="px-8 py-3">
                Subscribe
                <ApperIcon name="Mail" className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;