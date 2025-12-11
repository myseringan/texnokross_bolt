import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../types';

const LOCAL_PRODUCTS_KEY = 'texnokross_local_products';
const LOCAL_CATEGORIES_KEY = 'texnokross_local_categories';
const DELETED_PRODUCTS_KEY = 'texnokross_deleted_products';

// Дефолтные категории
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Kir yuvish mashinalari', slug: 'washing-machines', created_at: new Date().toISOString() },
  { id: 'cat_2', name: 'Muzlatgichlar', slug: 'refrigerators', created_at: new Date().toISOString() },
  { id: 'cat_3', name: 'Konditsionerlar', slug: 'air-conditioners', created_at: new Date().toISOString() },
  { id: 'cat_4', name: 'Televizorlar', slug: 'tvs', created_at: new Date().toISOString() },
  { id: 'cat_5', name: 'Changyutgichlar', slug: 'vacuum-cleaners', created_at: new Date().toISOString() },
  { id: 'cat_6', name: 'Mikroto\'lqinli pechlar', slug: 'microwaves', created_at: new Date().toISOString() },
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
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
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
    
    setProducts(prev => {
      // Фильтруем локальные товары
      const filteredLocal = localProducts.filter(p => !deletedIds.has(p.id));
      // Фильтруем остальные товары (из Supabase)
      const nonLocalProducts = prev.filter(p => !p.id.startsWith('local_') && !deletedIds.has(p.id));
      
      // Объединяем
      const localIds = new Set(filteredLocal.map(p => p.id));
      return [
        ...filteredLocal,
        ...nonLocalProducts.filter(p => !localIds.has(p.id))
      ];
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsResult, categoriesResult] = await Promise.all([
          supabase.from('products').select('*').order('created_at', { ascending: false }),
          supabase.from('categories').select('*').order('name')
        ]);

        // Категории
        if (categoriesResult.data && categoriesResult.data.length > 0) {
          setCategories(categoriesResult.data as Category[]);
        } else {
          setCategories(getLocalCategories());
        }

        // Загружаем локальные товары и удалённые ID
        const localProducts = getLocalProducts();
        const deletedIds = new Set(getDeletedIds());

        // Объединяем: локальные имеют приоритет, фильтруем удалённые
        const supabaseProducts = productsResult.data || [];
        const localIds = new Set(localProducts.map(p => p.id));
        const mergedProducts = [
          ...localProducts.filter(p => !deletedIds.has(p.id)),
          ...supabaseProducts.filter(p => !localIds.has(p.id) && !deletedIds.has(p.id))
        ];

        setProducts(mergedProducts as Product[]);
      } catch (err) {
        // Если Supabase недоступен, используем только локальные
        const deletedIds = new Set(getDeletedIds());
        setProducts(getLocalProducts().filter(p => !deletedIds.has(p.id)));
        setCategories(getLocalCategories());
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
