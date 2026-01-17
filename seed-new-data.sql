-- ============================================
-- 📦 إضافة بيانات جديدة للمتجر
-- ============================================
-- الفئات: رجالي، حريمي، أطفالي
-- مع منتجات وصور حقيقية
-- ============================================

-- 1️⃣ إضافة الفئات الرئيسية
-- ============================================
INSERT INTO categories (name, slug, description, image_url, is_active) VALUES
('رجالي', 'men', 'ملابس وإكسسوارات رجالي', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=500', true),
('حريمي', 'women', 'ملابس وإكسسوارات حريمي', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500', true),
('أطفالي', 'kids', 'ملابس وإكسسوارات أطفال', 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=500', true);

-- ============================================
-- 2️⃣ منتجات رجالي
-- ============================================
INSERT INTO products (name, description, price, discount_price, category_id, image_url, stock, is_active, created_at) VALUES
-- قمصان رجالي
('قميص قطن رجالي كلاسيك', 'قميص قطن 100% بتصميم كلاسيك أنيق، مريح للارتداء اليومي', 299.00, 249.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', 50, true, NOW()),

('قميص كاجوال منقوش', 'قميص كاجوال بنقشة عصرية، مناسب للمناسبات غير الرسمية', 349.00, 299.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500', 40, true, NOW()),

('قميص جينز رجالي', 'قميص جينز عالي الجودة، تصميم عصري ومتين', 399.00, 349.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500', 35, true, NOW()),

-- بناطيل رجالي
('بنطلون جينز كلاسيك', 'بنطلون جينز بقصة كلاسيكية، خامة ممتازة ومريحة', 499.00, 449.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 45, true, NOW()),

('بنطلون قماش رسمي', 'بنطلون قماش رسمي للمكتب والمناسبات الرسمية', 449.00, 399.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500', 30, true, NOW()),

('بنطلون كارجو رجالي', 'بنطلون كارجو متعدد الجيوب، مثالي للأنشطة اليومية', 399.00, 349.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=500', 40, true, NOW()),

-- تيشيرتات رجالي
('تيشيرت قطن بولو', 'تيشيرت بولو قطن 100%، ألوان متعددة', 199.00, 149.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500', 60, true, NOW()),

('تيشيرت رياضي', 'تيشيرت رياضي خامة dry-fit، مناسب للرياضة', 249.00, 199.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 55, true, NOW()),

('تيشيرت كاجوال طباعة', 'تيشيرت قطن بطباعة عصرية', 179.00, 129.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500', 70, true, NOW()),

-- جاكيتات رجالي
('جاكيت جينز رجالي', 'جاكيت جينز كلاسيكي، مناسب لجميع الفصول', 699.00, 599.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', 25, true, NOW()),

('جاكيت جلد رجالي', 'جاكيت جلد طبيعي فاخر، تصميم أنيق', 1299.00, 1099.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=500', 15, true, NOW());

-- ============================================
-- 3️⃣ منتجات حريمي
-- ============================================
INSERT INTO products (name, description, price, discount_price, category_id, image_url, stock, is_active, created_at) VALUES
-- فساتين
('فستان سهرة طويل', 'فستان سهرة أنيق بتصميم عصري، مناسب للمناسبات الخاصة', 899.00, 749.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', 20, true, NOW()),

('فستان كاجوال صيفي', 'فستان كاجوال خفيف ومريح، مثالي للصيف', 449.00, 399.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500', 35, true, NOW()),

('فستان منقوش', 'فستان بنقشة زهور عصرية، قماش عالي الجودة', 549.00, 479.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500', 30, true, NOW()),

-- بلوزات وتوبات
('بلوزة حرير فاخرة', 'بلوزة حرير ناعمة، تصميم راقي', 499.00, 429.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1564257577-6b29d9507d8d?w=500', 40, true, NOW()),

('توب كاجوال', 'توب كاجوال بألوان متعددة، مريح للارتداء اليومي', 249.00, 199.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500', 50, true, NOW()),

('بلوزة كروشيه', 'بلوزة كروشيه يدوية، تصميم فريد', 399.00, 349.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500', 25, true, NOW()),

-- بناطيل وتنانير
('بنطلون جينز سكيني', 'بنطلون جينز سكيني عالي الوسط، قصة مثالية', 499.00, 449.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500', 45, true, NOW()),

('تنورة ميدي كلاسيك', 'تنورة ميدي أنيقة، مناسبة للمكتب والمناسبات', 399.00, 349.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500', 30, true, NOW()),

('بنطلون واسع حريمي', 'بنطلون واسع عصري، راحة وأناقة', 449.00, 399.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500', 35, true, NOW()),

-- ملابس خارجية
('كارديجان صوف حريمي', 'كارديجان صوف ناعم، مثالي للشتاء', 599.00, 529.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500', 28, true, NOW()),

('جاكيت جلد حريمي', 'جاكيت جلد أنيق، تصميم عصري', 999.00, 849.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', 18, true, NOW());

-- ============================================
-- 4️⃣ منتجات أطفالي
-- ============================================
INSERT INTO products (name, description, price, discount_price, category_id, image_url, stock, is_active, created_at) VALUES
-- ملابس أولاد
('تيشيرت أطفال ولادي', 'تيشيرت قطن مريح للأطفال بطباعة ملونة', 149.00, 99.00,
 (SELECT id FROM categories WHERE slug = 'kids'),
 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500', 60, true, NOW()),

('بنطلون جينز أطفال', 'بنطلون جينز للأطفال، قماش مرن ومريح', 249.00, 199.00,
 (SELECT id FROM categories WHERE slug = 'kids'),
 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500', 45, true, NOW()),

('طقم رياضي أولاد', 'طقم رياضي مكون من تيشيرت وشورت', 299.00, 249.00,
 (SELECT id FROM categories WHERE slug = 'kids'),
 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500', 40, true, NOW()),

('جاكيت شتوي أطفال', 'جاكيت شتوي دافئ ومريح للأطفال', 399.00, 349.00,
 (SELECT id FROM categories WHERE slug = 'kids'),
 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=500', 30, true, NOW()),

-- ملابس بنات
('فستان أطفال بناتي', 'فستان قطن جميل للبنات بتصميم أنيق', 299.00, 249.00,
 (SELECT id FROM categories WHERE slug = 'kids'),
 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500', 35, true, NOW()),

('ليقنز أطفال بناتي', 'ليقنز قطن مريح بألوان زاهية', 149.00, 119.00,
 (SELECT id FROM categories WHERE slug = 'kids'),
 'https://images.unsplash.com/photo-1522706604291-210a56c3b376?w=500', 50, true, NOW()),

('طقم بناتي كاجوال', 'طقم كاجوال مكون من بلوزة وبنطلون', 349.00, 299.00,
 (SELECT id FROM categories WHERE slug = 'kids'),
 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500', 38, true, NOW()),

('جاكيت بناتي منقوش', 'جاكيت جميل بنقشة زهور للبنات', 449.00, 379.00,
 (SELECT id FROM categories WHERE slug = 'kids'),
 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=500', 25, true, NOW());

-- ============================================
-- ✅ تم إضافة جميع المنتجات!
-- ============================================
-- إجمالي: 30 منتج (11 رجالي، 11 حريمي، 8 أطفالي)
-- ============================================
