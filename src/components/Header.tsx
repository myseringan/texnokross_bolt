import { ShoppingCart, Zap } from 'lucide-react';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export function Header({ cartItemCount, onCartClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gradient-to-r from-blue-950/80 via-blue-900/70 to-blue-950/80 border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity rounded-full"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 p-3 rounded-2xl shadow-2xl transform group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-100 via-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">
                Texnokross
              </h1>
              <p className="text-xs text-blue-200/80 tracking-wider">Бытовая техника премиум класса</p>
            </div>
          </div>

          <button
            onClick={onCartClick}
            className="relative group"
          >
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity rounded-full"></div>
            <div className="relative backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl px-6 py-3 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-6 h-6 text-white" strokeWidth={2} />
                {cartItemCount > 0 && (
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
