"use client";

import Link from "next/link";

export default function CanceledPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="space-y-6">
          {/* Cancel Icon */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Cancel Message */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              تم إلغاء عملية الدفع
            </h1>
            <p className="text-gray-600">
              لم يتم خصم أي مبلغ من حسابك. منتجاتك لا تزال في السلة.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm">
            <p className="text-orange-800">
              💡 <strong>لم تكمل عملية الدفع؟</strong>
            </p>
            <p className="text-orange-700 mt-2">
              لا تقلق! يمكنك العودة إلى السلة وإتمام الطلب في أي وقت.
            </p>
          </div>

          {/* Reasons (Optional) */}
          <div className="text-right text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
            <p className="font-semibold mb-2">أسباب شائعة للإلغاء:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>تغيير طريقة الدفع</li>
              <li>مراجعة الطلب مرة أخرى</li>
              <li>إضافة منتجات أخرى</li>
              <li>مشكلة في بطاقة الائتمان</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Link
              href="/cart"
              className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              العودة إلى السلة 🛒
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              تصفح المزيد من المنتجات
            </Link>
          </div>

          {/* Help Section */}
          <div className="border-t pt-6 mt-6">
            <p className="text-sm text-gray-600 mb-3">
              واجهت مشكلة في إتمام الدفع؟
            </p>
            <div className="flex flex-col sm:flex-row gap-2 text-xs">
              <a
                href="mailto:support@example.com"
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded hover:bg-gray-50 transition"
              >
                📧 راسلنا
              </a>
              <a
                href="tel:+201234567890"
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded hover:bg-gray-50 transition"
              >
                📞 اتصل بنا
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
