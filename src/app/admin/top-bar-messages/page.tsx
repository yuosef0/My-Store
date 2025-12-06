"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

interface TopBarMessage {
  id: string;
  message: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export default function AdminTopBarMessagesPage() {
  const [messages, setMessages] = useState<TopBarMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    message: "",
    is_active: true,
    display_order: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("top_bar_messages")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error("خطأ في جلب الرسائل:", error);
      setMessage("❌ فشل في جلب الرسائل");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      setMessage("❌ الرجاء كتابة الرسالة");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      if (editing) {
        // تحديث
        const { error } = await supabase
          .from("top_bar_messages")
          .update({
            message: formData.message,
            is_active: formData.is_active,
            display_order: formData.display_order,
          })
          .eq("id", editing);

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        setMessage("✅ تم تحديث الرسالة بنجاح!");
      } else {
        // إضافة جديدة
        const { error } = await supabase
          .from("top_bar_messages")
          .insert({
            message: formData.message,
            is_active: formData.is_active,
            display_order: formData.display_order,
          });

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        setMessage("✅ تم إضافة الرسالة بنجاح!");
      }

      setFormData({ message: "", is_active: true, display_order: 1 });
      setEditing(null);
      await fetchMessages();
    } catch (error: any) {
      console.error("خطأ:", error);
      const errorMessage = error?.message || error?.error_description || JSON.stringify(error);
      setMessage("❌ فشل في الحفظ: " + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (msg: TopBarMessage) => {
    setEditing(msg.id);
    setFormData({
      message: msg.message,
      is_active: msg.is_active,
      display_order: msg.display_order,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;

    try {
      const { error } = await supabase
        .from("top_bar_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setMessage("✅ تم حذف الرسالة بنجاح!");
      fetchMessages();
    } catch (error: any) {
      console.error("خطأ في الحذف:", error);
      setMessage("❌ فشل في الحذف: " + (error?.message || "حدث خطأ غير معروف"));
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("top_bar_messages")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      setMessage(`✅ تم ${!currentStatus ? 'تفعيل' : 'تعطيل'} الرسالة بنجاح!`);
      fetchMessages();
    } catch (error: any) {
      console.error("خطأ:", error);
      setMessage("❌ فشل في التحديث: " + (error?.message || "حدث خطأ غير معروف"));
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormData({ message: "", is_active: true, display_order: 1 });
    setMessage("");
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-4 sm:mb-6">
          <h1 className="text-slate-900 dark:text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight">
            إدارة رسائل الشريط الأحمر
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
            الرسائل تتغير تلقائياً كل 4 ثواني
          </p>
        </header>

        {/* Message Alert */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes("✅")
              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
          }`}>
            {message}
          </div>
        )}

        {/* Add/Edit Form */}
        <div className="bg-white dark:bg-[#182635] rounded-lg p-4 sm:p-6 border border-slate-200 dark:border-slate-800 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-slate-900 dark:text-white">
            {editing ? "تعديل الرسالة" : "إضافة رسالة جديدة"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                الرسالة
              </label>
              <input
                type="text"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d1b2a] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="شحن مجاني للطلبات فوق 300 جنيه"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  ترتيب العرض
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0d1b2a] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="mr-2 text-slate-700 dark:text-slate-300">نشط</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "جاري الحفظ..." : editing ? "تحديث" : "إضافة"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 sm:flex-none px-6 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium transition-colors"
                >
                  إلغاء
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Messages List */}
        <div className="bg-white dark:bg-[#182635] rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-slate-900 dark:text-white">
              الرسائل الحالية ({messages.length})
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              </div>
            ) : messages.length === 0 ? (
              <p className="text-center py-8 text-slate-500">لا توجد رسائل بعد</p>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 sm:p-4 rounded-lg border ${
                      msg.is_active
                        ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20"
                        : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-3 sm:gap-4">
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 text-xs font-bold rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            #{msg.display_order}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-bold rounded ${
                              msg.is_active
                                ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200"
                                : "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200"
                            }`}
                          >
                            {msg.is_active ? "نشط" : "معطل"}
                          </span>
                        </div>
                        <p className="text-slate-900 dark:text-white font-medium">
                          {msg.message}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => toggleActive(msg.id, msg.is_active)}
                          className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors whitespace-nowrap"
                          title={msg.is_active ? "تعطيل" : "تفعيل"}
                        >
                          {msg.is_active ? "تعطيل" : "تفعيل"}
                        </button>
                        <button
                          onClick={() => handleEdit(msg)}
                          className="px-3 py-1.5 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
