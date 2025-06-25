import Home from '@/components/pages/Home';
import SearchResults from '@/components/pages/SearchResults';
import ProductDetail from '@/components/pages/ProductDetail';
import Cart from '@/components/pages/Cart';
import Checkout from '@/components/pages/Checkout';
import OrderHistory from '@/components/pages/OrderHistory';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
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