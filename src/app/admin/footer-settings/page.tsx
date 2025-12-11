"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

interface FooterSettings {
  id: string;
  store_name: string;
  store_description: string;
  copyright_text: string;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  linkedin_url: string | null;
  whatsapp_number: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
}

export default function FooterSettingsPage() {
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    store_name: "",
    store_description: "",
    copyright_text: "",
    facebook_url: "",
    twitter_url: "",
    instagram_url: "",
    youtube_url: "",
    tiktok_url: "",
    linkedin_url: "",
    whatsapp_number: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("footer_settings")
        .select("*")
        .eq("is_active", true)
        .single();

      if (error) throw error;

      if (data) {
        setSettings(data);
        setFormData({
          store_name: data.store_name || "",
          store_description: data.store_description || "",
          copyright_text: data.copyright_text || "",
          facebook_url: data.facebook_url || "",
          twitter_url: data.twitter_url || "",
          instagram_url: data.instagram_url || "",
          youtube_url: data.youtube_url || "",
          tiktok_url: data.tiktok_url || "",
          linkedin_url: data.linkedin_url || "",
          whatsapp_number: data.whatsapp_number || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      }
    } catch (error) {
      console.error("خطأ في جلب الإعدادات:", error);
      setMessage("فشل في تحميل الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      if (settings?.id) {
        // تحديث الإعدادات الموجودة
        const { error } = await supabase
          .from("footer_settings")
          .update({
            store_name: formData.store_name,
            store_description: formData.store_description,
            copyright_text: formData.copyright_text,
            facebook_url: formData.facebook_url || null,
            twitter_url: formData.twitter_url || null,
            instagram_url: formData.instagram_url || null,
            youtube_url: formData.youtube_url || null,
            tiktok_url: formData.tiktok_url || null,
            linkedin_url: formData.linkedin_url || null,
            whatsapp_number: formData.whatsapp_number || null,
            email: formData.email || null,
            phone: formData.phone || null,
          })
          .eq("id", settings.id);

        if (error) throw error;
        setMessage("✅ تم حفظ التغييرات بنجاح!");
      } else {
        // إنشاء إعدادات جديدة
        const { error } = await supabase.from("footer_settings").insert([
          {
            ...formData,
            facebook_url: formData.facebook_url || null,
            twitter_url: formData.twitter_url || null,
            instagram_url: formData.instagram_url || null,
            youtube_url: formData.youtube_url || null,
            tiktok_url: formData.tiktok_url || null,
            linkedin_url: formData.linkedin_url || null,
            whatsapp_number: formData.whatsapp_number || null,
            email: formData.email || null,
            phone: formData.phone || null,
            is_active: true,
          },
        ]);

        if (error) throw error;
        setMessage("✅ تم إنشاء الإعدادات بنجاح!");
      }

      await fetchSettings();
    } catch (error: any) {
      console.error("خطأ في حفظ الإعدادات:", error);
      setMessage("❌ فشل في حفظ التغييرات: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#137fec]"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Heading */}
        <header className="mb-6">
          <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
            إعدادات الفوتر
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mt-2">
            تحكم في محتوى الفوتر ولينكات السوشيال ميديا
          </p>
        </header>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("✅")
                ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* معلومات المتجر */}
          <div className="bg-white dark:bg-[#182635] rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              معلومات المتجر
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  اسم المتجر
                </label>
                <input
                  type="text"
                  name="store_name"
                  value={formData.store_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101922] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  وصف المتجر
                </label>
                <textarea
                  name="store_description"
                  value={formData.store_description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101922] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  نص حقوق النشر
                </label>
                <input
                  type="text"
                  name="copyright_text"
                  value={formData.copyright_text}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101922] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* لينكات السوشيال ميديا */}
          <div className="bg-white dark:bg-[#182635] rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              لينكات السوشيال ميديا
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  فيسبوك
                </label>
                <input
                  type="url"
                  name="facebook_url"
                  value={formData.facebook_url}
                  onChange={handleChange}
                  placeholder="https://facebook.com/yourpage"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101922] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  تويتر / X
                </label>
                <input
                  type="url"
                  name="twitter_url"
                  value={formData.twitter_url}
                  onChange={handleChange}
                  placeholder="https://twitter.com/yourhandle"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101922] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  إنستجرام
                </label>
                <input
                  type="url"
                  name="instagram_url"
                  value={formData.instagram_url}
                  onChange={handleChange}
                  placeholder="https://instagram.com/yourprofile"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101922] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  يوتيوب
                </label>
                <input
                  type="url"
                  name="youtube_url"
                  value={formData.youtube_url}
                  onChange={handleChange}
                  placeholder="https://youtube.com/@yourchannel"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101922] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  تيك توك
                </label>
                <input
                  type="url"
                  name="tiktok_url"
                  value={formData.tiktok_url}
                  onChange={handleChange}
                  placeholder="https://tiktok.com/@yourprofile"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101922] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  لينكد إن
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/company/yourcompany"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101922] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* معلومات التواصل */}
          <div className="bg-white dark:bg-[#182635] rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              معلومات التواصل
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  رقم واتساب
                </label>
                <input
                  type="tel"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  placeholder="01234567890"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101922] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="info@mystore.com"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101922] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01234567890"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#101922] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#137fec] text-white rounded-lg font-medium hover:bg-[#137fec]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
