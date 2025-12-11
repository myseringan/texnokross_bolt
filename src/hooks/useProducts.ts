import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../types';

const LOCAL_PRODUCTS_KEY = 'texnokross_local_products';
const LOCAL_CATEGORIES_KEY = 'texnokross_local_categories';
const DELETED_PRODUCTS_KEY = 'texnokross_deleted_products';

// Дефолтные категории
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Kir yuvish mashinalari', name_ru: 'Стиральные машины', slug: 'washing-machines', created_at: new Date().toISOString() },
  { id: 'cat_2', name: 'Muzlatgichlar', name_ru: 'Холодильники', slug: 'refrigerators', created_at: new Date().toISOString() },
  { id: 'cat_3', name: 'Konditsionerlar', name_ru: 'Кондиционеры', slug: 'air-conditioners', created_at: new Date().toISOString() },
  { id: 'cat_4', name: 'Televizorlar', name_ru: 'Телевизоры', slug: 'tvs', created_at: new Date().toISOString() },
  { id: 'cat_5', name: 'Changyutgichlar', name_ru: 'Пылесосы', slug: 'vacuum-cleaners', created_at: new Date().toISOString() },
  { id: 'cat_6', name: 'Mikroto\'lqinli pechlar', name_ru: 'Микроволновые печи', slug: 'microwaves', created_at: new Date().toISOString() },
];

const getLocalProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const getLocalCategories = (): Category[] => {
  try {
    const data = localStorage.getItem(LOCAL_CATEGORIES_KEY);
    if (data) {
      return JSON.parse(data);
    } else {
      // Сохраняем дефолтные категории при первом запуске
      localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
  } catch {
    return DEFAULT_CATEGORIES;
  }
};

const getDeletedIds = (): string[] => {
  try {
    const data = localStorage.getItem(DELETED_PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    const localProducts = getLocalProducts();
    const deletedIds = new Set(getDeletedIds());
    const filteredLocal = localProducts.filter(p => !deletedIds.has(p.id));
    
    setProducts(filteredLocal);

    // Обновляем категории из localStorage
    setCategories(getLocalCategories());
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Сначала загружаем локальные данные
        const localProducts = getLocalProducts();
        const localCategories = getLocalCategories();
        const deletedIds = new Set(getDeletedIds());

        // Фильтруем удалённые
        const filteredLocalProducts = localProducts.filter(p => !deletedIds.has(p.id));
        
        // Устанавливаем локальные данные
        setProducts(filteredLocalProducts);
        setCategories(localCategories);

        // Пробуем загрузить из Supabase (не блокируем если не работает)
        try {
          const [productsResult, categoriesResult] = await Promise.all([
            supabase.from('products').select('*').order('created_at', { ascending: false }),
            supabase.from('categories').select('*').order('name')
          ]);

          // Если есть данные из Supabase - добавляем их
          if (categoriesResult.data && categoriesResult.data.length > 0) {
            // Объединяем с локальными, локальные имеют приоритет
            const supabaseCategories = categoriesResult.data as Category[];
            const localCatIds = new Set(localCategories.map(c => c.id));
            const mergedCategories = [
              ...localCategories,
              ...supabaseCategories.filter(c => !localCatIds.has(c.id))
            ];
            setCategories(mergedCategories);
          }

          if (productsResult.data && productsResult.data.length > 0) {
            const supabaseProducts = productsResult.data as Product[];
            const localProdIds = new Set(filteredLocalProducts.map(p => p.id));
            const mergedProducts = [
              ...filteredLocalProducts,
              ...supabaseProducts.filter(p => !localProdIds.has(p.id) && !deletedIds.has(p.id))
            ];
            setProducts(mergedProducts);
          }
        } catch (supabaseErr) {
          // Supabase недоступен - используем только локальные данные
          console.log('Supabase unavailable, using local data');
        }
      } catch (err) {
        // Критическая ошибка - используем дефолтные
        setProducts([]);
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Слушаем изменения в localStorage
    const handleStorageChange = () => {
      loadProducts();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Проверяем каждые 2 секунды для синхронизации
    const interval = setInterval(loadProducts, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return { products, categories, loading };
}
