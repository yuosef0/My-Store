// src/app/cart/page.tsx
"use client";

import { useCart } from "../../contexts/CartContext";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    // هنضيف الدفع بـ Stripe لاحقاً
    setTimeout(() => {
      alert("جاري تطوير نظام الدفع...");
      setIsProcessing(false);
    }, 1000);
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold mb-2">السلة فارغة</h1>
          <p className="text-gray-600 mb-6">لم تقم بإضافة أي منتجات بعد</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            تصفح المنتجات
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              ← العودة للمتجر
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">🛒 سلة التسوق</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-6 flex gap-4"
              >
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      📦
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-blue-600 font-semibold mb-3">
                    {item.price.toFixed(2)} ج.م
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-500 ml-2">
                      (متوفر: {item.stock})
                    </span>
                  </div>
                </div>

                {/* Remove & Total */}
                <div className="flex flex-col justify-between items-end">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    ✕ حذف
                  </button>
                  <p className="font-bold text-lg">
                    {(item.price * item.quantity).toFixed(2)} ج.م
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span>{totalPrice.toFixed(2)} ج.م</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>رسوم الشحن</span>
                  <span>مجاناً</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>الإجمالي</span>
                  <span className="text-blue-600">{totalPrice.toFixed(2)} ج.م</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {isProcessing ? "جارٍ المعالجة..." : "إتمام الطلب"}
              </button>

              <Link
                href="/"
                className="block text-center text-blue-600 hover:underline mt-4"
              >
                متابعة التسوق
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}