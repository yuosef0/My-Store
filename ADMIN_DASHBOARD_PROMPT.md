# Prompt لإنشاء Admin Dashboard للمتجر الإلكتروني

## نظرة عامة على المشروع

أريد إنشاء لوحة تحكم إدارية (Admin Dashboard) لمتجر إلكتروني باستخدام:
- **Framework**: Next.js 14+ مع App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Language**: TypeScript
- **Direction**: RTL (اللغة العربية)

---

## متطلبات التصميم العامة

### الألوان الأساسية:
- **Primary Color**: `#137fec` (أزرق)
- **Background Light**: `#f6f7f8`
- **Background Dark**: `#101922`
- **Card Background Dark**: `#182635`
- **Border Light**: `slate-200`
- **Border Dark**: `slate-800`

### الـ Dark Mode:
- جميع الصفحات تدعم Dark Mode
- استخدم `dark:` prefix في Tailwind

### Responsive Design:
- جميع الصفحات responsive بالكامل
- Breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- على الموبايل: استخدم Card View بدلاً من الجداول
- Padding responsive: `p-3 sm:p-4 md:p-6 lg:p-8`

---

## هيكل الملفات

```
src/
├── app/
│   └── admin/
│       ├── layout.tsx              # Layout رئيسي
│       ├── page.tsx                # لوحة التحكم الرئيسية
│       ├── orders/page.tsx         # إدارة الطلبات
│       ├── products/page.tsx       # إدارة المنتجات
│       ├── categories/page.tsx     # إدارة الأقسام
│       ├── coupons/page.tsx        # إدارة الكوبونات
│       ├── slider/page.tsx         # إدارة السلايدر
│       ├── top-bar-messages/page.tsx # رسائل الشريط العلوي
│       ├── theme-settings/page.tsx  # إعدادات الألوان
│       └── reviews/page.tsx        # إدارة التقييمات
├── components/
│   ├── AdminSidebar.tsx            # القائمة الجانبية
│   └── AdminGuard.tsx              # حماية صفحات الأدمن
└── lib/
    └── supabaseClient.ts           # Supabase Client
```

---

## 1. Admin Layout (`layout.tsx`)

```typescript
// Layout يحتوي على:
// - AdminGuard للحماية
// - Flex container مع flex-row-reverse (لـ RTL)
// - AdminSidebar
// - Main content area

interface LayoutProps {
  children: React.ReactNode;
}

// الخلفية: bg-[#f6f7f8] dark:bg-[#101922]
```

---

## 2. AdminSidebar Component

### Navigation Items:
```typescript
const navItems = [
  { name: "لوحة التحكم", href: "/admin", icon: "home" },
  { name: "إدارة الطلبات", href: "/admin/orders", icon: "shopping-bag" },
  { name: "عرض المنتجات", href: "/admin/products", icon: "cube" },
  { name: "الأقسام", href: "/admin/categories", icon: "grid" },
  { name: "الكوبونات", href: "/admin/coupons", icon: "tag" },
  { name: "السلايدر", href: "/admin/slider", icon: "image" },
  { name: "رسائل الشريط", href: "/admin/top-bar-messages", icon: "chat" },
  { name: "إعدادات الألوان", href: "/admin/theme-settings", icon: "palette" },
];
```

### المميزات:
- Mobile Header مع hamburger menu
- على Desktop: sidebar ثابت على اليمين (264px width)
- على Mobile: dropdown menu من الهيدر
- Active state: `bg-[#137fec]/10 text-[#137fec]`
- معلومات المدير في الأعلى
- زر تسجيل خروج وزر العودة للمتجر

---

## 3. لوحة التحكم الرئيسية (`page.tsx`)

### الإحصائيات (4 Cards):
```typescript
interface Stats {
  totalProducts: number;     // إجمالي المنتجات
  totalOrders: number;       // إجمالي الطلبات
  pendingOrders: number;     // الطلبات المعلقة
  totalRevenue: number;      // إجمالي الإيرادات
}
```

### تصميم الـ Stats Cards:
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- كل Card يحتوي: عنوان، قيمة كبيرة، نسبة التغيير (أخضر/أحمر)
- Background: `bg-white dark:bg-[#182635]`
- Border: `border border-slate-200 dark:border-slate-800`

### جدول آخر الطلبات:
- آخر 5 طلبات
- أعمدة: رقم الطلب، اسم العميل، المبلغ، الحالة، التاريخ، إجراءات
- Status badges بألوان مختلفة

---

## 4. إدارة الطلبات (`orders/page.tsx`)

### Interface:
```typescript
interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_address: string;
  customer_city: string;
  total_amount: number;
  payment_status: "paid" | "pending" | "failed" | "refunded";
  order_status: "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  created_at: string;
}
```

### المميزات:
- 4 Stats cards (إجمالي، قيد المعالجة، تم الشحن، مكتملة)
- شريط بحث
- جدول الطلبات مع Mobile Card View
- Modal لعرض تفاصيل الطلب
- تحديث حالة الطلب والدفع
- حذف الطلب

### Payment Status Colors:
- `paid`: green
- `pending`: yellow
- `failed`: red
- `refunded`: gray

### Order Status Colors:
- `delivered`: green
- `shipped`: blue
- `processing`: yellow
- `cancelled`: gray

---

## 5. إدارة المنتجات (`products/page.tsx`)

### Interface:
```typescript
interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  images: string[];
  stock: number;
  category_id: string | null;
  sizes: string[];
  colors: { name: string; hex: string }[];
  created_at: string;
}
```

### المميزات:
- نموذج إضافة/تعديل منتج
- رفع صور متعددة (Supabase Storage)
- اختيار المقاسات والألوان
- Tabs للفلترة: كل المنتجات، متوفر، مخزون منخفض، غير متوفر
- شريط بحث
- Checkbox للتحديد المتعدد
- Desktop Table + Mobile Card View

### Stock Status:
- `> 10`: متوفر (أخضر)
- `1-10`: مخزون منخفض (برتقالي)
- `0`: غير متوفر (أحمر)

---

## 6. إدارة الأقسام (`categories/page.tsx`)

### Interface:
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}
```

### المميزات:
- Layout: 2/3 للجدول، 1/3 للنموذج (على Desktop)
- نموذج إضافة/تعديل قسم
- Auto-generate slug من الاسم
- Toggle لتفعيل/تعطيل القسم
- أزرار تحريك للأعلى/أسفل لترتيب العرض
- Desktop Table + Mobile Card View

---

## 7. إدارة الكوبونات (`coupons/page.tsx`)

### Interface:
```typescript
interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
  created_at: string;
}
```

### المميزات:
- نموذج إضافة/تعديل كوبون
- نوع الخصم: نسبة مئوية أو مبلغ ثابت
- تحديد الحد الأدنى للشراء
- تحديد عدد مرات الاستخدام
- تحديد تاريخ انتهاء الصلاحية
- Filter chips: الكل، نشط، منتهي الصلاحية، مستخدم بالكامل
- شريط بحث

### Coupon Status:
- نشط: أخضر (is_active && !expired && !fullyUsed)
- منتهي الصلاحية: أحمر
- مستخدم بالكامل: رمادي
- غير نشط: رمادي

---

## 8. إدارة السلايدر (`slider/page.tsx`)

### Interface:
```typescript
interface SliderImage {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}
```

### المميزات:
- رفع صور (drag & drop أو browse)
- معاينة الصورة قبل الرفع
- عنوان ووصف اختياري
- ترتيب العرض مع أزرار تحريك
- Toggle للتفعيل
- Desktop Table مع معاينة صغيرة
- Mobile Card View مع معاينة كاملة

---

## 9. رسائل الشريط العلوي (`top-bar-messages/page.tsx`)

### Interface:
```typescript
interface TopBarMessage {
  id: string;
  message_ar: string;
  message_en: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}
```

### المميزات:
- نموذج إضافة/تعديل رسالة
- رسالة بالعربية (مطلوب) والإنجليزية (اختياري)
- ترتيب العرض
- Toggle للتفعيل/تعطيل
- Card-based list للرسائل
- الرسائل تتغير تلقائياً كل 4 ثواني في الموقع

---

## 10. إعدادات الألوان (`theme-settings/page.tsx`)

### Interface:
```typescript
interface ThemeSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_label: string;
  setting_description: string;
}
```

### الإعدادات:
```typescript
const defaultColors = {
  primary_color: "#e60000",      // اللون الأساسي
  primary_hover: "#cc0000",      // لون الـ hover
  top_bar_bg: "#e60000",         // خلفية الشريط العلوي
  button_text: "#ffffff",        // لون نص الأزرار
  price_color: "#e60000",        // لون الأسعار
  product_card_bg: "#ffffff",    // خلفية كارد المنتج
};
```

### المميزات:
- Color picker لكل لون
- Input لإدخال Hex مباشرة
- معاينة حية للألوان (الشريط، الأزرار، الأسعار، كارد المنتج)
- زر إعادة تعيين للافتراضي
- تطبيق فوري على الصفحة الحالية

---

## 11. إدارة التقييمات (`reviews/page.tsx`)

### Interface:
```typescript
interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  rating: number;  // 1-5
  title: string | null;
  comment: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  products?: { title: string; slug: string };
}
```

### المميزات:
- عرض التقييمات مع النجوم
- Filter tabs: الكل، معتمدة، قيد المراجعة
- الموافقة/إلغاء الموافقة على التقييم
- Modal لعرض تفاصيل التقييم
- حذف التقييم
- عرض معلومات المنتج والعميل
- Badge للعميل المؤكد

---

## المكونات المشتركة

### Loading State:
```jsx
<div className="p-8 text-center">
  <div className="inline-block w-8 h-8 border-4 border-[#137fec] border-t-transparent rounded-full animate-spin"></div>
  <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">جارٍ التحميل...</p>
</div>
```

### Empty State:
```jsx
<div className="p-8 text-center text-slate-500 dark:text-slate-400">
  لا توجد بيانات حالياً
</div>
```

### Success/Error Message:
```jsx
<div className={`mb-6 p-4 rounded-lg ${
  message.includes("✅")
    ? "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
    : "bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
}`}>
  {message}
</div>
```

### Table Header:
```jsx
<th className="px-4 py-3 text-slate-500 dark:text-slate-400 text-sm font-medium">
  العنوان
</th>
```

### Action Buttons:
```jsx
// Edit Button
<button className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500">
  <EditIcon />
</button>

// Delete Button
<button className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500">
  <TrashIcon />
</button>
```

---

## Database Tables (Supabase)

```sql
-- products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  images TEXT[],
  stock INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  sizes TEXT[],
  colors JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'processing',
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- coupons
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase_amount DECIMAL(10,2) DEFAULT 0,
  max_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- slider_images
CREATE TABLE slider_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- top_bar_messages
CREATE TABLE top_bar_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_ar TEXT NOT NULL,
  message_en TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- theme_settings
CREATE TABLE theme_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_label TEXT NOT NULL,
  setting_description TEXT
);

-- reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- admins
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Supabase Storage Buckets

```
Buckets:
- products-imges     # صور المنتجات
- product-images     # صور السلايدر (slider/)
```

---

## API Routes (اختياري)

```
/api/reviews/[id]    # PATCH: تحديث التقييم, DELETE: حذف التقييم
```

---

## ملاحظات إضافية

1. **RTL Support**: استخدم `flex-row-reverse` للـ layout الرئيسي
2. **Icons**: استخدم SVG icons من Heroicons أو أي مكتبة أخرى
3. **Forms**: استخدم controlled components مع useState
4. **Validation**: تحقق من البيانات قبل الإرسال
5. **Error Handling**: اعرض رسائل خطأ واضحة للمستخدم
6. **Loading States**: اعرض spinner أثناء التحميل
7. **Confirmation**: اطلب تأكيد قبل الحذف
8. **Responsive Tables**: استخدم Card View على الموبايل بدلاً من الجداول

---

## كيفية الاستخدام

1. انسخ هذا الـ Prompt
2. أرسله لأي AI (Claude, ChatGPT, etc.) أو مطور
3. حدد أي صفحات تريد إنشاءها أولاً
4. راجع الكود المُنشأ وعدّله حسب احتياجاتك
