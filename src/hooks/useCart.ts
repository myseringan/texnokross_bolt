import { useState, useEffect } from 'react';
import type { Product } from '../types';

const CART_STORAGE_KEY = 'texnokross_cart';
const LOCAL_PRODUCTS_KEY = 'texnokross_local_products';

interface CartItemLocal {
  id: string;
  productId: string;
  quantity: number;
}

interface CartItemWithProduct {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

// Получаем локальные товары
const getLocalProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Получаем корзину из localStorage
const getCart = (): CartItemLocal[] => {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Сохраняем корзину в localStorage
const saveCart = (cart: CartItemLocal[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Загружаем все товары (для получения информации о товаре)
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Загружаем из Supabase
        const { supabase } = await import('../lib/supabase');
        const { data: supabaseProducts } = await supabase
          .from('products')
          .select('*');
        
        // Загружаем локальные
        const localProducts = getLocalProducts();
        
        // Объединяем
        const localIds = new Set(localProducts.map(p => p.id));
        const merged = [
          ...localProducts,
          ...(supabaseProducts || []).filter(p => !localIds.has(p.id))
        ];
        
        setAllProducts(merged);
        setLoading(false);
      } catch {
        setAllProducts(getLocalProducts());
        setLoading(false);
      }
    };

    loadProducts();

    // Обновляем список товаров каждые 2 секунды
    const interval = setInterval(() => {
      const localProducts = getLocalProducts();
      setAllProducts(prev => {
        const localIds = new Set(localProducts.map(p => p.id));
        const nonLocal = prev.filter(p => !p.id.startsWith('local_'));
        return [...localProducts, ...nonLocal.filter(p => !localIds.has(p.id))];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Загружаем и обновляем корзину
  useEffect(() => {
    const updateCartItems = () => {
      if (allProducts.length === 0) return;

      const cart = getCart();
      const itemsWithProducts: CartItemWithProduct[] = [];

      for (const item of cart) {
        const product = allProducts.find(p => p.id === item.productId);
        if (product) {
          itemsWithProducts.push({
            id: item.id,
            product_id: item.productId,
            quantity: item.quantity,
            product: product
          });
        }
      }

      setCartItems(itemsWithProducts);
    };

    updateCartItems();

    // Проверяем изменения каждую секунду
    const interval = setInterval(updateCartItems, 1000);
    window.addEventListener('storage', updateCartItems);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', updateCartItems);
    };
  }, [allProducts]);

  const addToCart = (productId: string) => {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.productId === productId);

    if (existingIndex >= 0) {
      // Увеличиваем количество
      cart[existingIndex].quantity += 1;
    } else {
      // Добавляем новый товар
      cart.push({
        id: `cart_${Date.now()}`,
        productId: productId,
        quantity: 1
      });
    }

    saveCart(cart);

    // Обновляем state
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      setCartItems(prev => {
        const existingItem = prev.find(item => item.product_id === productId);
        if (existingItem) {
          return prev.map(item =>
            item.product_id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, {
            id: `cart_${Date.now()}`,
            product_id: productId,
            quantity: 1,
            product: product
          }];
        }
      });
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const cart = getCart();
    const item = cart.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      saveCart(cart);
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    const cart = getCart().filter(item => item.id !== itemId);
    saveCart(cart);
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    total,
    itemCount
  };
}
