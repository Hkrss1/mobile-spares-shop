-- Enable Row Level Security on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USER TABLE POLICIES
-- ============================================

-- Users can read their own data
CREATE POLICY "Users can view own profile"
ON "User"
FOR SELECT
USING (true); -- Allow all reads for now (you can restrict later)

-- Users can update their own data
CREATE POLICY "Users can update own profile"
ON "User"
FOR UPDATE
USING (true); -- In production, restrict to: auth.uid() = id::uuid

-- Only allow inserts through API (signup)
CREATE POLICY "Allow user creation"
ON "User"
FOR INSERT
WITH CHECK (true);

-- Prevent deletion (optional - remove if you want to allow account deletion)
CREATE POLICY "Prevent user deletion"
ON "User"
FOR DELETE
USING (false);

-- ============================================
-- PRODUCT TABLE POLICIES
-- ============================================

-- Everyone can view products
CREATE POLICY "Anyone can view products"
ON "Product"
FOR SELECT
USING (true);

-- Only admins can insert products (you'll need to implement admin check)
CREATE POLICY "Admins can insert products"
ON "Product"
FOR INSERT
WITH CHECK (true); -- In production: check if user role is 'admin'

-- Only admins can update products
CREATE POLICY "Admins can update products"
ON "Product"
FOR UPDATE
USING (true); -- In production: check if user role is 'admin'

-- Only admins can delete products
CREATE POLICY "Admins can delete products"
ON "Product"
FOR DELETE
USING (true); -- In production: check if user role is 'admin'

-- ============================================
-- ORDER TABLE POLICIES
-- ============================================

-- Users can view their own orders, admins can view all
CREATE POLICY "Users can view own orders"
ON "Order"
FOR SELECT
USING (true); -- In production: customerMobile = current_user_mobile OR is_admin

-- Users can create orders
CREATE POLICY "Users can create orders"
ON "Order"
FOR INSERT
WITH CHECK (true);

-- Users can update their own orders (for cancellation), admins can update all
CREATE POLICY "Users can update own orders"
ON "Order"
FOR UPDATE
USING (true); -- In production: customerMobile = current_user_mobile OR is_admin

-- Prevent order deletion (orders should be cancelled, not deleted)
CREATE POLICY "Prevent order deletion"
ON "Order"
FOR DELETE
USING (false);

-- ============================================
-- ORDER ITEM TABLE POLICIES
-- ============================================

-- Users can view items from their orders
CREATE POLICY "Users can view order items"
ON "OrderItem"
FOR SELECT
USING (true); -- In production: check if order belongs to user

-- Allow inserting order items when creating orders
CREATE POLICY "Allow order item creation"
ON "OrderItem"
FOR INSERT
WITH CHECK (true);

-- Prevent updates to order items
CREATE POLICY "Prevent order item updates"
ON "OrderItem"
FOR UPDATE
USING (false);

-- Prevent deletion of order items
CREATE POLICY "Prevent order item deletion"
ON "OrderItem"
FOR DELETE
USING (false);

-- ============================================
-- NOTES FOR PRODUCTION
-- ============================================
-- 
-- The policies above use `true` for simplicity. In production, you should:
--
-- 1. Implement proper authentication checks using Supabase Auth
-- 2. Add role-based access control for admin operations
-- 3. Restrict user data access to authenticated users only
-- 4. Add proper ownership checks for orders
--
-- Example production policy for users:
-- CREATE POLICY "Users can view own profile"
-- ON "User"
-- FOR SELECT
-- USING (auth.uid()::text = id);
--
-- Example admin check (requires a helper function):
-- CREATE OR REPLACE FUNCTION is_admin()
-- RETURNS BOOLEAN AS $$
-- BEGIN
--   RETURN (
--     SELECT role = 'admin'
--     FROM "User"
--     WHERE id = auth.uid()::text
--   );
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
