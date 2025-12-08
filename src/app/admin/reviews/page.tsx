"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Link from "next/link";

interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  products?: {
    title: string;
    slug: string;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [message, setMessage] = useState("");

  // جلب التقييمات
  const fetchReviews = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("reviews")
        .select(`
          *,
          products:product_id (title, slug)
        `)
        .order("created_at", { ascending: false });

      // تطبيق الفلتر
      if (filter === "approved") {
        query = query.eq("is_approved", true);
      } else if (filter === "pending") {
        query = query.eq("is_approved", false);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("خطأ في جلب التقييمات:", error);
      setMessage("❌ حدث خطأ في جلب التقييمات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  // تغيير حالة الموافقة
  const toggleApproval = async (reviewId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: !currentStatus }),
      });

      if (!response.ok) throw new Error("فشل في تحديث التقييم");

      setMessage(`✅ تم ${!currentStatus ? "الموافقة على" : "إلغاء الموافقة على"} التقييم`);
      fetchReviews();
    } catch (error: any) {
      console.error("خطأ في تحديث التقييم:", error);
      setMessage("❌ فشل في تحديث التقييم");
    }
  };

  // حذف تقييم
  const handleDelete = async (id: string, customerName: string) => {
    if (!confirm(`هل أنت متأكد من حذف تقييم ${customerName}؟`)) return;

    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("فشل في حذف التقييم");

      setMessage("✅ تم حذف التقييم بنجاح!");
      fetchReviews();
    } catch (error: any) {
      console.error("خطأ في حذف التقييم:", error);
      setMessage("❌ فشل في حذف التقييم");
    }
  };

  // عرض النجوم
  const renderStars = (rating: number) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-4 sm:mb-6">
          <h1 className="text-slate-900 dark:text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight">
            إدارة التقييمات
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
            إدارة ومراجعة تقييمات العملاء على المنتجات
          </p>
        </header>

        {/* رسالة النجاح/الخطأ */}
        {message && (
          <div
            className={`mb-4 sm:mb-6 p-4 rounded-lg ${
              message.includes("✅")
                ? "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
            }`}
          >
            {message}
          </div>
        )}

        {/* الفلاتر */}
        <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
              filter === "all"
                ? "bg-[#137fec] text-white"
                : "bg-white dark:bg-[#182635] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50"
            }`}
          >
            الكل ({reviews.length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
              filter === "approved"
                ? "bg-green-600 text-white"
                : "bg-white dark:bg-[#182635] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50"
            }`}
          >
            معتمدة
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-white dark:bg-[#182635] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50"
            }`}
          >
            قيد المراجعة
          </button>
        </div>

        {/* جدول التقييمات */}
        <div className="bg-white dark:bg-[#182635] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <h2 className="text-lg sm:text-xl font-bold p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
            التقييمات ({reviews.length})
          </h2>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#137fec] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-slate-500 dark:text-slate-400">جارٍ التحميل...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              لا توجد تقييمات {filter === "approved" && "معتمدة"} {filter === "pending" && "قيد المراجعة"} حالياً
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      {/* معلومات المنتج */}
                      <div className="mb-3">
                        <span className="text-sm text-slate-500 dark:text-slate-400">منتج:</span>{" "}
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {review.products?.title || "منتج محذوف"}
                        </span>
                      </div>

                      {/* التقييم */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl sm:text-2xl">{renderStars(review.rating)}</span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {review.rating}/5
                        </span>
                      </div>

                      {/* العنوان */}
                      {review.title && (
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                          {review.title}
                        </h3>
                      )}

                      {/* التعليق */}
                      {review.comment && (
                        <p className="text-slate-700 dark:text-slate-300 mb-3 text-sm sm:text-base">{review.comment}</p>
                      )}

                      {/* معلومات العميل */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        <span>👤 {review.customer_name}</span>
                        <span className="hidden sm:inline">📧 {review.customer_email}</span>
                        <span>📅 {formatDate(review.created_at)}</span>
                        {review.is_verified_purchase && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded text-xs font-medium">
                            ✓ عميل مؤكد
                          </span>
                        )}
                      </div>

                      {/* الحالة */}
                      <div className="mt-3">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            review.is_approved
                              ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                              : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300"
                          }`}
                        >
                          {review.is_approved ? "✓ معتمد" : "⏳ قيد المراجعة"}
                        </span>
                      </div>
                    </div>

                    {/* الأزرار */}
                    <div className="flex flex-row sm:flex-col gap-2 sm:mr-4">
                      <button
                        onClick={() =>
                          toggleApproval(review.id, review.is_approved)
                        }
                        className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                          review.is_approved
                            ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/60"
                            : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60"
                        }`}
                      >
                        {review.is_approved ? "إلغاء" : "موافقة"}
                      </button>
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/60 transition"
                      >
                        عرض
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(review.id, review.customer_name)
                        }
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/60 transition"
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

      {/* Modal لعرض تفاصيل التقييم */}
      {selectedReview && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="bg-white dark:bg-[#182635] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                تفاصيل التقييم
              </h2>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">المنتج</label>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {selectedReview.products?.title || "منتج محذوف"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">التقييم</label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">{renderStars(selectedReview.rating)}</span>
                  <span className="text-lg font-medium text-slate-900 dark:text-white">{selectedReview.rating}/5</span>
                </div>
              </div>

              {selectedReview.title && (
                <div>
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">العنوان</label>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{selectedReview.title}</p>
                </div>
              )}

              {selectedReview.comment && (
                <div>
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">التعليق</label>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {selectedReview.comment}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">اسم العميل</label>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedReview.customer_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">البريد الإلكتروني</label>
                  <p className="font-medium text-slate-900 dark:text-white break-all">{selectedReview.customer_email}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">تاريخ الإنشاء</label>
                <p className="font-medium text-slate-900 dark:text-white">{formatDate(selectedReview.created_at)}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedReview.is_verified_purchase && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                    ✓ عميل مؤكد
                  </span>
                )}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedReview.is_approved
                      ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                      : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300"
                  }`}
                >
                  {selectedReview.is_approved ? "✓ معتمد" : "⏳ قيد المراجعة"}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    toggleApproval(selectedReview.id, selectedReview.is_approved);
                    setSelectedReview(null);
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition ${
                    selectedReview.is_approved
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {selectedReview.is_approved ? "إلغاء الموافقة" : "الموافقة"}
                </button>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
