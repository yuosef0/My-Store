-- ============================================
-- كود Supabase الكامل للمتجر الإلكتروني
-- Single Vendor E-commerce Store
-- قم بتشغيل هذا الكود في SQL Editor في لوحة تحكم Supabase
-- ============================================

-- ============================================
-- الخطوة 1: حذف الجداول القديمة (إذا أردت البدء من الصفر)
-- ============================================

-- احذف التعليق من الأسطر التالية إذا أردت حذف البيانات القديمة والبدء من جديد
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;


-- ============================================
-- الخطوة 2: إنشاء جدول المنتجات (Products)
-- ============================================

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 10 CHECK (stock >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- إضافة تعليق على الجدول
COMMENT ON TABLE products IS 'جدول المنتجات - يحتوي على جميع منتجات المتجر';

-- إضافة تعليقات على الأعمدة
COMMENT ON COLUMN products.id IS 'المعرف الفريد للمنتج';
COMMENT ON COLUMN products.title IS 'اسم المنتج';
COMMENT ON COLUMN products.slug IS 'الرابط الودي للمنتج (يجب أن يكون فريداً)';
COMMENT ON COLUMN products.price IS 'سعر المنتج بالجنيه المصري';
COMMENT ON COLUMN products.stock IS 'الكمية المتوفرة في المخزون';


-- ============================================
-- الخطوة 3: إنشاء جدول الطلبات (Orders)
-- ============================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_address TEXT NOT NULL,
  customer_city VARCHAR(100) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_payment_intent VARCHAR(255),
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status VARCHAR(50) NOT NULL DEFAULT 'processing' CHECK (order_status IN ('processing', 'shipped', 'delivered', 'cancelled')),
  items JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- إضافة تعليق على الجدول
COMMENT ON TABLE orders IS 'جدول الطلبات - يحتوي على جميع طلبات العملاء';

-- إضافة تعليقات على الأعمدة
COMMENT ON COLUMN orders.payment_status IS 'حالة الدفع: pending (قيد الانتظار), paid (مدفوع), failed (فشل), refunded (مسترد)';
COMMENT ON COLUMN orders.order_status IS 'حالة الطلب: processing (قيد المعالجة), shipped (تم الشحن), delivered (تم التوصيل), cancelled (ملغي)';
COMMENT ON COLUMN orders.items IS 'تفاصيل المنتجات المطلوبة بصيغة JSON';


-- ============================================
-- الخطوة 4: إنشاء Indexes للأداء السريع
-- ============================================

-- Indexes لجدول المنتجات
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

-- Indexes لجدول الطلبات
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent ON orders(stripe_payment_intent);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);

-- Index مركب للبحث السريع
CREATE INDEX IF NOT EXISTS idx_orders_status_date ON orders(order_status, created_at DESC);


-- ============================================
-- الخطوة 5: إنشاء Functions
-- ============================================

-- Function لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

COMMENT ON FUNCTION update_updated_at_column() IS 'دالة لتحديث عمود updated_at تلقائياً عند كل تعديل';

-- Function لحساب إجمالي الإيرادات
CREATE OR REPLACE FUNCTION get_total_revenue()
RETURNS DECIMAL AS $$
BEGIN
  RETURN (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE payment_status = 'paid');
END;
$$ language 'plpgsql';

COMMENT ON FUNCTION get_total_revenue() IS 'دالة لحساب إجمالي الإيرادات من الطلبات المدفوعة';

-- Function لحساب عدد الطلبات حسب الحالة
CREATE OR REPLACE FUNCTION count_orders_by_status(status_filter VARCHAR)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM orders WHERE order_status = status_filter);
END;
$$ language 'plpgsql';

COMMENT ON FUNCTION count_orders_by_status(VARCHAR) IS 'دالة لحساب عدد الطلبات حسب الحالة';


-- ============================================
-- الخطوة 6: إنشاء Triggers
-- ============================================

-- Trigger لتحديث updated_at في جدول المنتجات
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger لتحديث updated_at في جدول الطلبات
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- الخطوة 7: إعداد Row Level Security (RLS)
-- ============================================

-- تفعيل RLS على جدول المنتجات
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- السماح للجميع بقراءة المنتجات
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT USING (true);

-- السماح للجميع بإضافة منتجات (يمكن تقييدها لاحقاً)
DROP POLICY IF EXISTS "Allow public insert access to products" ON products;
CREATE POLICY "Allow public insert access to products" ON products
  FOR INSERT WITH CHECK (true);

-- السماح للجميع بتحديث المنتجات (يمكن تقييدها لاحقاً)
DROP POLICY IF EXISTS "Allow public update access to products" ON products;
CREATE POLICY "Allow public update access to products" ON products
  FOR UPDATE USING (true);

-- السماح للجميع بحذف المنتجات (يمكن تقييدها لاحقاً)
DROP POLICY IF EXISTS "Allow public delete access to products" ON products;
CREATE POLICY "Allow public delete access to products" ON products
  FOR DELETE USING (true);

-- تفعيل RLS على جدول الطلبات
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- السماح للجميع بقراءة الطلبات
DROP POLICY IF EXISTS "Allow public read access to orders" ON orders;
CREATE POLICY "Allow public read access to orders" ON orders
  FOR SELECT USING (true);

-- السماح للجميع بإضافة طلبات
DROP POLICY IF EXISTS "Allow public insert access to orders" ON orders;
CREATE POLICY "Allow public insert access to orders" ON orders
  FOR INSERT WITH CHECK (true);

-- السماح للجميع بتحديث الطلبات (يمكن تقييدها لاحقاً)
DROP POLICY IF EXISTS "Allow public update access to orders" ON orders;
CREATE POLICY "Allow public update access to orders" ON orders
  FOR UPDATE USING (true);

-- السماح للجميع بحذف الطلبات (يمكن تقييدها لاحقاً)
DROP POLICY IF EXISTS "Allow public delete access to orders" ON orders;
CREATE POLICY "Allow public delete access to orders" ON orders
  FOR DELETE USING (true);


-- ============================================
-- الخطوة 8: إضافة بيانات تجريبية (اختياري)
-- ============================================

-- يمكنك إزالة التعليق من الكود التالي لإضافة منتجات تجريبية

/*
INSERT INTO products (title, slug, description, price, stock) VALUES
('هاتف iPhone 15 Pro', 'iphone-15-pro', 'أحدث هاتف من Apple بتقنيات متطورة', 52999.00, 15),
('لابتوب Dell XPS 13', 'dell-xps-13', 'لابتوب قوي ومحمول للعمل والدراسة', 45000.00, 8),
('سماعات AirPods Pro', 'airpods-pro', 'سماعات لاسلكية بإلغاء الضوضاء', 8999.00, 25),
('ساعة Apple Watch Series 9', 'apple-watch-9', 'ساعة ذكية بميزات صحية متقدمة', 15999.00, 12),
('تابلت iPad Air', 'ipad-air', 'تابلت مثالي للإبداع والترفيه', 22999.00, 10);
*/


-- ============================================
-- الخطوة 9: التحقق من نجاح الإعداد
-- ============================================

-- عرض جميع الجداول
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- عرض جميع الـ Functions
SELECT routine_name FROM information_schema.routines
WHERE routine_type = 'FUNCTION' AND routine_schema = 'public';

-- عرض عدد المنتجات والطلبات
SELECT
  (SELECT COUNT(*) FROM products) as total_products,
  (SELECT COUNT(*) FROM orders) as total_orders;


-- ============================================
-- ملاحظات مهمة
-- ============================================

/*
1. Storage Bucket للصور:
   - اذهب إلى Storage في لوحة تحكم Supabase
   - أنشئ bucket جديد باسم "products-imges"
   - اجعل الـ bucket Public
   - أضف Policy للسماح بالقراءة والكتابة

2. متغيرات البيئة المطلوبة:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET

3. Row Level Security (RLS):
   - حالياً، جميع العمليات مسموحة للجميع
   - لإضافة أمان أكبر، قم بتقييد الـ Policies حسب المستخدمين المصرح لهم
   - مثال: السماح فقط للمسؤولين بتعديل وحذف المنتجات

4. Indexes:
   - تم إضافة Indexes للحقول الأكثر استخداماً في البحث
   - يمكن إضافة المزيد حسب الحاجة لتحسين الأداء

5. Backup:
   - ننصح بعمل نسخة احتياطية من البيانات بشكل دوري
   - Supabase توفر نسخ احتياطية تلقائية في الخطط المدفوعة

6. Monitoring:
   - استخدم لوحة تحكم Supabase لمراقبة الأداء
   - راقب استهلاك الـ API والتخزين
*/


-- ============================================
-- تم الانتهاء! ✅
-- ============================================

-- يمكنك الآن استخدام الجداول والـ Functions في تطبيق Next.js
-- تأكد من تحديث متغيرات البيئة في ملف .env.local
