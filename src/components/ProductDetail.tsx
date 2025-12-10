import { X, ShoppingCart, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Product } from '../types';

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: string) => void;
}

export function ProductDetail({ product, isOpen, onClose, onAddToCart }: ProductDetailProps) {
  const { t } = useLanguage();
  
  if (!isOpen || !product) return null;

  const specs = product.specifications as Record<string, string>;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain">
      <div className="flex items-start sm:items-center justify-center min-h-screen p-0 sm:p-4">
        <div
          className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="relative w-full sm:max-w-4xl backdrop-blur-2xl bg-gradient-to-br from-blue-950/98 via-slate-900/98 to-blue-950/98 sm:border border-white/10 sm:rounded-3xl shadow-2xl overflow-hidden min-h-screen sm:min-h-0 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10 backdrop-blur-xl bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 p-2 rounded-xl transition-all duration-200"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-8 p-4 sm:p-8">
            {/* Image */}
            <div className="relative pt-10 sm:pt-0">
              <div className="relative h-56 sm:h-96 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"></div>

                {product.in_stock && (
                  <div className="absolute top-3 right-3 backdrop-blur-xl bg-green-500/90 border border-green-400/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-xl">
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.productDetail.inStock}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <h2 className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-4 leading-tight pr-8 sm:pr-0">
                {product.name}
              </h2>

              <p className="text-blue-100/80 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Specifications */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-xl">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3">{t.productDetail.specifications}</h3>
                <div className="space-y-2">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-white/10 pb-2 text-sm">
                      <span className="text-blue-200/70">{key}</span>
                      <span className="text-blue-100 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price and Button */}
              <div className="mt-auto">
                <div className="mb-4">
                  <div className="text-xs text-blue-200/60 mb-1">{t.productDetail.price}</div>
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
                    {product.price.toLocaleString('ru-RU')} сўм
                  </div>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(product.id);
                    onClose();
                  }}
                  disabled={!product.in_stock}
                  className="w-full backdrop-blur-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.in_stock ? t.productDetail.addToCart : t.productDetail.outOfStock}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
