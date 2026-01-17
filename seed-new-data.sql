-- ============================================
-- 📦 إضافة بيانات جديدة للمتجر
-- ============================================
-- الفئات: رجالي، حريمي، أطفالي
-- مع منتجات وصور حقيقية
-- ============================================

-- 1️⃣ إضافة الفئات الرئيسية
-- ============================================
INSERT INTO categories (name, slug, description, image_url, display_order, is_active) VALUES
('رجالي', 'men', 'ملابس وإكسسوارات رجالي عصرية', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=500', 1, true),
('حريمي', 'women', 'ملابس وإكسسوارات حريمي أنيقة', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500', 2, true),
('أطفالي', 'kids', 'ملابس وإكسسوارات أطفال مريحة', 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=500', 3, true);

-- ============================================
-- 2️⃣ منتجات رجالي
-- ============================================
INSERT INTO products (title, slug, description, price, compare_at_price, category_id, image_url, stock, is_featured, is_active) VALUES

-- قمصان رجالي
('قميص قطن رجالي كلاسيك', 'mens-classic-cotton-shirt',
 'قميص قطن 100% بتصميم كلاسيك أنيق، مريح للارتداء اليومي، متوفر بألوان متعددة',
 249.00, 299.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', 50, true, true),

('قميص كاجوال منقوش', 'mens-casual-printed-shirt',
 'قميص كاجوال بنقشة عصرية، مناسب للمناسبات غير الرسمية والأنشطة اليومية',
 299.00, 349.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500', 40, false, true),

('قميص جينز رجالي', 'mens-denim-shirt',
 'قميص جينز عالي الجودة، تصميم عصري ومتين يناسب جميع الأوقات',
 349.00, 399.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500', 35, false, true),

-- بناطيل رجالي
('بنطلون جينز كلاسيك', 'mens-classic-jeans',
 'بنطلون جينز بقصة كلاسيكية، خامة ممتازة ومريحة، مناسب للاستخدام اليومي',
 449.00, 499.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 45, true, true),

('بنطلون قماش رسمي', 'mens-formal-pants',
 'بنطلون قماش رسمي للمكتب والمناسبات الرسمية، قصة أنيقة ومريحة',
 399.00, 449.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500', 30, false, true),

('بنطلون كارجو رجالي', 'mens-cargo-pants',
 'بنطلون كارجو متعدد الجيوب، مثالي للأنشطة اليومية والرحلات',
 349.00, 399.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=500', 40, false, true),

-- تيشيرتات رجالي
('تيشيرت قطن بولو', 'mens-polo-tshirt',
 'تيشيرت بولو قطن 100%، ألوان متعددة، مريح وأنيق',
 149.00, 199.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500', 60, false, true),

('تيشيرت رياضي', 'mens-sport-tshirt',
 'تيشيرت رياضي خامة dry-fit، مناسب للرياضة والأنشطة البدنية',
 199.00, 249.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 55, false, true),

('تيشيرت كاجوال طباعة', 'mens-casual-printed-tshirt',
 'تيشيرت قطن بطباعة عصرية وتصميم مميز',
 129.00, 179.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500', 70, true, true),

-- جاكيتات رجالي
('جاكيت جينز رجالي', 'mens-denim-jacket',
 'جاكيت جينز كلاسيكي، مناسب لجميع الفصول، تصميم عملي وأنيق',
 599.00, 699.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', 25, false, true),

('جاكيت جلد رجالي', 'mens-leather-jacket',
 'جاكيت جلد طبيعي فاخر، تصميم أنيق وعصري، يدوم طويلاً',
 1099.00, 1299.00,
 (SELECT id FROM categories WHERE slug = 'men'),
 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=500', 15, true, true);

-- ============================================
-- 3️⃣ منتجات حريمي
-- ============================================
INSERT INTO products (title, slug, description, price, compare_at_price, category_id, image_url, stock, is_featured, is_active) VALUES

-- فساتين
('فستان سهرة طويل', 'womens-long-evening-dress',
 'فستان سهرة أنيق بتصميم عصري، مناسب للمناسبات الخاصة والحفلات',
 749.00, 899.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', 20, true, true),

('فستان كاجوال صيفي', 'womens-casual-summer-dress',
 'فستان كاجوال خفيف ومريح، مثالي للصيف والنزهات',
 399.00, 449.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500', 35, false, true),

('فستان منقوش', 'womens-floral-dress',
 'فستان بنقشة زهور عصرية، قماش عالي الجودة وتصميم جميل',
 479.00, 549.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500', 30, false, true),

-- بلوزات وتوبات
('بلوزة حرير فاخرة', 'womens-silk-blouse',
 'بلوزة حرير ناعمة، تصميم راقي ومناسب للعمل والمناسبات',
 429.00, 499.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1564257577-6b29d9507d8d?w=500', 40, false, true),

('توب كاجوال', 'womens-casual-top',
 'توب كاجوال بألوان متعددة، مريح للارتداء اليومي',
 199.00, 249.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500', 50, false, true),

('بلوزة كروشيه', 'womens-crochet-blouse',
 'بلوزة كروشيه يدوية، تصميم فريد وأنيق',
 349.00, 399.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500', 25, false, true),

-- بناطيل وتنانير
('بنطلون جينز سكيني', 'womens-skinny-jeans',
 'بنطلون جينز سكيني عالي الوسط، قصة مثالية ومريحة',
 449.00, 499.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500', 45, true, true),

('تنورة ميدي كلاسيك', 'womens-midi-skirt',
 'تنورة ميدي أنيقة، مناسبة للمكتب والمناسبات الرسمية',
 349.00, 399.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500', 30, false, true),

('بنطلون واسع حريمي', 'womens-wide-pants',
 'بنطلون واسع عصري، راحة وأناقة في قطعة واحدة',
 399.00, 449.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500', 35, false, true),

-- ملابس خارجية
('كارديجان صوف حريمي', 'womens-wool-cardigan',
 'كارديجان صوف ناعم، مثالي للشتاء والأجواء الباردة',
 529.00, 599.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500', 28, false, true),

('جاكيت جلد حريمي', 'womens-leather-jacket',
 'جاكيت جلد أنيق، تصميم عصري يناسب جميع الأوقات',
 849.00, 999.00,
 (SELECT id FROM categories WHERE slug = 'women'),
 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', 18, true, true);

-- ============================================
-- 4️⃣ منتجات أطفالي
-- ============================================
INSERT INTO products (title, slug, description, price, compare_at_price, category_id, image_url, stock, is_featured, is_active) VALUES

-- ملابس أولاد
('تيشيرت أطفال ولادي', 'boys-printed-tshirt',
 'تيشيرت قطن مريح للأطفال بطباعة ملونة ومرحة',
 99.00, 149.00,
 (SELECT id FROM categories WHERE slug = 'kids'),
 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500', 60, false, true),

('بنطلون جينز أطفال', 'boys-denim-jeans',
 'بنطلون جينز للأطفال، قماش مرن ومريح يتحمل اللعب',
 199.00, 249.00,
 (SELECT id FROM categories WHERE slug = 'kids'),
 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500', 45, false, true),

('طقم رياضي أولاد', 'boys-sport-set',
 'طقم رياضي مكون من تيشيرت وشورت، مثالي للرياضة',
 249.00, 299.00,
 (SELECT id FROM categories WHERE slug = 'kids'),
 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500', 40, false, true),

('جاكيت شتوي أطفال', 'boys-winter-jacket',
 'جاكيت شتوي دافئ ومريح للأطفال، يحميهم من البرد',
 349.00, 399.00,
 (SELECT id FROM categories WHERE slug = 'kids'),
 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=500', 30, true, true),

-- ملابس بنات
('فستان أطفال بناتي', 'girls-pretty-dress',
 'فستان قطن جميل للبنات بتصميم أنيق ومريح',
 249.00, 299.00,
 (SELECT id FROM categories WHERE slug = 'kids'),
 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500', 35, true, true),

('ليقنز أطفال بناتي', 'girls-leggings',
 'ليقنز قطن مريح بألوان زاهية، مناسب للعب والحركة',
 119.00, 149.00,
 (SELECT id FROM categories WHERE slug = 'kids'),
 'https://images.unsplash.com/photo-1522706604291-210a56c3b376?w=500', 50, false, true),

('طقم بناتي كاجوال', 'girls-casual-set',
 'طقم كاجوال مكون من بلوزة وبنطلون بتصميم جميل',
 299.00, 349.00,
 (SELECT id FROM categories WHERE slug = 'kids'),
 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500', 38, false, true),

('جاكيت بناتي منقوش', 'girls-floral-jacket',
 'جاكيت جميل بنقشة زهور للبنات، دافئ وأنيق',
 379.00, 449.00,
 (SELECT id FROM categories WHERE slug = 'kids'),
 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=500', 25, false, true);

-- ============================================
-- ✅ تم إضافة جميع المنتجات!
-- ============================================
-- إجمالي: 30 منتج (11 رجالي، 11 حريمي، 8 أطفالي)
-- جميع المنتجات مع:
-- - أسماء وأوصاف بالعربي
-- - أسعار وأسعار مقارنة (خصومات)
-- - صور عالية الجودة من Unsplash
-- - كميات متوفرة
-- - بعض المنتجات مميزة (featured)
-- ============================================
