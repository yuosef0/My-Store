"use client";

import Link from "next/link";

export default function OrderFailedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* أيقونة الفشل */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* العنوان */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          فشل الدفع
        </h1>

        {/* الوصف */}
        <p className="text-gray-600 mb-6">
          عذراً، حدث خطأ أثناء معالجة عملية الدفع.
          يرجى المحاولة مرة أخرى أو التواصل معنا إذا استمرت المشكلة.
        </p>

        {/* معلومات إضافية */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-right">
          <p className="text-sm text-yellow-800 mb-2">
            💡 الأسباب المحتملة:
          </p>
          <ul className="text-sm text-yellow-800 space-y-1 text-right list-disc list-inside">
            <li>رصيد غير كافٍ في البطاقة</li>
            <li>معلومات بطاقة غير صحيحة</li>
            <li>إلغاء العملية من قبل المستخدم</li>
            <li>مشكلة مؤقتة في الاتصال</li>
          </ul>
        </div>

        {/* الأزرار */}
        <div className="space-y-3">
          <Link
            href="/checkout"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            المحاولة مرة أخرى
          </Link>

          <Link
            href="/cart"
            className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            العودة للسلة
          </Link>

          <Link
            href="/"
            className="block w-full text-gray-600 py-2 hover:text-gray-900 transition"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
