import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { Cart } from './components/Cart';
import { ProductDetail } from './components/ProductDetail';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import type { Product } from './types';

function AppContent() {
  const { products, categories, loading: productsLoading } = useProducts();
  const {
    cartItems,
    loading: cartLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    total,
    itemCount
  } = useCart();
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (productsLoading || cartLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
      }`}>
        <div className={`backdrop-blur-2xl border rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-2xl ${
          isDark 
            ? 'bg-white/10 border-white/20' 
            : 'bg-white/80 border-blue-200'
        }`}>
          <div className={`animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 mx-auto mb-4 ${
            isDark ? 'border-blue-400' : 'border-blue-600'
          }`}></div>
          <p className={`text-base sm:text-lg font-medium text-center ${
            isDark ? 'text-white' : 'text-blue-900'
          }`}>{t.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
    }`}>
      <Header cartItemCount={itemCount} onCartClick={() => setIsCartOpen(true)} />

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/categories"
          element={<CategoriesPage categories={categories} />}
        />
      </Routes>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        total={total}
      />

      <ProductDetail
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      <footer className={`backdrop-blur-xl border-t py-6 sm:py-8 mt-12 sm:mt-20 transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-r from-blue-950/80 via-blue-900/70 to-blue-950/80 border-white/10' 
          : 'bg-gradient-to-r from-white/80 via-blue-50/70 to-white/80 border-blue-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className={`text-xs sm:text-base ${isDark ? 'text-blue-200/80' : 'text-blue-600/80'}`}>
            {t.common.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <LanguageProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
