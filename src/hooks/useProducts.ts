import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [productsResult, categoriesResult] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name')
      ]);

      if (productsResult.data) setProducts(productsResult.data as Product[]);
      if (categoriesResult.data) setCategories(categoriesResult.data as Category[]);
      setLoading(false);
    }

    fetchData();
  }, []);

  return { products, categories, loading };
}
