"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

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

    // إذا كان أدمن، اسمح بالعرض
    setShouldRender(true);
  }, [user, loading, isAdmin, router]);

  // أثناء التحميل أو التحقق، اعرض شاشة تحميل
  if (loading || !shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#101922]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // إذا كان أدمن، اعرض المحتوى
  return <>{children}</>;
}
