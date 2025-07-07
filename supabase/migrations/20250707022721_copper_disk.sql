/*
  # Insert Sample Data for Football App

  1. Sample Teams
    - Add 8 teams representing Mauritanian football clubs
  
  2. Sample Players
    - Add players for each team with realistic data
  
  3. Sample Matches
    - Add upcoming and completed matches
  
  4. Sample News
    - Add featured and regular news articles
  
  5. Sample Shop Data
    - Add categories and products
*/

-- Insert sample teams
INSERT INTO teams (name, city, coach, home_stadium, founded_year, description) VALUES
('نادي الرياضة', 'نواكشوط', 'أحمد ولد محمد', 'ملعب الرياضة', 1945, 'أقدم الأندية الموريتانية وأكثرها تتويجاً بالألقاب'),
('نادي الوحدة', 'نواكشوط', 'محمد ولد أحمد', 'ملعب الوحدة', 1960, 'نادي عريق يمثل العاصمة الموريتانية'),
('نادي كيفة', 'كيفة', 'عبد الله ولد سيدي', 'ملعب كيفة', 1970, 'نادي من أقوى أندية الداخل الموريتاني'),
('نادي الهلال', 'نواذيبو', 'إبراهيم ولد محمد', 'ملعب نواذيبو', 1965, 'يمثل المدينة الاقتصادية الثانية'),
('نادي النجمة', 'روصو', 'محمد الأمين ولد أحمد', 'ملعب روصو', 1975, 'نادي حدودي يطمح للعودة للمقدمة'),
('نادي الاتحاد', 'زويرات', 'أحمد ولد عبد الله', 'ملعب زويرات', 1980, 'نادي مدينة المناجم'),
('نادي التقدم', 'أطار', 'محمد ولد إبراهيم', 'ملعب أطار', 1985, 'نادي يمثل منطقة أدرار'),
('نادي الأمل', 'كيهيدي', 'عبد الرحمن ولد أحمد', 'ملعب كيهيدي', 1990, 'نادي صاعد يسعى لإثبات وجوده');

-- Insert sample players
INSERT INTO players (team_id, name, position, jersey_number, age, height, weight, bio) 
SELECT 
  t.id,
  CASE 
    WHEN t.name = 'نادي الرياضة' THEN 
      CASE row_number() OVER (PARTITION BY t.id ORDER BY random())
        WHEN 1 THEN 'محمد ولد أحمد'
        WHEN 2 THEN 'عبد الله ولد محمد'
        WHEN 3 THEN 'إبراهيم ولد عبد الله'
        WHEN 4 THEN 'أحمد ولد إبراهيم'
        WHEN 5 THEN 'محمد الأمين ولد أحمد'
      END
    WHEN t.name = 'نادي الوحدة' THEN
      CASE row_number() OVER (PARTITION BY t.id ORDER BY random())
        WHEN 1 THEN 'عبد الرحمن ولد محمد'
        WHEN 2 THEN 'محمد ولد عبد الرحمن'
        WHEN 3 THEN 'أحمد ولد عبد الله'
        WHEN 4 THEN 'إبراهيم ولد أحمد'
        WHEN 5 THEN 'عبد الله ولد إبراهيم'
      END
    ELSE 'لاعب ' || t.name
  END,
  CASE (row_number() OVER (PARTITION BY t.id ORDER BY random()) - 1) % 4
    WHEN 0 THEN 'مهاجم'
    WHEN 1 THEN 'وسط'
    WHEN 2 THEN 'مدافع'
    WHEN 3 THEN 'حارس مرمى'
  END,
  (row_number() OVER (PARTITION BY t.id ORDER BY random()) - 1) % 23 + 1,
  22 + (random() * 10)::integer,
  170 + (random() * 20)::integer,
  65 + (random() * 20)::integer,
  'لاعب موهوب يمثل النادي بكل فخر واعتزاز'
FROM teams t
CROSS JOIN generate_series(1, 5) -- 5 players per team
ORDER BY t.name, random();

-- Insert sample matches
INSERT INTO matches (home_team_id, away_team_id, home_team_name, away_team_name, match_date, venue, referee, status, home_score, away_score, round) 
SELECT 
  t1.id,
  t2.id,
  t1.name,
  t2.name,
  now() + (random() * interval '30 days'),
  t1.home_stadium,
  'الحكم ' || (random() * 10)::integer,
  CASE 
    WHEN random() < 0.3 THEN 'completed'
    WHEN random() < 0.1 THEN 'live'
    ELSE 'scheduled'
  END,
  CASE WHEN random() < 0.4 THEN (random() * 4)::integer ELSE 0 END,
  CASE WHEN random() < 0.4 THEN (random() * 4)::integer ELSE 0 END,
  'الجولة ' || ((random() * 10)::integer + 1)
FROM teams t1
CROSS JOIN teams t2
WHERE t1.id != t2.id
ORDER BY random()
LIMIT 20;

-- Insert sample news
INSERT INTO news (title, content, author, is_featured, published) VALUES
('انطلاق الموسم الجديد من الدوري الموريتاني', 'انطلق الموسم الجديد من الدوري الموريتاني الممتاز بمشاركة 16 فريقاً يتنافسون على لقب البطولة. وتشهد هذه النسخة منافسة قوية بين الأندية التقليدية والصاعدة الجديدة.', 'محمد ولد أحمد', true, true),
('نادي الرياضة يتعاقد مع مدرب جديد', 'أعلن نادي الرياضة عن تعاقده مع مدرب جديد لقيادة الفريق في الموسم الجديد. المدرب الجديد يحمل خبرة واسعة في تدريب الأندية الموريتانية.', 'عبد الله ولد محمد', true, true),
('تأهل المنتخب الموريتاني لكأس الأمم الأفريقية', 'تأهل المنتخب الموريتاني لكأس الأمم الأفريقية بعد فوزه في المباراة الحاسمة. هذا التأهل يعتبر إنجازاً تاريخياً للكرة الموريتانية.', 'إبراهيم ولد عبد الله', true, true),
('افتتاح ملعب جديد في نواكشوط', 'تم افتتاح ملعب جديد في العاصمة نواكشوط بمواصفات عالمية. الملعب سيستضيف مباريات الدوري المحلي والمباريات الدولية.', 'أحمد ولد إبراهيم', false, true),
('نادي الوحدة يفوز بكأس الاتحاد', 'حقق نادي الوحدة فوزاً مستحقاً بكأس الاتحاد بعد مباراة مثيرة أمام نادي الهلال. هذا اللقب هو الثاني للنادي هذا الموسم.', 'محمد الأمين ولد أحمد', false, true);

-- Insert sample shop categories
INSERT INTO shop_categories (name, description) VALUES
('قمصان الفرق', 'قمصان رسمية لجميع الفرق المشاركة في الدوري'),
('معدات التدريب', 'معدات وأدوات التدريب للاعبين والمدربين'),
('إكسسوارات', 'إكسسوارات وهدايا تذكارية للمشجعين'),
('أحذية كرة القدم', 'أحذية كرة القدم بأنواعها المختلفة'),
('حقائب رياضية', 'حقائب لحمل المعدات الرياضية');

-- Insert sample shop items
INSERT INTO shop_items (category_id, name, description, price, stock_quantity, size, color)
SELECT 
  c.id,
  CASE c.name
    WHEN 'قمصان الفرق' THEN 'قميص نادي الرياضة الرسمي'
    WHEN 'معدات التدريب' THEN 'كرة تدريب احترافية'
    WHEN 'إكسسوارات' THEN 'وشاح نادي الوحدة'
    WHEN 'أحذية كرة القدم' THEN 'حذاء كرة قدم احترافي'
    WHEN 'حقائب رياضية' THEN 'حقيبة رياضية كبيرة'
  END,
  CASE c.name
    WHEN 'قمصان الفرق' THEN 'قميص رسمي بجودة عالية مصنوع من أفضل الخامات'
    WHEN 'معدات التدريب' THEN 'كرة تدريب بمواصفات دولية مناسبة لجميع المستويات'
    WHEN 'إكسسوارات' THEN 'وشاح رسمي للنادي مصنوع من الحرير الطبيعي'
    WHEN 'أحذية كرة القدم' THEN 'حذاء كرة قدم بتقنية متطورة للأداء الأمثل'
    WHEN 'حقائب رياضية' THEN 'حقيبة واسعة ومتينة لحمل جميع المعدات الرياضية'
  END,
  CASE c.name
    WHEN 'قمصان الفرق' THEN 2500
    WHEN 'معدات التدريب' THEN 1500
    WHEN 'إكسسوارات' THEN 800
    WHEN 'أحذية كرة القدم' THEN 4500
    WHEN 'حقائب رياضية' THEN 3200
  END,
  (random() * 50 + 10)::integer,
  CASE c.name
    WHEN 'قمصان الفرق' THEN CASE (random() * 3)::integer WHEN 0 THEN 'S' WHEN 1 THEN 'M' ELSE 'L' END
    WHEN 'أحذية كرة القدم' THEN (40 + (random() * 6)::integer)::text
    ELSE 'مقاس واحد'
  END,
  CASE c.name
    WHEN 'قمصان الفرق' THEN CASE (random() * 3)::integer WHEN 0 THEN 'أزرق' WHEN 1 THEN 'أحمر' ELSE 'أبيض' END
    WHEN 'أحذية كرة القدم' THEN CASE (random() * 2)::integer WHEN 0 THEN 'أسود' ELSE 'أبيض' END
    ELSE 'متعدد الألوان'
  END
FROM shop_categories c
CROSS JOIN generate_series(1, 3) -- 3 items per category
ORDER BY c.name, random();