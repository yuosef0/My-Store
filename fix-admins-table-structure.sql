-- ============================================
-- 🔧 إصلاح هيكل جدول admins
-- ============================================
-- المشكلة: عمود email في جدول admins إلزامي (NOT NULL)
-- الحل: إزالة عمود email لأنه موجود في auth.users
-- ============================================

-- 1️⃣ فحص هيكل الجدول الحالي
-- ============================================
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'admins'
ORDER BY ordinal_position;


-- 2️⃣ حذف عمود email (الحل الموصى به)
-- ============================================
-- لأننا نحصل على الإيميل من auth.users عبر الـ JOIN

ALTER TABLE admins
DROP COLUMN IF EXISTS email;


-- 3️⃣ الآن أضف نفسك كأدمن
-- ============================================
-- استبدل YOUR_USER_ID_HERE بالـ user_id الصحيح من auth.users:

-- أولاً: احصل على user_id الصحيح
SELECT id, email FROM auth.users ORDER BY created_at DESC;

-- ثانياً: أضف نفسك (استبدل YOUR_USER_ID_HERE)
INSERT INTO admins (user_id, role, is_active)
VALUES ('YOUR_USER_ID_HERE', 'super_admin', true)
ON CONFLICT (user_id)
DO UPDATE SET
    is_active = true,
    role = 'super_admin';


-- 4️⃣ تحقق من النجاح
-- ============================================
SELECT
    a.id,
    a.user_id,
    a.role,
    a.is_active,
    u.email,
    u.last_sign_in_at
FROM admins a
INNER JOIN auth.users u ON a.user_id = u.id
WHERE a.is_active = true;


-- ============================================
-- 💡 حل بديل: إذا كنت تريد الاحتفاظ بعمود email
-- ============================================
-- (غير موصى به، لكن إذا أردت)

-- ALTER TABLE admins
-- ALTER COLUMN email DROP NOT NULL;

-- ثم أضف نفسك بدون email:
-- INSERT INTO admins (user_id, role, is_active)
-- VALUES ('YOUR_USER_ID_HERE', 'super_admin', true);


-- ============================================
-- ✅ الحل النهائي (مختصر)
-- ============================================
-- شغّل هذه الأوامر بالترتيب:

-- 1. حذف عمود email
ALTER TABLE admins DROP COLUMN IF EXISTS email;

-- 2. حذف البيانات القديمة الخاطئة
DELETE FROM admins;

-- 3. أضف نفسك (استبدل YOUR_USER_ID بـ id من auth.users)
-- احصل عليه بتشغيل:
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

INSERT INTO admins (user_id, role, is_active)
VALUES ('YOUR_USER_ID_HERE', 'super_admin', true);

-- ============================================
