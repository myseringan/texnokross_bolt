import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  link?: string;
  type: 'sale' | 'new' | 'delivery' | 'custom';
  active: boolean;
  created_at: string;
}

const BANNERS_STORAGE_KEY = 'texnokross_banners';

// Дефолтные баннеры
const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'banner_1',
    title: 'Chegirmalar 20% gacha!',
    subtitle: 'Barcha maishiy texnikaga maxsus narxlar',
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop&auto=format',
    type: 'sale',
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'banner_2',
    title: 'Yangi kelgan mahsulotlar',
    subtitle: '2025 yilgi eng so\'nggi modellar',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop&auto=format',
    type: 'new',
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'banner_3',
    title: 'Bepul yetkazib berish',
    subtitle: 'Navoiy shahar bo\'ylab bepul yetkazib beramiz',
    image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=400&fit=crop&auto=format',
    type: 'delivery',
    active: true,
    created_at: new Date().toISOString(),
  },
];

// Функция загрузки баннеров
export function loadBanners(): Banner[] {
  try {
    const stored = localStorage.getItem(BANNERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading banners:', e);
  }
  // Сохраняем дефолтные при первом запуске
  localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(DEFAULT_BANNERS));
  return DEFAULT_BANNERS;
}

// Функция сохранения баннеров
export function saveBanners(banners: Banner[]) {
  localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(banners));
}

interface BannerSliderProps {
  isDark: boolean;
}

export function BannerSlider({ isDark }: BannerSliderProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const allBanners = loadBanners();
    const activeBanners = allBanners.filter(b => b.active);
    setBanners(activeBanners);
  }, []);

  // Автопрокрутка
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  const goToPrev = () => {
    setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % banners.length);
  };

  // Цвета по типу баннера
  const getGradient = (type: string) => {
    switch (type) {
      case 'sale':
        return isDark 
          ? 'from-red-600/90 via-orange-600/80 to-red-700/90' 
          : 'from-red-500/90 via-orange-500/80 to-red-600/90';
      case 'new':
        return isDark 
          ? 'from-blue-600/90 via-indigo-600/80 to-blue-700/90' 
          : 'from-blue-500/90 via-indigo-500/80 to-blue-600/90';
      case 'delivery':
        return isDark 
          ? 'from-green-600/90 via-emerald-600/80 to-green-700/90' 
          : 'from-green-500/90 via-emerald-500/80 to-green-600/90';
      default:
        return isDark 
          ? 'from-blue-600/90 via-purple-600/80 to-blue-700/90' 
          : 'from-blue-500/90 via-purple-500/80 to-blue-600/90';
    }
  };

  const getBadge = (type: string) => {
    switch (type) {
      case 'sale': return '🔥 Aksiya';
      case 'new': return '✨ Yangi';
      case 'delivery': return '🚚 Yetkazish';
      default: return '📢 E\'lon';
    }
  };

  return (
    <div className="relative w-full mb-8 sm:mb-12">
      {/* Main Banner */}
      <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl ${
        isDark ? 'shadow-blue-500/20' : 'shadow-blue-300/30'
      }`}>
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={currentBanner.image_url} 
            alt={currentBanner.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${getGradient(currentBanner.type)}`}></div>

        {/* Content */}
        <div className="relative z-10 px-6 py-8 sm:px-12 sm:py-16">
          {/* Badge */}
          <div className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            {getBadge(currentBanner.type)}
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg">
            {currentBanner.title}
          </h2>

          {/* Subtitle */}
          <p className="text-white/90 text-sm sm:text-lg md:text-xl max-w-xl drop-shadow">
            {currentBanner.subtitle}
          </p>

          {/* Link Button (if exists) */}
          {currentBanner.link && (
            <a
              href={currentBanner.link}
              className="inline-block mt-4 sm:mt-6 px-6 py-2.5 sm:px-8 sm:py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
            >
              Batafsil →
            </a>
          )}
        </div>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white w-6 sm:w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
