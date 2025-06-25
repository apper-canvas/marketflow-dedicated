import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/organisms/Header';
import CategoryNav from '@/components/organisms/CategoryNav';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface-100">
      <Header />
      <CategoryNav />
      
      <main className="flex-1 overflow-y-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;