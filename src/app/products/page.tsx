"use client";

import { useEffect, useState, Suspense } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import WishlistButton from "../../components/WishlistButton";
import Footer from "../../components/Footer";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  stock: number;
  category_id: string;
  is_featured: boolean;
  category?: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    const categorySlug = searchParams?.get("category");
    if (categorySlug) {
      const category = categories.find((cat) => cat.slug === categorySlug);
      if (category) {
        setSelectedCategory(category.name);
      }
    } else {
      setSelectedCategory(null);
    }
  }, [searchParams, categories]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("خطأ في جلب الفئات:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(name, slug)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("خطأ في جلب المنتجات:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category?.name === selectedCategory)
    : products;

  const handleCategoryClick = (categorySlug: string | null) => {
    if (categorySlug) {
      router.push(`/products?category=${categorySlug}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#101922]">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            جميع المنتجات
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            تصفح مجموعتنا الكاملة من المنتجات
          </p>
        </div>

        {/* Categories Filter */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              !selectedCategory
                ? "bg-[#e60000] text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            الكل
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.name
                  ? "bg-[#e60000] text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e60000]"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              لا توجد منتجات في هذه الفئة
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-[#182635] rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow relative group"
              >
                {/* Wishlist Button */}
                <div className="absolute top-2 left-2 z-10">
                  <WishlistButton productId={product.id} />
                </div>

                {/* Discount Badge */}
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {Math.round(
                      ((product.compare_at_price - product.price) / product.compare_at_price) * 100
                    )}
                    % خصم
                  </div>
                )}

                <Link href={`/products/${product.slug || product.id}`}>
                  {/* Product Image */}
                  <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                          className="w-16 h-16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {product.title}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-[#e60000]">
                        {product.price.toFixed(2)} جنيه
                      </span>
                      {product.compare_at_price && product.compare_at_price > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.compare_at_price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    {product.stock === 0 && (
                      <p className="text-xs text-red-500 mt-1">نفذت الكمية</p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e60000]"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
