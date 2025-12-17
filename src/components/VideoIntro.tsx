import { useState, useEffect, useRef } from 'react';

interface VideoIntroProps {
  onComplete: () => void;
  videoSrc?: string;
  maxDuration?: number;
}

export function VideoIntro({ 
  onComplete, 
  videoSrc = '/intro.mp4',
  maxDuration = 15
}: VideoIntroProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Проверяем мобилка или нет
    const checkMobile = window.innerWidth < 640;
    setIsMobile(checkMobile);
    
    // На мобилке - сразу пропускаем
    if (checkMobile) {
      setIsVisible(false);
      onComplete();
      return;
    }

    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    
    if (hasSeenIntro) {
      setIsVisible(false);
      onComplete();
      return;
    }

    timerRef.current = setTimeout(() => {
      handleClose();
    }, maxDuration * 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [maxDuration, onComplete]);

  const handleClose = () => {
    if (isFading) return;
    
    setIsFading(true);
    sessionStorage.setItem('hasSeenIntro', 'true');
    
    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 500);
  };

  if (!isVisible || isMobile) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black overflow-hidden transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Видео - сплошной на весь экран */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={handleClose}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Skip Button */}
      <button
        onClick={handleClose}
        className="absolute bottom-8 right-8 z-30 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white font-medium border border-white/30 transition-all"
      >
        O'tkazish →
      </button>

      {/* Click to skip */}
      <div className="absolute inset-0 z-20" onClick={handleClose} />
    </div>
  );
}
