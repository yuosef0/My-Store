"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // لا تفعل أي شيء أثناء التحميل
    if (loading) return;

    // بعد انتهاء التحميل، تحقق من صلاحيات المستخدم
    if (!user) {
      // المستخدم غير مسجل دخول
      router.push("/login?redirect=/admin");
      return;
    }

    if (!isAdmin) {
      // المستخدم مسجل دخول لكن ليس أدمن
      router.push("/");
      return;
    }
  }, [user, loading, isAdmin, router]);

  // أثناء التحميل، اعرض شاشة تحميل
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // إذا لم يكن مسجل دخول أو ليس أدمن، لا تعرض شيء
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            غير مصرح لك بالوصول
          </h1>
          <p className="text-gray-600 mb-6">
            هذه الصفحة متاحة للمسؤولين فقط
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  // إذا كان أدمن، اعرض المحتوى
  return <>{children}</>;
}
