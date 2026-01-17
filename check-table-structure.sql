-- ============================================
-- 🔍 فحص هيكل الجداول
-- ============================================
-- هذا الملف يساعدك في معرفة الأعمدة الموجودة في كل جدول
-- لتجنب أخطاء "column does not exist"
-- ============================================

-- 1️⃣ فحص جدول categories
-- ============================================
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'categories'
ORDER BY ordinal_position;

-- 2️⃣ فحص جدول products
-- ============================================
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- 3️⃣ فحص جدول slider_images
-- ============================================
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'slider_images'
ORDER BY ordinal_position;

-- ============================================
-- 💡 نتائج متوقعة:
-- ============================================

-- جدول categories يجب أن يحتوي على:
-- - id, name, slug, description, image_url, is_active, created_at, updated_at

-- جدول products يجب أن يحتوي على:
-- - id, name, description, price, discount_price, category_id,
--   image_url, stock, is_active, created_at, updated_at

-- جدول slider_images يجب أن يحتوي على:
-- - id, image_url, order_index, is_active, created_at, updated_at
-- (قد يحتوي على أعمدة إضافية حسب إعدادك)

-- ============================================
