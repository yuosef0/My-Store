-- ============================================
-- 🖼️ إعداد Storage للصور مع السياسات الصحيحة
-- Setup Storage Bucket with Correct Policies
-- ============================================

-- ⚠️ هذا الملف يحل مشكلة: "new row violates row-level security policy" عند رفع الصور
-- This file fixes the "StorageApiError" when uploading images

-- ============================================
-- ✅ الخطوة 1: إنشاء Bucket للصور (إذا لم يكن موجوداً)
-- ============================================

-- ملاحظة: لا يمكن إنشاء Bucket من SQL مباشرة
-- يجب إنشاؤه من واجهة Supabase أولاً
-- Note: Buckets must be created from Supabase UI first

-- اذهب إلى: Storage → Create bucket
-- الاسم: product-images
-- Public: Yes (مهم!)


-- ============================================
-- ✅ الخطوة 2: حذف السياسات القديمة (إن وجدت)
-- ============================================

DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to insert" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to update" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to delete" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access for product images" ON storage.objects;


-- ============================================
-- ✅ الخطوة 3: إنشاء السياسات الجديدة
-- ============================================

-- 📖 السياسة 1: السماح للجميع بقراءة الصور (عرض الصور في الموقع)
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- 📤 السياسة 2: السماح للأدمن فقط برفع الصور
CREATE POLICY "Admin upload access for product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

-- ✏️ السياسة 3: السماح للأدمن فقط بتحديث الصور
CREATE POLICY "Admin update access for product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);

-- 🗑️ السياسة 4: السماح للأدمن فقط بحذف الصور
CREATE POLICY "Admin delete access for product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
    AND is_active = true
  )
);


-- ============================================
-- 🔍 الخطوة 4: التحقق من السياسات
-- ============================================

-- عرض جميع السياسات على storage.objects
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd AS operation,
  CASE cmd
    WHEN 'SELECT' THEN '📖 قراءة'
    WHEN 'INSERT' THEN '📤 رفع'
    WHEN 'UPDATE' THEN '✏️ تحديث'
    WHEN 'DELETE' THEN '🗑️ حذف'
  END AS operation_arabic
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
ORDER BY policyname;


-- ============================================
-- 🧪 الخطوة 5: اختبار الصلاحيات
-- ============================================

-- اختبار 1: التحقق من أنك أدمن
SELECT
  'أنت أدمن: ' ||
  CASE
    WHEN EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid()
      AND is_active = true
    ) THEN '✅ نعم'
    ELSE '❌ لا'
  END AS admin_status;

-- اختبار 2: التحقق من أنك مسجل دخول
SELECT
  'مسجل دخول: ' ||
  CASE
    WHEN auth.uid() IS NOT NULL THEN '✅ نعم - ' || COALESCE(auth.email(), 'unknown')
    ELSE '❌ لا'
  END AS login_status;

-- اختبار 3: عرض بريدك الإلكتروني
SELECT
  auth.uid() AS user_id,
  auth.email() AS email,
  'إذا ظهرت بياناتك هنا، فأنت مسجل دخول ✅' AS note;


-- ============================================
-- 📊 تقرير شامل
-- ============================================

SELECT
  '1. Bucket product-images موجود' AS check_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM storage.buckets WHERE name = 'product-images'
    ) THEN '✅ نعم'
    ELSE '❌ لا - أنشئه من Storage في Supabase'
  END AS status

UNION ALL

SELECT
  '2. Bucket عام (Public)' AS check_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM storage.buckets WHERE name = 'product-images' AND public = true
    ) THEN '✅ نعم'
    ELSE '❌ لا - اجعله Public من إعدادات Bucket'
  END AS status

UNION ALL

SELECT
  '3. أنت مسجل دخول' AS check_name,
  CASE
    WHEN auth.uid() IS NOT NULL THEN '✅ نعم - ' || COALESCE(auth.email(), 'unknown')
    ELSE '❌ لا - سجل دخول في الموقع'
  END AS status

UNION ALL

SELECT
  '4. أنت مسجل كأدمن' AS check_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true
    ) THEN '✅ نعم'
    ELSE '❌ لا - أضف نفسك في جدول admins'
  END AS status

UNION ALL

SELECT
  '5. سياسات Storage صحيحة' AS check_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Admin upload access for product images'
    ) THEN '✅ نعم'
    ELSE '❌ لا - شغّل هذا الملف'
  END AS status

UNION ALL

SELECT
  '6. يمكنك رفع صور' AS check_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM storage.buckets WHERE name = 'product-images' AND public = true
    )
    AND EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true
    )
    AND auth.uid() IS NOT NULL
    THEN '✅ نعم - كل شيء جاهز!'
    ELSE '❌ لا - راجع الخطوات السابقة'
  END AS status;


-- ============================================
-- 📋 ملاحظات مهمة
-- ============================================

/*
⚠️ خطوات مهمة قبل تشغيل هذا الملف:
=========================================

1. إنشاء Bucket من واجهة Supabase:
   - اذهب إلى: Storage → New bucket
   - Name: product-images
   - Public: Yes (مهم جداً!)
   - اضغط Create bucket

2. التأكد من أنك مسجل دخول:
   - افتح الموقع في متصفح
   - سجل دخول بحساب الأدمن
   - احتفظ بالتبويب مفتوحاً

3. التأكد من أنك أدمن:
   - نفذ: SELECT * FROM admins WHERE user_id = auth.uid();
   - يجب أن يظهر بريدك الإلكتروني


✅ بعد تشغيل هذا الملف:
=======================

1. سجل خروج من الموقع
2. سجل دخول مرة أخرى
3. ادخل لوحة الأدمن → المنتجات
4. جرب إضافة منتج مع صورة
5. يجب أن يعمل بدون أخطاء! 🎉


🔐 ملخص السياسات:
==================

Storage Bucket: product-images
├── 📖 قراءة (SELECT): متاحة للجميع
├── 📤 رفع (INSERT): للأدمن فقط
├── ✏️ تحديث (UPDATE): للأدمن فقط
└── 🗑️ حذف (DELETE): للأدمن فقط


❌ إذا استمرت المشكلة:
=======================

1. تأكد من إنشاء Bucket باسم "product-images" بالضبط
2. تأكد من أن Bucket عام (Public = Yes)
3. تأكد من تسجيل دخولك في الموقع
4. تأكد من أنك أدمن في جدول admins
5. امسح cache المتصفح (Ctrl+Shift+R)
6. سجل خروج وسجل دخول مرة أخرى


📱 كيفية إنشاء Bucket من واجهة Supabase:
=========================================

1. اذهب إلى: https://supabase.com
2. اختر مشروعك
3. من القائمة الجانبية: Storage
4. اضغط "New bucket"
5. املأ البيانات:
   Name: product-images
   Public: Yes ← (مهم! اختر Yes)
6. اضغط "Create bucket"
7. ارجع لهذا الملف وشغّله في SQL Editor


🎯 الخطوات الصحيحة بالترتيب:
==============================

1. أنشئ Bucket من Storage
2. شغّل هذا الملف في SQL Editor
3. شوف "التقرير الشامل" أعلاه
4. تأكد من أن كل النقاط ✅
5. سجل خروج وسجل دخول
6. جرب رفع صورة


💡 نصيحة:
=========

إذا كنت لا تريد استخدام Storage:
- يمكنك استخدام روابط خارجية للصور (مثل Imgur أو Cloudinary)
- فقط اكتب رابط الصورة مباشرة في حقل image_url
- لا حاجة لرفع الصورة إلى Supabase
*/


-- ============================================
-- تم الانتهاء! ✅
-- ============================================

/*
🎊 الآن يمكنك رفع الصور بنجاح!

تأكد من:
1. ✅ إنشاء Bucket "product-images"
2. ✅ جعل Bucket عام (Public)
3. ✅ تشغيل هذا الملف
4. ✅ سجل خروج وسجل دخول
5. ✅ جرب رفع صورة

بالتوفيق! 🚀
*/
