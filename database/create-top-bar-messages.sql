-- ================================================
-- Create Top Bar Messages Table
-- إنشاء جدول رسائل الشريط الأحمر
-- ================================================

-- إنشاء جدول الرسائل
CREATE TABLE IF NOT EXISTS top_bar_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إضافة بعض الرسائل الافتراضية
INSERT INTO top_bar_messages (message, is_active, display_order) VALUES
('شحن مجاني للطلبات فوق 300 جنيه', true, 1),
('خصم 25% على جميع المنتجات الجديدة', true, 2),
('توصيل سريع لجميع المحافظات', true, 3),
('منتجات أصلية 100% بأفضل الأسعار', true, 4);

-- إنشاء index للبحث السريع
CREATE INDEX IF NOT EXISTS idx_top_bar_messages_active ON top_bar_messages(is_active);
CREATE INDEX IF NOT EXISTS idx_top_bar_messages_order ON top_bar_messages(display_order);

-- ================================================
-- Row Level Security (RLS) Policies
-- ================================================

-- تفعيل RLS
ALTER TABLE top_bar_messages ENABLE ROW LEVEL SECURITY;

-- سياسة: الجميع يمكنهم قراءة الرسائل النشطة
DROP POLICY IF EXISTS "Anyone can view active messages" ON top_bar_messages;
CREATE POLICY "Anyone can view active messages"
    ON top_bar_messages FOR SELECT
    USING (is_active = true);

-- سياسة: المسؤولون فقط يمكنهم إضافة الرسائل
DROP POLICY IF EXISTS "Admins can insert messages" ON top_bar_messages;
CREATE POLICY "Admins can insert messages"
    ON top_bar_messages FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- سياسة: المسؤولون فقط يمكنهم تعديل الرسائل
DROP POLICY IF EXISTS "Admins can update messages" ON top_bar_messages;
CREATE POLICY "Admins can update messages"
    ON top_bar_messages FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- سياسة: المسؤولون فقط يمكنهم حذف الرسائل
DROP POLICY IF EXISTS "Admins can delete messages" ON top_bar_messages;
CREATE POLICY "Admins can delete messages"
    ON top_bar_messages FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- التحقق من الجدول
SELECT * FROM top_bar_messages ORDER BY display_order;
