-- ================================================
-- Create Theme Settings Table
-- إنشاء جدول إعدادات الألوان
-- ================================================

-- إنشاء جدول الإعدادات
CREATE TABLE IF NOT EXISTS theme_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_label TEXT NOT NULL,
  setting_description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إضافة الألوان الافتراضية
INSERT INTO theme_settings (setting_key, setting_value, setting_label, setting_description) VALUES
('primary_color', '#e60000', 'اللون الأساسي', 'اللون الأحمر المستخدم في الأزرار والعناصر المهمة'),
('primary_hover', '#cc0000', 'اللون الأساسي عند التمرير', 'لون الأزرار عند التمرير عليها'),
('top_bar_bg', '#e60000', 'خلفية الشريط الأحمر', 'لون خلفية الشريط الأحمر في الأعلى'),
('button_text', '#ffffff', 'نص الأزرار', 'لون النص داخل الأزرار الأساسية')
ON CONFLICT (setting_key) DO UPDATE
SET setting_value = EXCLUDED.setting_value;

-- إنشاء index للبحث السريع
CREATE INDEX IF NOT EXISTS idx_theme_settings_key ON theme_settings(setting_key);

-- ================================================
-- Row Level Security (RLS) Policies
-- ================================================

-- تفعيل RLS
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;

-- سياسة: الجميع يمكنهم قراءة الإعدادات
DROP POLICY IF EXISTS "Anyone can view theme settings" ON theme_settings;
CREATE POLICY "Anyone can view theme settings"
    ON theme_settings FOR SELECT
    USING (true);

-- سياسة: المسؤولون فقط يمكنهم تحديث الإعدادات
DROP POLICY IF EXISTS "Admins can update theme settings" ON theme_settings;
CREATE POLICY "Admins can update theme settings"
    ON theme_settings FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- سياسة: المسؤولون فقط يمكنهم إضافة إعدادات
DROP POLICY IF EXISTS "Admins can insert theme settings" ON theme_settings;
CREATE POLICY "Admins can insert theme settings"
    ON theme_settings FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- التحقق من الإعدادات
SELECT * FROM theme_settings ORDER BY setting_key;
