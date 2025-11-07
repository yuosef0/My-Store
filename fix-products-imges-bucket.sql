-- ============================================
-- 🖼️ إضافة Policies للبوكت products-imges
-- Add Policies for products-imges bucket
-- ============================================

-- ⚠️ هذا الملف خاص للبوكت باسم: products-imges
-- This file is for bucket named: products-imges

-- ============================================
-- ✅ الخطوة 1: حذف أي policies قديمة (للتأكد)
-- ============================================

DROP POLICY IF EXISTS "Allow public read access products-imges" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read products-imges" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to upload products-imges" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to insert products-imges" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to update products-imges" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to delete products-imges" ON storage.objects;
DROP POLICY IF EXISTS "Public read for products-imges" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload for products-imges" ON storage.objects;
DROP POLICY IF EXISTS "Admin update for products-imges" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete for products-imges" ON storage.objects;


-- ============================================
-- ✅ الخطوة 2: إنشاء السياسات الجديدة
-- ============================================

-- 📖 السياسة 1: السماح للجميع بقراءة الصور
CREATE POLICY "Public read for products-imges"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products-imges');

-- 📤 السياسة 2: السماح للأدمن برفع الصور
CREATE POLICY "Admin upload for products-imges"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products-imges'
  AND EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

-- ✏️ السياسة 3: السماح للأدمن بتحديث الصور
CREATE POLICY "Admin update for products-imges"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'products-imges'
  AND EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

-- 🗑️ السياسة 4: السماح للأدمن بحذف الصور
CREATE POLICY "Admin delete for products-imges"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'products-imges'
  AND EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);


-- ============================================
-- 🔍 الخطوة 3: التحقق من السياسات
-- ============================================

-- عرض جميع السياسات على storage.objects لهذا البوكت
SELECT
  policyname AS "اسم السياسة",
  cmd AS "العملية",
  CASE cmd
    WHEN 'SELECT' THEN '📖 قراءة الصور'
    WHEN 'INSERT' THEN '📤 رفع صور'
    WHEN 'UPDATE' THEN '✏️ تحديث صور'
    WHEN 'DELETE' THEN '🗑️ حذف صور'
  END AS "الوصف",
  '✅ تم إنشاؤها' AS "الحالة"
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND policyname LIKE '%products-imges%'
ORDER BY cmd;


-- ============================================
-- 🧪 الخطوة 4: اختبارات التحقق
-- ============================================

-- اختبار 1: التحقق من وجود البوكت
SELECT
  name AS "اسم البوكت",
  public AS "عام؟",
  CASE
    WHEN public = true THEN '✅ نعم'
    ELSE '❌ لا - يجب جعله عام!'
  END AS "الحالة"
FROM storage.buckets
WHERE name = 'products-imges';

-- اختبار 2: التحقق من أنك أدمن
SELECT
  email AS "البريد الإلكتروني",
  role AS "الدور",
  is_active AS "نشط؟",
  CASE
    WHEN is_active = true THEN '✅ يمكنك رفع الصور'
    ELSE '❌ حسابك معطل'
  END AS "الحالة"
FROM admins
WHERE user_id = auth.uid();

-- اختبار 3: التحقق من تسجيل الدخول
SELECT
  auth.uid() AS "معرف المستخدم",
  auth.email() AS "البريد الإلكتروني",
  CASE
    WHEN auth.uid() IS NOT NULL THEN '✅ مسجل دخول'
    ELSE '❌ لست مسجل دخول'
  END AS "حالة تسجيل الدخول";


-- ============================================
-- 📊 تقرير شامل
-- ============================================

SELECT
  '1. البوكت products-imges موجود' AS "الفحص",
  CASE
    WHEN EXISTS (
      SELECT 1 FROM storage.buckets WHERE name = 'products-imges'
    ) THEN '✅ نعم'
    ELSE '❌ لا - تأكد من الاسم'
  END AS "النتيجة"

UNION ALL

SELECT
  '2. البوكت عام (Public)' AS "الفحص",
  CASE
    WHEN EXISTS (
      SELECT 1 FROM storage.buckets WHERE name = 'products-imges' AND public = true
    ) THEN '✅ نعم'
    ELSE '❌ لا - اجعله عام من إعدادات البوكت'
  END AS "النتيجة"

UNION ALL

SELECT
  '3. أنت مسجل دخول' AS "الفحص",
  CASE
    WHEN auth.uid() IS NOT NULL THEN '✅ نعم - ' || COALESCE(auth.email(), 'unknown')
    ELSE '❌ لا - سجل دخول في الموقع'
  END AS "النتيجة"

UNION ALL

SELECT
  '4. أنت مسجل كأدمن' AS "الفحص",
  CASE
    WHEN EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true
    ) THEN '✅ نعم'
    ELSE '❌ لا - أضف نفسك في جدول admins'
  END AS "النتيجة"

UNION ALL

SELECT
  '5. السياسات موجودة (4 سياسات)' AS "الفحص",
  CASE
    WHEN (
      SELECT COUNT(*)
      FROM pg_policies
      WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname LIKE '%products-imges%'
    ) = 4 THEN '✅ نعم - 4 سياسات'
    ELSE '❌ لا - عدد السياسات: ' || (
      SELECT COUNT(*)::text
      FROM pg_policies
      WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname LIKE '%products-imges%'
    )
  END AS "النتيجة"

UNION ALL

SELECT
  '6. يمكنك رفع صور' AS "الفحص",
  CASE
    WHEN EXISTS (
      SELECT 1 FROM storage.buckets WHERE name = 'products-imges' AND public = true
    )
    AND EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true
    )
    AND auth.uid() IS NOT NULL
    AND (
      SELECT COUNT(*)
      FROM pg_policies
      WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname LIKE '%products-imges%'
    ) = 4
    THEN '✅ نعم - كل شيء جاهز! 🎉'
    ELSE '❌ لا - راجع النقاط السابقة'
  END AS "النتيجة";


-- ============================================
-- 📋 التعليمات النهائية
-- ============================================

/*
🎉 تم إضافة السياسات بنجاح!
============================

✅ ما تم إنشاؤه:
- 📖 سياسة قراءة للجميع (عرض الصور في الموقع)
- 📤 سياسة رفع للأدمن فقط
- ✏️ سياسة تحديث للأدمن فقط
- 🗑️ سياسة حذف للأدمن فقط


📊 راجع التقرير الشامل أعلاه:
=============================

يجب أن تكون جميع النقاط ✅

إذا ظهر أي ❌:
- البوكت ليس عام → اذهب إلى Storage → products-imges → Settings → Public: Yes
- لست مسجل دخول → سجل دخول في الموقع
- لست أدمن → نفذ:
  INSERT INTO admins (user_id, email, full_name, role)
  SELECT id, email, raw_user_meta_data->>'full_name', 'super_admin'
  FROM auth.users
  WHERE email = 'بريدك@example.com'
  ON CONFLICT (user_id) DO UPDATE SET is_active = true;


🚀 الخطوات التالية:
===================

1. ✅ تأكد من أن التقرير الشامل كله ✅
2. 🚪 سجل خروج من الموقع
3. 🔑 سجل دخول مرة أخرى
4. 📦 ادخل لوحة الأدمن → المنتجات
5. ➕ جرب إضافة منتج مع صورة
6. 🎊 يجب أن يعمل الآن!


⚠️ مهم جداً:
============

- اسم البوكت: products-imges (بالضبط بنفس الكتابة!)
- يجب أن يكون البوكت عام (Public = Yes)
- يجب أن تكون مسجل دخول ومسجل كأدمن


💡 إذا استمرت المشكلة:
=======================

1. تأكد من أن اسم البوكت: products-imges
2. تأكد من أن البوكت عام (Public)
3. امسح cache المتصفح (Ctrl+Shift+R)
4. سجل خروج وسجل دخول مرة أخرى
5. جرب رفع صورة صغيرة (أقل من 1MB)


📞 معلومات للدعم:
==================

اسم البوكت: products-imges
عدد السياسات المطلوبة: 4
الصلاحيات: قراءة (الجميع) + رفع/تعديل/حذف (الأدمن فقط)
*/


-- ============================================
-- تم الانتهاء! ✅
-- ============================================

/*
🎊 الآن يمكنك رفع الصور بنجاح!

الخطوات:
1. ✅ شغّل هذا الملف
2. ✅ شوف التقرير الشامل
3. ✅ سجل خروج وسجل دخول
4. ✅ جرب رفع صورة

بالتوفيق! 🚀
*/
