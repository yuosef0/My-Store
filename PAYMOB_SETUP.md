# دليل إعداد بوابة الدفع Paymob

هذا الدليل يشرح كيفية إعداد بوابة الدفع Paymob في المتجر الإلكتروني.

## الخطوات المطلوبة

### 1. إنشاء حساب في Paymob

1. اذهب إلى [Paymob Accept](https://accept.paymob.com/)
2. سجل حساباً جديداً أو سجل الدخول إلى حسابك الحالي
3. أكمل التحقق من الحساب (قد يتطلب وثائق رسمية)

### 2. الحصول على بيانات API

1. اذهب إلى [Developers Dashboard](https://accept.paymob.com/portal2/en/developers)
2. احصل على البيانات التالية:
   - **API Key**: المفتاح الأساسي للتواصل مع API
   - **Integration ID**: معرف التكامل للبطاقات الائتمانية
   - **iFrame ID**: معرف الـ iFrame لصفحة الدفع
   - **HMAC Secret**: المفتاح السري للتحقق من صحة الطلبات

### 3. إعداد متغيرات البيئة

1. افتح ملف `.env.local` في المشروع
2. أضف البيانات التالية:

```env
# Paymob Configuration
PAYMOB_API_KEY=your_actual_api_key_here
PAYMOB_INTEGRATION_ID=your_integration_id_here
PAYMOB_IFRAME_ID=your_iframe_id_here
PAYMOB_HMAC_SECRET=your_hmac_secret_here
```

3. استبدل القيم بالبيانات الفعلية من Paymob Dashboard

### 4. إنشاء جدول الطلبات في قاعدة البيانات

1. افتح Supabase Dashboard → SQL Editor
2. افتح ملف `create-orders-table.sql` من المشروع
3. انسخ المحتوى والصقه في SQL Editor
4. اضغط **Run** ▶️

### 5. إعداد Callback URLs في Paymob

1. اذهب إلى Paymob Dashboard → Settings → Integration Settings
2. في قسم **Transaction Processed Callback**:
   - أضف: `https://your-domain.com/api/paymob/callback`
   - للتطوير المحلي: `http://localhost:3000/api/paymob/callback`

3. في قسم **Transaction Response Callback**:
   - أضف: `https://your-domain.com/api/paymob/callback`

### 6. اختبار الدفع

#### وضع الاختبار (Sandbox):
1. استخدم بطاقات الاختبار المتوفرة في [Paymob Testing Cards](https://docs.paymob.com/docs/testing-cards)
2. بطاقة اختبار ناجحة:
   - رقم البطاقة: `4987654321098769`
   - CVV: أي 3 أرقام
   - تاريخ الانتهاء: أي تاريخ مستقبلي

#### وضع الإنتاج (Live):
1. بعد اعتماد حسابك من Paymob
2. قم بتفعيل وضع الإنتاج في Dashboard
3. استخدم بيانات API الخاصة بوضع الإنتاج

## آلية العمل

### 1. المستخدم يضيف المنتجات للسلة
- المنتجات تُحفظ في CartContext

### 2. المستخدم ينقر "إتمام الطلب عبر Paymob"
- يتم التوجيه لصفحة `/checkout`

### 3. صفحة Checkout
- المستخدم يملأ معلومات الشحن (الاسم، الهاتف، العنوان، المدينة)
- عند الضغط على "الدفع"، يتم:
  1. إرسال الطلب إلى `/api/paymob/payment-key`
  2. الحصول على Payment Key من Paymob
  3. التوجيه لصفحة الدفع في Paymob

### 4. الدفع في Paymob
- المستخدم يدخل بيانات البطاقة في صفحة Paymob الآمنة
- Paymob يعالج الدفع

### 5. بعد الدفع
- **نجاح**: يتم التوجيه لـ `/order-success` ويتم تحديث حالة الطلب إلى `paid`
- **فشل**: يتم التوجيه لـ `/order-failed` وحالة الطلب تبقى `pending`

### 6. Callback من Paymob
- Paymob يرسل إشعار إلى `/api/paymob/callback`
- يتم التحقق من HMAC للأمان
- يتم تحديث حالة الطلب في قاعدة البيانات

## الملفات المضافة

### API Routes:
- `/src/app/api/paymob/payment-key/route.ts` - إنشاء payment token
- `/src/app/api/paymob/callback/route.ts` - معالجة إشعارات Paymob

### الصفحات:
- `/src/app/checkout/page.tsx` - صفحة إتمام الطلب
- `/src/app/order-success/page.tsx` - صفحة نجاح الطلب
- `/src/app/order-failed/page.tsx` - صفحة فشل الطلب

### قاعدة البيانات:
- `create-orders-table.sql` - جدول الطلبات

## حالات الطلب

- `pending` - في انتظار الدفع
- `paid` - تم الدفع بنجاح
- `failed` - فشل الدفع
- `cancelled` - تم إلغاء الطلب

## الأمان

### HMAC Verification:
- كل إشعار من Paymob يتم التحقق منه باستخدام HMAC
- يضمن أن الإشعارات حقيقية وليست مزيفة

### Row Level Security:
- المستخدمون يمكنهم رؤية طلباتهم فقط
- الأدمن يمكنهم رؤية جميع الطلبات

## استكشاف الأخطاء

### خطأ: "Could not find the table 'public.orders'"
- تأكد من تنفيذ `create-orders-table.sql` في Supabase

### خطأ: "Invalid signature"
- تأكد من أن `PAYMOB_HMAC_SECRET` صحيح في `.env.local`

### خطأ: "Order not found"
- تأكد من أن Callback URL مُعد بشكل صحيح في Paymob Dashboard

### لا يتم إعادة التوجيه بعد الدفع:
- تأكد من إعداد Redirect URLs في Paymob Dashboard
- تحقق من صحة `NEXT_PUBLIC_BASE_URL` في `.env.local`

## الدعم الفني

- [Paymob Documentation](https://docs.paymob.com/)
- [Paymob Support](https://accept.paymob.com/portal2/en/support)

---

**ملاحظة**: لا تشارك مفاتيح API الخاصة بك مع أحد! احتفظ بها آمنة في ملف `.env.local`.
