/*
  # إضافة عمود الترتيب للنتائج

  1. تعديل الجداول
    - إضافة عمود `rank` إلى جدول `results`
    - إضافة عمود `rank` إلى جدول `reciters`
  
  2. الأمان
    - الحفاظ على سياسات RLS الموجودة
    - لا توجد تغييرات على الأمان
*/

-- إضافة عمود الترتيب إلى جدول results
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'results' AND column_name = 'rank'
  ) THEN
    ALTER TABLE results ADD COLUMN rank integer;
  END IF;
END $$;

-- إضافة عمود الترتيب إلى جدول reciters
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reciters' AND column_name = 'rank'
  ) THEN
    ALTER TABLE reciters ADD COLUMN rank integer;
  END IF;
END $$;