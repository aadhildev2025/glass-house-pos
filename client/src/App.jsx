import { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';

import { AuthContext, AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import POS from './pages/POS';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import StoreData from './pages/StoreData';
import SalesHistory from './pages/SalesHistory';
import Settings from './pages/Settings';
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';

import { Menu, X } from 'lucide-react';

import useMobile from './hooks/useMobile';

const AppContent = () => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMobile();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [window.location.pathname]);

  useEffect(() => {
    // Default to light theme
    document.documentElement.setAttribute('data-theme', 'light');

    // Splash screen timer
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!user) {
    return (
      <>
        <AnimatePresence>
          {isLoading && <SplashScreen />}
        </AnimatePresence>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </>
    );
  }

  return (
    <div className="main-layout">
      <AnimatePresence>
        {isLoading && <SplashScreen />}
      </AnimatePresence>

      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          className="mobile-nav-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <main className="content-area">
        <Routes>
          <Route path="/" element={<POS />} />
          <Route path="/products" element={<Products />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/history" element={<SalesHistory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
        <ToastContainer position="bottom-right" theme="colored" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
