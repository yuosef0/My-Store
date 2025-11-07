# 🛍️ متجر إلكتروني - Single Vendor E-commerce

متجر إلكتروني متكامل بتقنية Next.js 16 مع دمج بوابة الدفع Stripe وقاعدة بيانات Supabase.

## ✨ المميزات

- 🛒 **سلة تسوق كاملة** مع إدارة الكميات والمخزون
- 💳 **دفع آمن عبر Stripe** مع دعم جميع طرق الدفع
- 📦 **لوحة إدارة** لإضافة وإدارة المنتجات
- 🗄️ **قاعدة بيانات Supabase** لتخزين المنتجات والطلبات
- 🖼️ **رفع الصور** مع تخزين آمن في Supabase Storage
- 📱 **تصميم متجاوب** يعمل على جميع الشاشات
- 🇦🇷 **دعم اللغة العربية** مع RTL
- ⚡ **Next.js 16** مع React 19 و React Compiler

## 🛠️ التقنيات المستخدمة

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL)
- **Payment:** Stripe
- **State Management:** React Context API
- **Storage:** Supabase Storage

## 📋 المتطلبات الأساسية

- Node.js 18+ و npm/yarn
- حساب Supabase (مجاني)
- حساب Stripe (مجاني في وضع التجربة)

## 🚀 التثبيت والإعداد

### 1. نسخ المشروع

\`\`\`bash
git clone <repository-url>
cd ecom
npm install
\`\`\`

### 2. إعداد Supabase

1. إنشاء مشروع جديد على [Supabase](https://supabase.com)
2. نسخ URL و Anon Key من Project Settings > API
3. تشغيل SQL Script من ملف `supabase-schema.sql` في SQL Editor:
   - افتح لوحة تحكم Supabase
   - اذهب إلى SQL Editor
   - انسخ محتوى `supabase-schema.sql` وشغله

4. إنشاء Storage Bucket:
   - اذهب إلى Storage
   - أنشئ bucket جديد باسم `products-imges`
   - اجعله Public

### 3. إعداد Stripe

1. إنشاء حساب على [Stripe](https://stripe.com)
2. الحصول على API Keys من Dashboard > Developers > API Keys
3. نسخ Secret Key (يبدأ بـ `sk_test_...`)

4. **إعداد Webhook (مهم جداً):**
   - اذهب إلى Developers > Webhooks
   - اضغط "Add endpoint"
   - أدخل URL: `https://your-domain.com/api/webhook`
     - للتطوير المحلي استخدم [Stripe CLI](https://stripe.com/docs/stripe-cli)
   - اختر الأحداث التالية:
     - `checkout.session.completed`
     - `payment_intent.payment_failed`
     - `charge.refunded`
   - احفظ وانسخ Webhook Secret (يبدأ بـ `whsec_...`)

### 4. إعداد المتغيرات البيئية

أنشئ ملف `.env.local` ونسخ المحتوى من `.env.example`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

ثم املأ القيم:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

### 5. تشغيل المشروع

\`\`\`bash
npm run dev
\`\`\`

افتح المتصفح على [http://localhost:3000](http://localhost:3000)

## 📁 هيكل المشروع

\`\`\`
/ecom
├── src/
│   ├── app/
│   │   ├── page.tsx              # الصفحة الرئيسية (عرض المنتجات)
│   │   ├── cart/page.tsx         # صفحة السلة والدفع
│   │   ├── admin/page.tsx        # لوحة الإدارة
│   │   ├── success/page.tsx      # صفحة تأكيد الدفع
│   │   ├── canceled/page.tsx     # صفحة إلغاء الدفع
│   │   └── api/
│   │       ├── checkout/route.ts # API الدفع
│   │       └── webhook/route.ts  # Stripe Webhook
│   ├── contexts/
│   │   └── CartContext.tsx       # إدارة حالة السلة
│   └── lib/
│       └── supabaseClient.ts     # Supabase client
├── supabase-schema.sql           # SQL لإنشاء الجداول
├── .env.example                  # نموذج المتغيرات البيئية
└── README.md
\`\`\`

## 🔑 الاستخدام

### إضافة منتجات

1. اذهب إلى `/admin`
2. املأ بيانات المنتج
3. ارفع صورة المنتج
4. اضغط "إضافة المنتج"

### إجراء عملية شراء (تجريبي)

1. أضف منتجات للسلة من الصفحة الرئيسية
2. اذهب إلى السلة `/cart`
3. املأ معلومات الشحن
4. اضغط "متابعة للدفع"
5. استخدم بطاقة تجريبية:
   - **رقم البطاقة:** `4242 4242 4242 4242`
   - **تاريخ الانتهاء:** أي تاريخ مستقبلي
   - **CVC:** أي 3 أرقام
   - **الرمز البريدي:** أي رمز

## 🗄️ قاعدة البيانات

### جدول products

| Column      | Type   | Description       |
|-------------|--------|-------------------|
| id          | UUID   | المعرف الفريد     |
| title       | TEXT   | اسم المنتج        |
| slug        | TEXT   | الرابط الودي      |
| description | TEXT   | وصف المنتج        |
| price       | DECIMAL| السعر             |
| image_url   | TEXT   | رابط الصورة       |
| stock       | INT    | الكمية المتوفرة   |
| created_at  | TIMESTAMP | تاريخ الإنشاء   |

### جدول orders

| Column               | Type      | Description          |
|----------------------|-----------|----------------------|
| id                   | UUID      | المعرف الفريد        |
| customer_name        | TEXT      | اسم العميل           |
| customer_email       | TEXT      | البريد الإلكتروني    |
| customer_phone       | TEXT      | رقم الهاتف           |
| customer_address     | TEXT      | العنوان              |
| customer_city        | TEXT      | المدينة              |
| total_amount         | DECIMAL   | المبلغ الإجمالي      |
| stripe_session_id    | TEXT      | معرف جلسة Stripe     |
| stripe_payment_intent| TEXT      | معرف الدفع           |
| payment_status       | TEXT      | حالة الدفع           |
| order_status         | TEXT      | حالة الطلب           |
| items                | JSONB     | تفاصيل المنتجات     |
| created_at           | TIMESTAMP | تاريخ الطلب          |

## 🧪 الاختبار

### اختبار الدفع الناجح
1. استخدم بطاقة `4242 4242 4242 4242`
2. يجب أن يوجهك لصفحة `/success`
3. تحقق من Supabase أن الطلب تم حفظه بحالة `paid`

### اختبار الدفع الفاشل
1. استخدم بطاقة `4000 0000 0000 0002`
2. يجب أن تظهر رسالة خطأ من Stripe

### اختبار Webhook محلياً
\`\`\`bash
# تثبيت Stripe CLI
brew install stripe/stripe-cli/stripe

# تسجيل الدخول
stripe login

# تشغيل webhook forwarding
stripe listen --forward-to localhost:3000/api/webhook

# في نافذة أخرى، اختبر webhook
stripe trigger checkout.session.completed
\`\`\`

## 🚢 النشر (Deployment)

### Vercel (موصى به)

1. Push المشروع على GitHub
2. اربط الحساب مع [Vercel](https://vercel.com)
3. استورد المشروع
4. أضف Environment Variables من `.env.local`
5. انشر المشروع

**⚠️ مهم بعد النشر:**
- حدث `NEXT_PUBLIC_BASE_URL` لرابط الإنتاج
- حدث Stripe Webhook URL لرابط الإنتاج

## 🔒 الأمان

- ✅ جميع API Keys مخزنة في متغيرات بيئية
- ✅ Stripe Webhook محمي بتوقيع
- ✅ Row Level Security مفعل على Supabase
- ✅ التحقق من صحة البيانات في الـ API routes

## 🐛 استكشاف الأخطاء

### خطأ "Stripe is not defined"
- تأكد من إضافة `STRIPE_SECRET_KEY` في `.env.local`

### خطأ "Supabase connection failed"
- تأكد من صحة `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### لا يتم تحديث حالة الطلب بعد الدفع
- تأكد من تفعيل Webhook في Stripe
- تحقق من صحة `STRIPE_WEBHOOK_SECRET`
- في التطوير المحلي، استخدم Stripe CLI

## 📝 الترخيص

MIT License - يمكنك استخدام المشروع بحرية.

## 🤝 المساهمة

المساهمات مرحب بها! افتح Issue أو Pull Request.

## 📞 الدعم

لأي استفسارات، يرجى فتح Issue على GitHub.

---

صُنع بـ ❤️ باستخدام Next.js و Stripe
