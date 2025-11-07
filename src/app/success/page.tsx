"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // يمكن إضافة API call هنا لجلب تفاصيل الطلب من قاعدة البيانات
      // باستخدام session_id
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      // مسح السلة من localStorage بعد نجاح الدفع
      localStorage.removeItem("cart");
    }
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {isLoading ? (
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">جارٍ التحقق من الدفع...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Icon */}
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                تم الدفع بنجاح!
              </h1>
              <p className="text-gray-600">
                شكراً لك! تم استلام طلبك وسيتم شحنه قريباً.
              </p>
            </div>

            {/* Order Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">رقم الجلسة:</span>
                <span className="font-mono text-xs text-gray-800">
                  {sessionId?.slice(-12)}...
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">الحالة:</span>
                <span className="text-green-600 font-semibold">مدفوع ✓</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-4 text-sm text-gray-600">
              <p className="mb-2">📧 سيتم إرسال تفاصيل الطلب إلى بريدك الإلكتروني</p>
              <p>📦 سيتم شحن طلبك خلال 2-3 أيام عمل</p>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <Link
                href="/"
                className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                العودة للمتجر
              </Link>
              <button
                onClick={() => window.print()}
                className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                طباعة الإيصال 🖨️
              </button>
            </div>

            {/* Contact Support */}
            <p className="text-xs text-gray-500 pt-4">
              هل لديك أسئلة؟{" "}
              <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                تواصل معنا
              </a>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
