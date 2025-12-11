import { useState, useRef } from 'react';
import { 
  X, Plus, Trash2, Save, Image as ImageIcon, 
  Eye, EyeOff, GripVertical, Tag, Truck, Sparkles, Megaphone
} from 'lucide-react';
import { Banner, loadBanners, saveBanners } from './BannerSlider';

interface BannerManagerProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const BANNER_TYPES = [
  { value: 'sale', label: 'Aksiya / Chegirma', icon: Tag, color: 'red' },
  { value: 'new', label: 'Yangi mahsulot', icon: Sparkles, color: 'blue' },
  { value: 'delivery', label: 'Yetkazib berish', icon: Truck, color: 'green' },
  { value: 'custom', label: 'Boshqa', icon: Megaphone, color: 'purple' },
];

export function BannerManager({ isOpen, onClose, isDark }: BannerManagerProps) {
  const [banners, setBanners] = useState<Banner[]>(() => loadBanners());
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link: '',
    type: 'sale' as Banner['type'],
  });

  if (!isOpen) return null;

  const resetForm = () => {
    setForm({
      title: '',
      subtitle: '',
      image_url: '',
      link: '',
      type: 'sale',
    });
    setEditingBanner(null);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setForm({
      title: '',
      subtitle: '',
      image_url: '',
      link: '',
      type: 'sale',
    });
    setEditingBanner(null);
    setIsAdding(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setIsAdding(true);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle,
      image_url: banner.image_url,
      link: banner.link || '',
      type: banner.type,
    });
  };

  const handleSave = () => {
    if (!form.title || !form.image_url) return;

    let updatedBanners: Banner[];

    if (editingBanner) {
      // Update existing
      updatedBanners = banners.map(b => 
        b.id === editingBanner.id 
          ? { ...b, ...form }
          : b
      );
    } else {
      // Add new
      const newBanner: Banner = {
        id: `banner_${Date.now()}`,
        ...form,
        active: true,
        created_at: new Date().toISOString(),
      };
      updatedBanners = [newBanner, ...banners];
    }

    setBanners(updatedBanners);
    saveBanners(updatedBanners);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const updatedBanners = banners.filter(b => b.id !== id);
    setBanners(updatedBanners);
    saveBanners(updatedBanners);
  };

  const toggleActive = (id: string) => {
    const updatedBanners = banners.map(b => 
      b.id === id ? { ...b, active: !b.active } : b
    );
    setBanners(updatedBanners);
    saveBanners(updatedBanners);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Rasm 5MB dan kichik bo\'lishi kerak');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image_url: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start sm:items-center justify-center min-h-screen p-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className={`relative w-full max-w-4xl backdrop-blur-2xl border rounded-2xl shadow-2xl overflow-hidden ${
          isDark 
            ? 'bg-slate-900/95 border-white/20' 
            : 'bg-white border-blue-200'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${
            isDark ? 'border-white/10' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Bannerlar
                </h2>
                <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-gray-500'}`}>
                  Reklama bannerlarini boshqarish
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all ${
                isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
            {/* Add/Edit Form */}
            {isAdding ? (
              <div className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {editingBanner ? 'Bannerni tahrirlash' : 'Yangi banner'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div>
                    <label className={`block text-sm mb-1 ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>
                      Sarlavha *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Chegirmalar 20% gacha!"
                      className={`w-full px-4 py-2.5 rounded-xl border transition-all ${
                        isDark 
                          ? 'bg-white/10 border-white/20 text-white placeholder-white/30 focus:border-blue-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                      }`}
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className={`block text-sm mb-1 ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>
                      Qo'shimcha matn
                    </label>
                    <input
                      type="text"
                      value={form.subtitle}
                      onChange={(e) => setForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Barcha texnikaga maxsus narxlar"
                      className={`w-full px-4 py-2.5 rounded-xl border transition-all ${
                        isDark 
                          ? 'bg-white/10 border-white/20 text-white placeholder-white/30 focus:border-blue-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                      }`}
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className={`block text-sm mb-1 ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>
                      Turi
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {BANNER_TYPES.map(type => {
                        const isSelected = form.type === type.value;
                        const colorClasses = {
                          red: isSelected 
                            ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                            : '',
                          blue: isSelected 
                            ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                            : '',
                          green: isSelected 
                            ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                            : '',
                          purple: isSelected 
                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' 
                            : '',
                        };
                        return (
                        <button
                          key={type.value}
                          onClick={() => setForm(prev => ({ ...prev, type: type.value as Banner['type'] }))}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                            isSelected
                              ? colorClasses[type.color as keyof typeof colorClasses]
                              : isDark 
                                ? 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10' 
                                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <type.icon className="w-4 h-4" />
                          <span className="text-sm">{type.label}</span>
                        </button>
                      )})}
                    </div>
                  </div>

                  {/* Link */}
                  <div>
                    <label className={`block text-sm mb-1 ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>
                      Havola (ixtiyoriy)
                    </label>
                    <input
                      type="text"
                      value={form.link}
                      onChange={(e) => setForm(prev => ({ ...prev, link: e.target.value }))}
                      placeholder="https://..."
                      className={`w-full px-4 py-2.5 rounded-xl border transition-all ${
                        isDark 
                          ? 'bg-white/10 border-white/20 text-white placeholder-white/30 focus:border-blue-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                      }`}
                    />
                  </div>

                  {/* Image */}
                  <div className="sm:col-span-2">
                    <label className={`block text-sm mb-1 ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>
                      Rasm *
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {form.image_url ? (
                      <div className="relative rounded-xl overflow-hidden h-40">
                        <img 
                          src={form.image_url} 
                          alt="Banner preview" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                        >
                          Rasmni o'zgartirish
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full py-8 border-2 border-dashed rounded-xl transition-all ${
                          isDark 
                            ? 'border-white/20 hover:border-white/40 text-white/60' 
                            : 'border-gray-300 hover:border-blue-400 text-gray-400'
                        }`}
                      >
                        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                        <span>Rasm yuklash (1200x400 tavsiya etiladi)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={resetForm}
                    className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                      isDark 
                        ? 'bg-white/10 hover:bg-white/20 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!form.title || !form.image_url}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 rounded-xl disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    Saqlash
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed transition-all mb-6 ${
                  isDark 
                    ? 'border-blue-400/30 hover:border-blue-400/50 text-blue-300 hover:bg-blue-500/10' 
                    : 'border-blue-300 hover:border-blue-400 text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span>Yangi banner qo'shish</span>
              </button>
            )}

            {/* Banners List */}
            <div className="space-y-3">
              {banners.map((banner) => {
                const typeInfo = BANNER_TYPES.find(t => t.value === banner.type);
                const badgeColor = {
                  sale: 'bg-red-500/20 text-red-400',
                  new: 'bg-blue-500/20 text-blue-400',
                  delivery: 'bg-green-500/20 text-green-400',
                  custom: 'bg-purple-500/20 text-purple-400',
                }[banner.type];
                
                return (
                  <div
                    key={banner.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isDark 
                        ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                        : 'bg-white border-gray-200 hover:shadow-md'
                    } ${!banner.active ? 'opacity-50' : ''}`}
                  >
                    {/* Drag Handle */}
                    <div className={`cursor-move ${isDark ? 'text-white/30' : 'text-gray-300'}`}>
                      <GripVertical className="w-5 h-5" />
                    </div>

                    {/* Thumbnail */}
                    <div className="w-24 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={banner.image_url} 
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${badgeColor}`}>
                          {typeInfo?.label}
                        </span>
                      </div>
                      <h4 className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {banner.title}
                      </h4>
                      <p className={`text-sm truncate ${isDark ? 'text-blue-200/60' : 'text-gray-500'}`}>
                        {banner.subtitle}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(banner.id)}
                        className={`p-2 rounded-lg transition-all ${
                          banner.active
                            ? 'bg-green-500/20 text-green-500'
                            : isDark ? 'bg-white/10 text-white/40' : 'bg-gray-100 text-gray-400'
                        }`}
                        title={banner.active ? 'Faol' : 'Nofaol'}
                      >
                        {banner.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(banner)}
                        className={`p-2 rounded-lg transition-all ${
                          isDark 
                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className={`p-2 rounded-lg transition-all ${
                          isDark 
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {banners.length === 0 && (
                <div className={`text-center py-12 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Hozircha bannerlar yo'q</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={`flex justify-end p-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl"
            >
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
