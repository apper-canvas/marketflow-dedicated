import Home from '@/components/pages/Home';
import SearchResults from '@/components/pages/SearchResults';
import ProductDetail from '@/components/pages/ProductDetail';
import Cart from '@/components/pages/Cart';
import Checkout from '@/components/pages/Checkout';
import OrderHistory from '@/components/pages/OrderHistory';
import TodaysDeal from '@/components/pages/TodaysDeal';
import CustomerService from '@/components/pages/CustomerService';
import Registry from '@/components/pages/Registry';
import GiftCards from '@/components/pages/GiftCards';
import Sell from '@/components/pages/Sell';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  todaysDeal: {
    id: 'todaysDeal',
    label: "Today's Deal",
    path: '/todays-deal',
    icon: 'Zap',
    component: TodaysDeal
  },
  customerService: {
    id: 'customerService',
    label: 'Customer Service',
    path: '/customer-service',
    icon: 'HelpCircle',
    component: CustomerService
  },
  registry: {
    id: 'registry',
    label: 'Registry',
    path: '/registry',
    icon: 'Gift',
    component: Registry
  },
  giftCards: {
    id: 'giftCards',
    label: 'Gift Cards',
    path: '/gift-cards',
    icon: 'CreditCard',
    component: GiftCards
  },
  sell: {
    id: 'sell',
    label: 'Sell',
    path: '/sell',
    icon: 'Store',
    component: Sell
  },
  search: {
    id: 'search',
    label: 'Search',
    path: '/search',
    icon: 'Search',
    component: SearchResults
  },
  product: {
    id: 'product',
    label: 'Product',
    path: '/product/:id',
    icon: 'Package',
    component: ProductDetail
  },
  cart: {
    id: 'cart',
    label: 'Cart',
    path: '/cart',
    icon: 'ShoppingCart',
    component: Cart
  },
  checkout: {
    id: 'checkout',
    label: 'Checkout',
    path: '/checkout',
    icon: 'CreditCard',
    component: Checkout
  },
  orders: {
    id: 'orders',
    label: 'Orders',
    path: '/orders',
    icon: 'Package2',
    component: OrderHistory
  }
};

export const routeArray = Object.values(routes);
export default routes;