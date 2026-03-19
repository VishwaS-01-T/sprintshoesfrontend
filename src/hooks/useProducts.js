import { useState, useEffect, useCallback } from "react";
import { productApi } from "../constants/products";

/**
 * Custom hook for fetching products with filters
 * Easy to replace with actual API integration
 */
export function useProducts(initialFilters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await productApi.getProducts(filters);
      setProducts(result.products);
      setTotal(result.total);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ category: "all", sort: "featured" });
  }, []);

  return {
    products,
    loading,
    error,
    total,
    filters,
    updateFilters,
    resetFilters,
    setFilters, // Expose for direct filter setting
    refetch: fetchProducts,
  };
}

/**
 * Custom hook for fetching a single product
 */
export function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await productApi.getProductById(productId);
        setProduct(result);
      } catch (err) {
        setError(err.message || "Failed to fetch product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
}

/**
 * Custom hook for fetching related products
 */
export function useRelatedProducts(productId, limit = 4) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchRelated = async () => {
      setLoading(true);
      try {
        const result = await productApi.getRelatedProducts(productId, limit);
        setProducts(result);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [productId, limit]);

  return { products, loading };
}
