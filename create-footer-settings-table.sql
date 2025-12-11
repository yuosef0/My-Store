-- ============================================
-- 🔧 إنشاء جدول إعدادات الفوتر
-- ============================================
-- هذا الملف ينشئ جدول footer_settings لتخزين
-- محتوى الفوتر ولينكات السوشيال ميديا
-- ============================================

-- 1️⃣ إنشاء جدول footer_settings
-- ============================================
CREATE TABLE IF NOT EXISTS footer_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- معلومات المتجر
  store_name TEXT NOT NULL DEFAULT 'متجري',
  store_description TEXT NOT NULL DEFAULT 'وجهتك الأولى لأحدث صيحات الموضة',
  copyright_text TEXT NOT NULL DEFAULT '© 2024 متجري. جميع الحقوق محفوظة.',

  -- لينكات السوشيال ميديا
  facebook_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  tiktok_url TEXT,
  linkedin_url TEXT,

  -- معلومات التواصل
  whatsapp_number TEXT,
  email TEXT,
  phone TEXT,

  -- حالة التفعيل
  is_active BOOLEAN DEFAULT true,

  -- الطوابع الزمنية
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2️⃣ إضافة صف افتراضي
-- ============================================
INSERT INTO footer_settings (
  store_name,
  store_description,
  copyright_text,
  facebook_url,
  twitter_url,
  instagram_url,
  youtube_url,
  whatsapp_number,
  email,
  phone,
  is_active
) VALUES (
  'متجري',
  'وجهتك الأولى لأحدث صيحات الموضة. نقدم لك أفضل الملابس والأحذية بجودة عالية وأسعار تنافسية.',
  '© 2024 متجري. جميع الحقوق محفوظة.',
  'https://facebook.com',
  'https://twitter.com',
  'https://instagram.com',
  'https://youtube.com',
  '01234567890',
  'info@mystore.com',
  '01234567890',
  true
) ON CONFLICT DO NOTHING;

-- 3️⃣ إنشاء دالة لتحديث updated_at تلقائياً
-- ============================================
CREATE OR REPLACE FUNCTION update_footer_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4️⃣ إنشاء Trigger لتحديث updated_at
-- ============================================
DROP TRIGGER IF EXISTS footer_settings_updated_at_trigger ON footer_settings;
CREATE TRIGGER footer_settings_updated_at_trigger
  BEFORE UPDATE ON footer_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_footer_settings_updated_at();

-- 5️⃣ تفعيل RLS
-- ============================================
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;

-- 6️⃣ إنشاء سياسات RLS
-- ============================================

-- سياسة القراءة: الجميع يمكنهم قراءة الإعدادات النشطة
DROP POLICY IF EXISTS "الجميع يمكنهم قراءة إعدادات الفوتر النشطة" ON footer_settings;
CREATE POLICY "الجميع يمكنهم قراءة إعدادات الفوتر النشطة" ON footer_settings
  FOR SELECT USING (is_active = true);

-- سياسة التعديل: فقط الأدمن يمكنهم تعديل الإعدادات
DROP POLICY IF EXISTS "الأدمن يمكنهم تعديل إعدادات الفوتر" ON footer_settings;
CREATE POLICY "الأدمن يمكنهم تعديل إعدادات الفوتر" ON footer_settings
  FOR UPDATE USING (is_admin(auth.uid()));

-- سياسة الإضافة: فقط الأدمن يمكنهم إضافة إعدادات جديدة
DROP POLICY IF EXISTS "الأدمن يمكنهم إضافة إعدادات فوتر" ON footer_settings;
CREATE POLICY "الأدمن يمكنهم إضافة إعدادات فوتر" ON footer_settings
  FOR INSERT WITH CHECK (is_admin(auth.uid()));

-- سياسة الحذف: فقط الأدمن يمكنهم حذف الإعدادات
DROP POLICY IF EXISTS "الأدمن يمكنهم حذف إعدادات الفوتر" ON footer_settings;
CREATE POLICY "الأدمن يمكنهم حذف إعدادات الفوتر" ON footer_settings
  FOR DELETE USING (is_admin(auth.uid()));

-- ============================================
-- ✅ انتهى إنشاء الجدول!
-- ============================================
-- الآن يمكن للأدمن إدارة محتوى الفوتر ولينكات السوشيال ميديا
-- ============================================
