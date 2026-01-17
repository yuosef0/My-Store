-- ============================================
-- 🔧 التحقق من وإصلاح صلاحيات الأدمن
-- ============================================

-- 1️⃣ التحقق من وجود جدول admins
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admins') THEN
        -- إنشاء جدول admins إذا لم يكن موجود
        CREATE TABLE admins (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            role TEXT NOT NULL DEFAULT 'admin',
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id)
        );

        RAISE NOTICE 'تم إنشاء جدول admins';
    ELSE
        RAISE NOTICE 'جدول admins موجود بالفعل';
    END IF;
END $$;

-- 2️⃣ التحقق من RLS
-- ============================================
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 3️⃣ حذف السياسات القديمة
-- ============================================
DROP POLICY IF EXISTS "الأدمن يمكنهم رؤية جميع الأدمن" ON admins;
DROP POLICY IF EXISTS "الجميع يمكنهم قراءة معلومات الأدمن" ON admins;
DROP POLICY IF EXISTS "يمكن للجميع قراءة الأدمن النشطين" ON admins;

-- 4️⃣ إنشاء سياسة جديدة للقراءة (مفتوحة)
-- ============================================
CREATE POLICY "يمكن للجميع قراءة الأدمن النشطين" ON admins
    FOR SELECT
    USING (is_active = true);

-- 5️⃣ عرض جميع المستخدمين في auth.users
-- ============================================
-- هذا الكود للاستعلام فقط، لا يُنفذ تلقائياً
-- قم بتشغيله يدوياً للحصول على user_id الخاص بك:

-- SELECT id, email, created_at
-- FROM auth.users
-- ORDER BY created_at DESC;

-- 6️⃣ عرض جميع الأدمن الحاليين
-- ============================================
-- SELECT a.*, u.email
-- FROM admins a
-- LEFT JOIN auth.users u ON a.user_id = u.id;

-- 7️⃣ تفعيل جميع الأدمن (اختياري)
-- ============================================
UPDATE admins SET is_active = true;

-- ============================================
-- 📋 خطوات يدوية مطلوبة:
-- ============================================
--
-- 1. شغّل هذا الاستعلام للحصول على user_id:
--    SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
--
-- 2. أضف نفسك كأدمن باستخدام user_id:
--    INSERT INTO admins (user_id, role, is_active)
--    VALUES ('YOUR_USER_ID_HERE', 'admin', true)
--    ON CONFLICT (user_id) DO UPDATE
--    SET is_active = true, role = 'admin';
--
-- 3. تحقق من أنك أدمن:
--    SELECT * FROM admins WHERE user_id = 'YOUR_USER_ID_HERE';
--
-- ============================================
