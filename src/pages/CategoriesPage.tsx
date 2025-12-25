import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { BannerSlider } from '../components/BannerSlider';
import type { Category, Product } from '../types';

interface CategoriesPageProps {
  categories: Category[];
  products: Product[];
  onAddToCart: (productId: string) => void;
  onViewDetails: (product: Product) => void;
}

const getCategoryName = (category: Category, language: string) => {
  return language === 'ru' && category.name_ru ? category.name_ru : category.name;
};

const getProductName = (product: Product, language: string) => {
  return language === 'ru' && product.name_ru ? product.name_ru : product.name;
};

const getProductDescription = (product: Product, language: string) => {
  return language === 'ru' && product.description_ru ? product.description_ru : product.description;
};

export function CategoriesPage({ categories, products, onAddToCart, onViewDetails }: CategoriesPageProps) {
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory.id)
    : [];

  // Если выбрана категория - показываем товары
  if (selectedCategory) {
    return (
      <div className={`min-h-screen pt-14 sm:pt-16 md:pt-20 transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900'
          : 'bg-gradient-to-br from-blue-100 via-white to-blue-50'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6">
          {/* Back Button & Title */}
          <div className="mb-4 sm:mb-5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`inline-flex items-center gap-1.5 backdrop-blur-xl border font-medium px-3 py-2 rounded-lg transition-all duration-200 mb-3 text-xs sm:text-sm ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  : 'bg-white hover:bg-blue-50 border-blue-300 text-blue-700'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t.categoriesPage.backToCategories || "Kategoriyalarga qaytish"}
            </button>

            <h1 className={`text-lg sm:text-xl lg:text-2xl font-bold bg-clip-text text-transparent ${
              isDark
                ? 'bg-gradient-to-r from-blue-100 via-white to-blue-100'
                : 'bg-gradient-to-r from-blue-700 via-blue-900 to-blue-700'
            }`}>
              {getCategoryName(selectedCategory, language)}
            </h1>
            <p className={`mt-1 text-xs sm:text-sm ${isDark ? 'text-blue-200/70' : 'text-blue-600'}`}>
              {filteredProducts.length} {t.categoriesPage.productsCount || "ta mahsulot"}
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="group relative">
                  <div className={`absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    isDark ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10' : 'bg-gradient-to-br from-blue-400/40 to-blue-500/30'
                  }`}></div>

                  <div className={`relative backdrop-blur-xl border rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                    isDark
                      ? 'bg-white/10 border-white/20 hover:shadow-blue-500/20'
                      : 'bg-white border-blue-200 hover:shadow-blue-300/50'
                  }`}>
                    {/* Image */}
                    <div
                      className="relative aspect-square cursor-pointer overflow-hidden"
                      onClick={() => onViewDetails(product)}
                    >
                      <img
                        src={product.image_url || 'https://via.placeholder.com/300'}
                        alt={getProductName(product, language)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {!product.in_stock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-medium text-xs px-2 py-1 bg-red-500/80 rounded">
                            {t.productCard.outOfStock}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-2 sm:p-3">
                      <h3
                        className={`font-semibold text-xs sm:text-sm mb-1 cursor-pointer line-clamp-2 leading-tight ${
                          isDark ? 'text-white hover:text-blue-300' : 'text-blue-900 hover:text-blue-600'
                        }`}
                        onClick={() => onViewDetails(product)}
                      >
                        {getProductName(product, language)}
                      </h3>

                      <p className={`text-[10px] sm:text-xs mb-2 line-clamp-1 ${isDark ? 'text-blue-200/60' : 'text-blue-600'}`}>
                        {getProductDescription(product, language)}
                      </p>

                      <div className={`text-sm sm:text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-blue-900'}`}>
                        {product.price.toLocaleString()} сум
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => onViewDetails(product)}
                          className={`flex-1 backdrop-blur-xl border font-medium px-2 py-1.5 rounded-lg transition-all text-[10px] sm:text-xs ${
                            isDark
                              ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                              : 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700'
                          }`}
                        >
                          {t.productCard.details}
                        </button>

                        <button
                          onClick={() => onAddToCart(product.id)}
                          disabled={!product.in_stock}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium px-2.5 py-1.5 rounded-lg transition-all shadow-md disabled:opacity-50"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 backdrop-blur-xl border rounded-xl ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-blue-200'
            }`}>
              <p className={`text-sm mb-3 ${isDark ? 'text-blue-200/60' : 'text-blue-600'}`}>
                {t.productGrid.noProducts}
              </p>
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-lg transition-all text-sm ${
                  isDark ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                }`}
              >
                {language === 'ru' ? '← Все категории' : '← Barcha kategoriyalar'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Показываем категории
  return (
    <div className={`min-h-screen pt-14 sm:pt-16 md:pt-20 transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900'
        : 'bg-gradient-to-br from-blue-100 via-white to-blue-50'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6">
        {/* Banner Slider */}
        <BannerSlider isDark={isDark} />

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 bg-clip-text text-transparent ${
            isDark
              ? 'bg-gradient-to-r from-blue-100 via-white to-blue-100'
              : 'bg-gradient-to-r from-blue-700 via-blue-900 to-blue-700'
          }`}>
            {t.categoriesPage.title}
          </h1>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-blue-200/80' : 'text-blue-700'}`}>
            {t.categoriesPage.subtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className="group relative text-left"
            >
              <div className={`absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isDark ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10' : 'bg-gradient-to-br from-blue-400/40 to-blue-500/30'
              }`}></div>

              <div className={`relative backdrop-blur-xl border rounded-xl p-3 sm:p-4 shadow-lg transition-all duration-300 sm:hover:-translate-y-1 ${
                isDark
                  ? 'bg-white/10 border-white/20 hover:shadow-blue-500/20'
                  : 'bg-white border-blue-200 hover:shadow-blue-300/50'
              }`}>
                <div className="flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>

                  {/* Name */}
                  <h2 className={`text-xs sm:text-sm font-bold mb-0.5 transition-colors line-clamp-2 ${
                    isDark ? 'text-white group-hover:text-blue-300' : 'text-blue-900 group-hover:text-blue-600'
                  }`}>
                    {getCategoryName(category, language)}
                  </h2>

                  {/* Product count */}
                  <p className={`text-[10px] sm:text-xs ${isDark ? 'text-blue-200/70' : 'text-blue-600'}`}>
                    {products.filter(p => p.category_id === category.id).length} {t.categoriesPage.productsCount || "ta mahsulot"}
                  </p>

                  {/* Arrow */}
                  <div className={`mt-1.5 inline-flex items-center text-[10px] sm:text-xs font-medium ${
                    isDark ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    <span className="hidden sm:inline">{t.categoriesPage.viewProducts}</span>
                    <svg className="w-3 h-3 sm:ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-5 sm:mt-6 text-center">
          <Link
            to="/"
            className={`inline-flex items-center backdrop-blur-xl border font-medium px-4 py-2 rounded-lg transition-all shadow-md text-xs sm:text-sm ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                : 'bg-white hover:bg-blue-50 border-blue-300 text-blue-700'
            }`}
          >
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.categoriesPage.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
