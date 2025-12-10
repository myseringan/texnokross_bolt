import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { CartItem, Product } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: (CartItem & { product: Product })[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  total: number;
}

export function Cart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, total }: CartProps) {
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      <div className="absolute right-0 top-0 bottom-0 w-full max-w-[100vw] sm:max-w-md animate-in slide-in-from-right duration-300">
        <div className="h-full backdrop-blur-2xl bg-gradient-to-br from-blue-950/98 via-slate-900/98 to-blue-950/98 border-l border-white/10 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{t.cart.cart}</h2>
                <p className="text-blue-200/70 text-xs">{cartItems.length} {t.cart.items}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="backdrop-blur-xl bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 p-2 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-full p-6 mb-4">
                  <ShoppingBag className="w-12 h-12 text-blue-300/50" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t.cart.emptyCart}</h3>
                <p className="text-sm text-blue-200/60">{t.cart.addFromCatalog}</p>
              </div>
            ) : (
              cartItems.map(item => (
                <div 
                  key={item.id} 
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-3 shadow-xl"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white mb-1 line-clamp-2 text-sm leading-tight">
                        {item.product.name}
                      </h3>
                      <p className="text-blue-100 font-bold text-sm mb-2">
                        {item.product.price.toLocaleString('uz-UZ')} UZS
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-white/20 active:bg-white/30 rounded-l-lg transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 text-white" />
                          </button>
                          <span className="text-white font-semibold px-3 text-sm min-w-[32px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-white/20 active:bg-white/30 rounded-r-lg transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-2 hover:bg-red-500/20 active:bg-red-500/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-white/10 p-4 space-y-4 flex-shrink-0 bg-gradient-to-t from-blue-950/50">
              <div className="flex justify-between items-center">
                <span className="text-blue-200 text-base">{t.cart.total}</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
                  {total.toLocaleString('uz-UZ')} UZS
                </span>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white font-bold py-3.5 rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-200 text-sm">
                {t.cart.checkout}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
