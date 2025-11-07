-- إنشاء جدول الطلبات (Orders)
-- قم بتشغيل هذا في SQL Editor في لوحة تحكم Supabase

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_address TEXT NOT NULL,
  customer_city VARCHAR(100) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_payment_intent VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
  order_status VARCHAR(50) DEFAULT 'processing', -- processing, shipped, delivered, cancelled
  items JSONB NOT NULL, -- تخزين تفاصيل المنتجات المطلوبة
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- إنشاء index للبحث السريع
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- إنشاء function لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء trigger لتحديث updated_at عند كل تعديل
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- إضافة Row Level Security (RLS) - اختياري
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- السماح بقراءة الطلبات للجميع (يمكن تخصيصها حسب الحاجة)
CREATE POLICY "Allow public read access to orders" ON orders
  FOR SELECT USING (true);

-- السماح بإضافة طلبات للجميع
CREATE POLICY "Allow public insert access to orders" ON orders
  FOR INSERT WITH CHECK (true);
