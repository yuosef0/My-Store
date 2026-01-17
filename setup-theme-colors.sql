-- ============================================
-- 🎨 إعداد ألوان الموقع الافتراضية
-- ============================================
-- هذا الملف يضيف الألوان الافتراضية في theme_settings
-- ويصلح RLS policies للسماح بالقراءة
-- ============================================

-- 1️⃣ حذف البيانات القديمة (اختياري)
-- ============================================
-- DELETE FROM theme_settings;

-- 2️⃣ إضافة الألوان الافتراضية
-- ============================================
INSERT INTO theme_settings (setting_key, setting_value, setting_label, setting_description) VALUES
('primary_color', '#e60000', 'اللون الأساسي', 'اللون الرئيسي المستخدم في الأزرار والعناصر الأساسية'),
('primary_hover', '#cc0000', 'لون التمرير', 'لون الأزرار عند التمرير عليها بالماوس'),
('top_bar_bg', '#e60000', 'لون الشريط العلوي', 'لون خلفية الشريط الأحمر في أعلى الصفحة'),
('button_text', '#ffffff', 'لون نص الأزرار', 'لون النص داخل الأزرار'),
('price_color', '#e60000', 'لون الأسعار', 'لون عرض الأسعار في المنتجات'),
('product_card_bg', '#ffffff', 'خلفية كارد المنتج', 'لون خلفية بطاقات المنتجات')
ON CONFLICT (setting_key)
DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    setting_label = EXCLUDED.setting_label,
    setting_description = EXCLUDED.setting_description,
    updated_at = NOW();

-- 3️⃣ إصلاح RLS Policies
-- ============================================
-- السماح للجميع بقراءة الإعدادات
DROP POLICY IF EXISTS "allow_read_theme_settings" ON theme_settings;
CREATE POLICY "allow_read_theme_settings" ON theme_settings
    FOR SELECT
    USING (true);

-- السماح للأدمن بالتعديل
DROP POLICY IF EXISTS "allow_admin_update_theme_settings" ON theme_settings;
CREATE POLICY "allow_admin_update_theme_settings" ON theme_settings
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE user_id = auth.uid()
            AND is_active = true
        )
    );

-- السماح للأدمن بالإضافة
DROP POLICY IF EXISTS "allow_admin_insert_theme_settings" ON theme_settings;
CREATE POLICY "allow_admin_insert_theme_settings" ON theme_settings
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admins
            WHERE user_id = auth.uid()
            AND is_active = true
        )
    );

-- 4️⃣ التحقق من النتيجة
-- ============================================
SELECT * FROM theme_settings ORDER BY setting_key;

-- ============================================
-- ✅ تم!
-- ============================================
-- الآن يمكن:
-- 1. قراءة الألوان من جميع الصفحات
-- 2. تعديل الألوان من صفحة الأدمن
-- 3. الألوان ستُطبق على الموقع مباشرة
-- ============================================
