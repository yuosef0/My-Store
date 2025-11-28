"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "../../contexts/CartContext";
import Link from "next/link";

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // مسح السلة عند نجاح الطلب
    clearCart();

    // الحصول على orderId من URL أو localStorage
    const orderIdFromUrl = searchParams.get("orderId");
    const orderIdFromStorage = localStorage.getItem("currentOrderId");

    setOrderId(orderIdFromUrl || orderIdFromStorage);

    // مسح orderId من localStorage
    localStorage.removeItem("currentOrderId");
  }, [searchParams, clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* أيقونة النجاح */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* العنوان */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          تم الطلب بنجاح! 🎉
        </h1>

        {/* الوصف */}
        <p className="text-gray-600 mb-6">
          شكراً لك! تم استلام طلبك وسيتم معالجته قريباً.
          {orderId && (
            <span className="block mt-2 text-sm">
              رقم الطلب: <span className="font-mono font-bold">{orderId}</span>
            </span>
          )}
        </p>

        {/* معلومات إضافية */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-right">
          <p className="text-sm text-blue-800">
            📧 تم إرسال تأكيد الطلب إلى بريدك الإلكتروني
          </p>
          <p className="text-sm text-blue-800 mt-2">
            📦 يمكنك متابعة حالة طلبك من صفحة "طلباتي"
          </p>
        </div>

        {/* الأزرار */}
        <div className="space-y-3">
          <Link
            href="/orders"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            عرض طلباتي
          </Link>

          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-pulse">
              <div className="mx-auto w-20 h-20 bg-gray-200 rounded-full mb-6"></div>
              <div className="h-8 bg-gray-200 rounded mb-4 mx-auto max-w-xs"></div>
              <div className="h-4 bg-gray-200 rounded mb-6 mx-auto max-w-sm"></div>
              <div className="h-20 bg-gray-100 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
