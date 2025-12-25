import { Sparkles, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

export function Hero() {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  return (
    <div className={`relative min-h-[60vh] sm:min-h-[50vh] lg:min-h-[45vh] flex items-center justify-center overflow-hidden transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900'
        : 'bg-gradient-to-br from-blue-100 via-white to-blue-50'
    }`}>
      <div className="absolute inset-0">
        <div className={`absolute top-5 left-5 sm:top-10 sm:left-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full blur-3xl animate-pulse ${
          isDark ? 'bg-blue-500/30' : 'bg-blue-400/20'
        }`}></div>
        <div className={`absolute bottom-5 right-5 sm:bottom-10 sm:right-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full blur-3xl animate-pulse delay-1000 ${
          isDark ? 'bg-blue-600/20' : 'bg-blue-300/20'
        }`}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 text-center">
        <div className={`backdrop-blur-2xl border rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl transition-colors duration-300 ${
          isDark
            ? 'bg-white/5 border-white/10'
            : 'bg-white/70 border-blue-200/50'
        }`}>
          <div className={`inline-flex items-center space-x-2 backdrop-blur-xl border rounded-full px-3 py-1 sm:py-1.5 mb-3 sm:mb-4 ${
            isDark
              ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-400/30'
              : 'bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300/50'
          }`}>
            <Sparkles className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
            <span className={`text-[10px] sm:text-xs font-medium tracking-wide ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>{t.hero.premiumQuality}</span>
          </div>

          <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 bg-clip-text text-transparent leading-tight ${
            isDark
              ? 'bg-gradient-to-r from-blue-100 via-white to-blue-100'
              : 'bg-gradient-to-r from-blue-700 via-blue-900 to-blue-700'
          }`}>
            {t.hero.modernTech}
          </h2>

          <p className={`text-xs sm:text-sm lg:text-base mb-4 sm:mb-5 max-w-2xl mx-auto leading-relaxed px-2 ${
            isDark ? 'text-blue-100/90' : 'text-blue-800/80'
          }`}>
            {t.hero.description}
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-5">
            <div className={`backdrop-blur-xl border rounded-xl px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 transition-all duration-300 shadow-lg flex-1 min-w-[80px] max-w-[110px] sm:max-w-[130px] ${
              isDark
                ? 'bg-white/10 border-white/20 hover:bg-white/15'
                : 'bg-white/80 border-blue-200 hover:bg-blue-50'
            }`}>
              <TrendingUp className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
              <div className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>5000+</div>
              <div className={`text-[9px] sm:text-[10px] leading-tight ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>{t.hero.happyClients}</div>
            </div>

            <div className={`backdrop-blur-xl border rounded-xl px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 transition-all duration-300 shadow-lg flex-1 min-w-[80px] max-w-[110px] sm:max-w-[130px] ${
              isDark
                ? 'bg-white/10 border-white/20 hover:bg-white/15'
                : 'bg-white/80 border-blue-200 hover:bg-blue-50'
            }`}>
              <Award className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
              <div className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>100%</div>
              <div className={`text-[9px] sm:text-[10px] leading-tight ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>{t.hero.qualityGuarantee}</div>
            </div>

            <div className={`backdrop-blur-xl border rounded-xl px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 transition-all duration-300 shadow-lg flex-1 min-w-[80px] max-w-[110px] sm:max-w-[130px] ${
              isDark
                ? 'bg-white/10 border-white/20 hover:bg-white/15'
                : 'bg-white/80 border-blue-200 hover:bg-blue-50'
            }`}>
              <Sparkles className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
              <div className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>24/7</div>
              <div className={`text-[9px] sm:text-[10px] leading-tight ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>{t.hero.support}</div>
            </div>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white font-semibold px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 rounded-xl shadow-xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            <span>{t.header.toShop}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
