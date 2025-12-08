-- تحديث جدول top_bar_messages ليدعم الرسائل العربية والإنجليزية

-- إضافة column جديد للرسالة العربية (إذا لم يكن موجوداً)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'top_bar_messages'
        AND column_name = 'message_ar'
    ) THEN
        -- إضافة column جديد message_ar
        ALTER TABLE top_bar_messages ADD COLUMN message_ar TEXT;

        -- نقل البيانات من message القديم إلى message_ar
        UPDATE top_bar_messages SET message_ar = message WHERE message IS NOT NULL;

        -- جعل message_ar مطلوب
        ALTER TABLE top_bar_messages ALTER COLUMN message_ar SET NOT NULL;
    END IF;
END $$;

-- إضافة column للرسالة الإنجليزية (إذا لم يكن موجوداً)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'top_bar_messages'
        AND column_name = 'message_en'
    ) THEN
        ALTER TABLE top_bar_messages ADD COLUMN message_en TEXT;
    END IF;
END $$;

-- حذف column القديم message (إذا كان موجوداً)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'top_bar_messages'
        AND column_name = 'message'
    ) THEN
        ALTER TABLE top_bar_messages DROP COLUMN message;
    END IF;
END $$;

-- إضافة updated_at إذا لم يكن موجوداً
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'top_bar_messages'
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE top_bar_messages ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- إعادة تحميل schema cache في Supabase
NOTIFY pgrst, 'reload schema';
