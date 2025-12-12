import { useState, useEffect } from 'react';
import * as api from '../lib/api';
import type { Product, Category } from '../types';

// Дефолтные категории (fallback)
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Kir yuvish mashinalari', name_ru: 'Стиральные машины', slug: 'washing-machines', created_at: new Date().toISOString() },
  { id: 'cat_2', name: 'Muzlatgichlar', name_ru: 'Холодильники', slug: 'refrigerators', created_at: new Date().toISOString() },
  { id: 'cat_3', name: 'Konditsionerlar', name_ru: 'Кондиционеры', slug: 'air-conditioners', created_at: new Date().toISOString() },
  { id: 'cat_4', name: 'Televizorlar', name_ru: 'Телевизоры', slug: 'tvs', created_at: new Date().toISOString() },
  { id: 'cat_5', name: 'Changyutgichlar', name_ru: 'Пылесосы', slug: 'vacuum-cleaners', created_at: new Date().toISOString() },
  { id: 'cat_6', name: "Mikroto'lqinli pechlar", name_ru: 'Микроволновые печи', slug: 'microwaves', created_at: new Date().toISOString() },
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);

      setProducts(productsData || []);
      setCategories(categoriesData?.length > 0 ? categoriesData : DEFAULT_CATEGORIES);
    } catch (err) {
      console.error('Error fetching data:', err);
      // Fallback to defaults
      setProducts([]);
      setCategories(DEFAULT_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { products, categories, loading, refetch: fetchData };
}
