"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabaseClient";

export default function CheckAdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [adminData, setAdminData] = useState<any>(null);
  const [queryError, setQueryError] = useState<any>(null);

  useEffect(() => {
    const checkDatabase = async () => {
      if (user) {
        // محاولة قراءة من جدول admins مباشرة
        const { data, error } = await supabase
          .from("admins")
          .select("*")
          .eq("user_id", user.id);

        console.log("Direct query result:", { data, error });
        setAdminData(data);
        setQueryError(error);
      }
    };

    checkDatabase();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 فحص حالة الأدمن</h1>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">معلومات المستخدم</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>البريد الإلكتروني:</strong> {user.email}</p>
              <p><strong>User ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs">{user.id}</code></p>
              <p><strong>تاريخ الإنشاء:</strong> {new Date(user.created_at || "").toLocaleString('ar-EG')}</p>
            </div>
          ) : (
            <p className="text-red-600">❌ غير مسجل دخول</p>
          )}
        </div>

        {/* Admin Status from Context */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">حالة الأدمن (من Context)</h2>
          <div className="space-y-2">
            <p><strong>هل أدمن؟</strong>
              <span className={`ml-2 px-3 py-1 rounded ${isAdmin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isAdmin ? "✅ نعم" : "❌ لا"}
              </span>
            </p>
          </div>
        </div>

        {/* Database Query Result */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">نتيجة الاستعلام المباشر من قاعدة البيانات</h2>

          {queryError && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <p className="text-red-800 font-bold">❌ خطأ في الاستعلام:</p>
              <pre className="text-sm mt-2 overflow-auto">{JSON.stringify(queryError, null, 2)}</pre>
            </div>
          )}

          {adminData && adminData.length > 0 ? (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <p className="text-green-800 font-bold mb-2">✅ تم العثور على بيانات الأدمن:</p>
              <pre className="text-sm overflow-auto bg-white p-3 rounded">
                {JSON.stringify(adminData, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <p className="text-yellow-800">⚠️ لا توجد بيانات أدمن لهذا المستخدم في قاعدة البيانات</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-900">📋 تعليمات الإصلاح</h2>

          {!user && (
            <div className="mb-4">
              <p className="font-bold text-red-600">1️⃣ سجل دخول أولاً!</p>
              <p className="text-sm mt-1">اذهب إلى صفحة تسجيل الدخول</p>
            </div>
          )}

          {user && (!adminData || adminData.length === 0) && (
            <div className="mb-4">
              <p className="font-bold text-red-600">2️⃣ أضف نفسك كأدمن في Supabase:</p>
              <div className="bg-white rounded p-3 mt-2">
                <p className="text-sm mb-2">شغّل هذا في SQL Editor:</p>
                <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-auto">
{`INSERT INTO admins (user_id, role, is_active)
VALUES ('${user.id}', 'admin', true)
ON CONFLICT (user_id)
DO UPDATE SET is_active = true, role = 'admin';`}
                </pre>
              </div>
            </div>
          )}

          {queryError?.code === 'PGRST116' && (
            <div className="mb-4">
              <p className="font-bold text-red-600">3️⃣ مشكلة في RLS Policy!</p>
              <p className="text-sm mt-1">جدول admins موجود لكن Row Level Security تمنع القراءة</p>
              <div className="bg-white rounded p-3 mt-2">
                <p className="text-sm mb-2">شغّل هذا في SQL Editor لإصلاح RLS:</p>
                <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-auto">
{`-- إزالة السياسات القديمة
DROP POLICY IF EXISTS "يمكن للجميع قراءة الأدمن النشطين" ON admins;

-- إنشاء سياسة جديدة
CREATE POLICY "يمكن للجميع قراءة الأدمن النشطين" ON admins
    FOR SELECT
    USING (true);  -- اسمح للجميع بالقراءة`}
                </pre>
              </div>
            </div>
          )}

          {user && adminData && adminData.length > 0 && adminData[0].is_active === false && (
            <div className="mb-4">
              <p className="font-bold text-red-600">4️⃣ الحساب موجود لكن غير مفعّل!</p>
              <div className="bg-white rounded p-3 mt-2">
                <p className="text-sm mb-2">شغّل هذا لتفعيل الحساب:</p>
                <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-auto">
{`UPDATE admins
SET is_active = true
WHERE user_id = '${user.id}';`}
                </pre>
              </div>
            </div>
          )}

          {adminData && adminData.length > 0 && adminData[0].is_active === true && !isAdmin && (
            <div className="mb-4">
              <p className="font-bold text-orange-600">5️⃣ البيانات صحيحة لكن Context لا يقرأها!</p>
              <p className="text-sm mt-1">جرب:</p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li>سجل خروج ثم سجل دخول مرة أخرى</li>
                <li>امسح Cache المتصفح (Ctrl+Shift+Delete)</li>
                <li>افتح Console (F12) وشوف رسائل الـ console.log</li>
              </ul>
            </div>
          )}
        </div>

        {/* Console Check */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold mb-2 text-purple-900">🔍 تحقق من Console</h2>
          <p className="text-sm">افتح Developer Console (اضغط F12) وابحث عن رسائل تبدأ بـ:</p>
          <ul className="list-disc list-inside text-sm mt-2 space-y-1">
            <li>🔍 Checking admin status...</li>
            <li>📊 Admin query result...</li>
            <li>✅ User IS admin / ❌ User is NOT admin</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
