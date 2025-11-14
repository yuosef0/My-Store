# دليل إعداد بوابات الدفع 💳

هذا المشروع يدعم بوابتي دفع: **Stripe** و **Paymob**

## 📋 المتطلبات الأساسية

1. نسخ ملف `.env.example` إلى `.env.local`:
```bash
cp .env.example .env.local
```

2. إضافة مفاتيح API الخاصة بك في ملف `.env.local`

---

## 🔵 إعداد Stripe

### الخطوة 1: إنشاء حساب Stripe
1. اذهب إلى [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. أنشئ حساب جديد أو سجل الدخول

### الخطوة 2: الحصول على API Keys
1. اذهب إلى [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. انسخ:
   - **Secret key** (يبدأ بـ `sk_test_` للتجربة أو `sk_live_` للإنتاج)
   - **Publishable key** (يبدأ بـ `pk_test_` للتجربة أو `pk_live_` للإنتاج)
3. ضعهم في ملف `.env.local`:
```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
```

### الخطوة 3: إعداد Webhook
1. اذهب إلى [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. اضغط على "Add endpoint"
3. أدخل URL الخاص بك: `https://yourdomain.com/api/webhook`
4. اختر الأحداث:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. انسخ **Signing secret** (يبدأ بـ `whsec_`)
6. ضعه في `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

### للتطوير المحلي (Local Testing):
استخدم Stripe CLI لتوجيه الـ webhooks:
```bash
# تثبيت Stripe CLI
brew install stripe/stripe-cli/stripe

# تسجيل الدخول
stripe login

# توجيه webhooks
stripe listen --forward-to localhost:3000/api/webhook
```

---

## 🟢 إعداد Paymob

### الخطوة 1: إنشاء حساب Paymob
1. اذهب إلى [https://accept.paymob.com/portal2/en/register](https://accept.paymob.com/portal2/en/register)
2. أنشئ حساب تاجر جديد
3. أكمل عملية التسجيل والتحقق

### الخطوة 2: الحصول على API Key
1. اذهب إلى **Settings** → **Account Info**
2. انسخ **API Key**
3. ضعه في `.env.local`:
```env
PAYMOB_API_KEY=your_paymob_api_key
```

### الخطوة 3: الحصول على Integration ID
1. اذهب إلى **Developers** → **Payment Integrations**
2. اختر **Online Card** integration
3. انسخ **Integration ID**
4. ضعه في `.env.local`:
```env
PAYMOB_INTEGRATION_ID=123456
```

### الخطوة 4: الحصول على iFrame ID
1. اذهب إلى **Developers** → **iFrames**
2. أنشئ iFrame جديد أو استخدم موجود
3. انسخ **iFrame ID**
4. ضعه في `.env.local`:
```env
PAYMOB_IFRAME_ID=123456
```

### الخطوة 5: الحصول على HMAC Secret
1. اذهب إلى **Developers** → **HMAC Calculation**
2. انسخ **HMAC Secret**
3. ضعه في `.env.local`:
```env
PAYMOB_HMAC_SECRET=your_hmac_secret
```

### الخطوة 6: إعداد Callback URLs
1. اذهب إلى **Developers** → **Payment Integrations**
2. اضغط على integration الخاص بك
3. أدخل URLs التالية:
   - **Transaction Processed Callback**: `https://yourdomain.com/api/paymob/callback`
   - **Transaction Response Callback**: `https://yourdomain.com/api/paymob/callback`

---

## 🔧 إعداد قاعدة البيانات (Supabase)

تأكد من وجود الأعمدة التالية في جدول `orders`:

```sql
-- أعمدة Stripe
stripe_session_id TEXT
stripe_payment_intent_id TEXT

-- أعمدة Paymob
paymob_order_id TEXT
paymob_transaction_id TEXT

-- أعمدة مشتركة
payment_method TEXT -- 'stripe' or 'paymob_card'
payment_status TEXT -- 'pending', 'paid', 'failed'
order_status TEXT -- 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'
```

---

## 🧪 الاختبار

### بطاقات اختبار Stripe:
- **بطاقة ناجحة**: `4242 4242 4242 4242`
- **بطاقة فاشلة**: `4000 0000 0000 0002`
- **بطاقة تتطلب 3D Secure**: `4000 0025 0000 3155`
- **أي CVV**: `123`
- **أي تاريخ انتهاء مستقبلي**: `12/34`

### بطاقات اختبار Paymob:
استخدم البطاقات التجريبية المتوفرة في [Paymob Test Cards](https://docs.paymob.com/docs/card-payments#test-cards)

---

## 📝 ملاحظات مهمة

### للإنتاج (Production):
1. **Stripe**:
   - غيّر من `sk_test_` إلى `sk_live_`
   - غيّر من `pk_test_` إلى `pk_live_`
   - حدّث Webhook endpoint

2. **Paymob**:
   - استخدم مفاتيح الإنتاج (Live Keys)
   - حدّث Callback URLs

3. **عام**:
   - حدّث `NEXT_PUBLIC_BASE_URL` إلى domain الفعلي
   - فعّل HTTPS
   - راجع جميع إعدادات الأمان

### العملات:
- **Stripe**: يدعم USD, EUR, EGP وعملات أخرى
- **Paymob**: يدعم EGP بشكل أساسي

---

## 🆘 المساعدة والدعم

### Stripe:
- [Documentation](https://stripe.com/docs)
- [Dashboard](https://dashboard.stripe.com/)
- [Support](https://support.stripe.com/)

### Paymob:
- [Documentation](https://docs.paymob.com/)
- [Dashboard](https://accept.paymob.com/)
- [Support](https://accept.paymob.com/contact)

---

## ✅ قائمة التحقق النهائية

- [ ] نسخ `.env.example` إلى `.env.local`
- [ ] إضافة Stripe keys
- [ ] إضافة Stripe webhook secret
- [ ] إضافة Paymob API key
- [ ] إضافة Paymob Integration ID
- [ ] إضافة Paymob iFrame ID
- [ ] إضافة Paymob HMAC secret
- [ ] تحديث Paymob callback URLs
- [ ] إعادة تشغيل السيرفر بعد تحديث `.env.local`
- [ ] اختبار عملية دفع تجريبية

---

🎉 **الآن أصبح نظام الدفع جاهزًا للعمل!**
