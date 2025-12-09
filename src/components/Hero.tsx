import { Sparkles, TrendingUp, Award } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-12 shadow-2xl">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-400/30 rounded-full px-6 py-2 mb-8">
            <Sparkles className="w-5 h-5 text-blue-300" />
            <span className="text-blue-200 text-sm font-medium tracking-wide">Премиум качество</span>
          </div>

          <h2 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-100 via-white to-blue-100 bg-clip-text text-transparent leading-tight">
            Современная техника
            <br />
            для вашего дома
          </h2>

          <p className="text-xl text-blue-100/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Откройте для себя мир инновационной бытовой техники от ведущих мировых брендов.
            Качество, стиль и передовые технологии в каждом продукте.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-8 py-4 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 shadow-xl">
              <TrendingUp className="w-8 h-8 text-blue-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">5000+</div>
              <div className="text-sm text-blue-200">Довольных клиентов</div>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-8 py-4 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 shadow-xl">
              <Award className="w-8 h-8 text-blue-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-blue-200">Гарантия качества</div>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-8 py-4 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 shadow-xl">
              <Sparkles className="w-8 h-8 text-blue-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-blue-200">Поддержка</div>
            </div>
          </div>

          <a
            href="#products"
            className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-12 py-4 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Смотреть каталог
          </a>
        </div>
      </div>
    </div>
  );
}
