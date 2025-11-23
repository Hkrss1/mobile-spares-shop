-- Complete Database Seed Script for Mobile Spares Shop
-- Run this in Supabase SQL Editor

-- Step 1: Create Categories (if they don't exist)
INSERT INTO "Category" (id, name, "createdAt")
VALUES 
  ('cat_displays', 'Displays', NOW()),
  ('cat_batteries', 'Batteries', NOW()),
  ('cat_cameras', 'Cameras', NOW()),
  ('cat_housings', 'Housings', NOW()),
  ('cat_charging', 'Charging', NOW()),
  ('cat_audio', 'Audio', NOW()),
  ('cat_sensors', 'Sensors', NOW()),
  ('cat_tools', 'Tools', NOW())
ON CONFLICT (name) DO NOTHING;

-- Step 2: Create Brands (if they don't exist)
INSERT INTO "Brand" (id, name, "createdAt")
VALUES 
  ('brand_apple', 'Apple', NOW()),
  ('brand_samsung', 'Samsung', NOW()),
  ('brand_generic', 'Generic', NOW())
ON CONFLICT (name) DO NOTHING;

-- Step 3: Create Location (if it doesn't exist)
INSERT INTO "Location" (id, name, address, "createdAt", "updatedAt")
VALUES 
  ('loc_main', 'Main Warehouse', '123 Main Street, City', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Step 4: Add Stock Levels for ALL existing products
-- This will create stock entries for products that don't have them yet
INSERT INTO "StockLevel" (id, "productId", "locationId", quantity, "updatedAt")
SELECT 
  'stock_' || p.id,
  p.id,
  'loc_main',
  25,
  NOW()
FROM "Product" p
WHERE NOT EXISTS (
  SELECT 1 FROM "StockLevel" sl 
  WHERE sl."productId" = p.id AND sl."locationId" = 'loc_main'
);

-- Step 5: Update existing stock levels to 25
UPDATE "StockLevel" SET quantity = 25;

-- Verify the results
SELECT 
  p.name,
  p.price,
  c.name as category,
  b.name as brand,
  COALESCE(SUM(sl.quantity), 0) as total_stock
FROM "Product" p
LEFT JOIN "Category" c ON p."categoryId" = c.id
LEFT JOIN "Brand" b ON p."brandId" = b.id
LEFT JOIN "StockLevel" sl ON sl."productId" = p.id
GROUP BY p.id, p.name, p.price, c.name, b.name
ORDER BY p.name
LIMIT 20;
