// src/app/cart/page.tsx
"use client";

import { useCart } from "../../contexts/CartContext";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [couponValidating, setCouponValidating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    message: string;
  } | null>(null);
  const [couponError, setCouponError] = useState("");

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!customerInfo.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    }
    if (!customerInfo.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }
    if (!customerInfo.address.trim()) {
      newErrors.address = "العنوان مطلوب";
    }
    if (!customerInfo.city.trim()) {
      newErrors.city = "المدينة مطلوبة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // التحقق من الكوبون
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("الرجاء إدخال كود الكوبون");
      return;
    }

    setCouponValidating(true);
    setCouponError("");

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim().toUpperCase(),
          total: totalPrice,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setAppliedCoupon({
          code: couponCode.trim().toUpperCase(),
          discount: data.discount,
          message: data.message,
        });
        setCouponError("");
      } else {
        setCouponError(data.message || "الكوبون غير صالح");
        setAppliedCoupon(null);
      }
    } catch (error) {
      console.error("خطأ في التحقق من الكوبون:", error);
      setCouponError("حدث خطأ في التحقق من الكوبون");
      setAppliedCoupon(null);
    } finally {
      setCouponValidating(false);
    }
  };

  // إلغاء الكوبون
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  // حساب المجموع النهائي
  const finalTotal = appliedCoupon
    ? Math.max(totalPrice - appliedCoupon.discount, 0)
    : totalPrice;

  const handleCheckout = async () => {
    if (!validateForm()) {
      alert("يرجى إكمال جميع الحقول المطلوبة");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          customerInfo,
          coupon: appliedCoupon
            ? {
                code: appliedCoupon.code,
                discount: appliedCoupon.discount,
              }
            : null,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // توجيه المستخدم إلى صفحة الدفع في Stripe
        window.location.href = data.url;
      } else {
        alert(data.error || "حدث خطأ في معالجة الطلب");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("خطأ في الاتصال:", error);
      alert("حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى");
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    // إزالة رسالة الخطأ عند الكتابة
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
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

          {/* Order Summary & Customer Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Customer Information Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">معلومات الشحن</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="أدخل اسمك الكامل"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+20 123 456 7890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="الشارع، رقم المنزل، الحي"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المدينة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="القاهرة، الإسكندرية، إلخ"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">🎟️ كود الخصم</h2>

              {!appliedCoupon ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      placeholder="أدخل كود الكوبون"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponValidating || !couponCode.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition whitespace-nowrap"
                    >
                      {couponValidating ? "جارٍ التحقق..." : "تطبيق"}
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-red-600 text-sm">{couponError}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-green-800">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-sm text-green-600">
                        خصم {appliedCoupon.discount.toFixed(2)} ج.م
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      إلغاء
                    </button>
                  </div>
                  <p className="text-sm text-green-600">✓ {appliedCoupon.message}</p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span>{totalPrice.toFixed(2)} ج.م</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>الخصم ({appliedCoupon.code})</span>
                    <span>- {appliedCoupon.discount.toFixed(2)} ج.م</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>رسوم الشحن</span>
                  <span>مجاناً</span>
                </div>

                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>الإجمالي</span>
                  <span className="text-blue-600">{finalTotal.toFixed(2)} ج.م</span>
                </div>

                {appliedCoupon && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                    <p className="text-green-800">
                      🎉 وفرت {appliedCoupon.discount.toFixed(2)} ج.م
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {isProcessing ? "جارٍ التحويل للدفع..." : "متابعة للدفع 💳"}
              </button>

              <Link
                href="/"
                className="block text-center text-blue-600 hover:underline mt-4"
              >
                متابعة التسوق
              </Link>

              <p className="text-xs text-gray-500 text-center mt-4">
                الدفع الآمن عبر Stripe 🔒
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
