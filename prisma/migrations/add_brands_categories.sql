-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- Step 1: Add new columns as nullable
ALTER TABLE "Product" ADD COLUMN "categoryId" TEXT;
ALTER TABLE "Product" ADD COLUMN "brandId" TEXT;

-- Step 2: Migrate existing categories to Category table
INSERT INTO "Category" (id, name, "createdAt")
SELECT gen_random_uuid(), DISTINCT "category", NOW()
FROM "Product"
WHERE "category" IS NOT NULL;

-- Step 3: Update products to reference categories
UPDATE "Product" p
SET "categoryId" = c.id
FROM "Category" c
WHERE p."category" = c.name;

-- Step 4: Make categoryId NOT NULL
ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

-- Step 5: Drop old category column
ALTER TABLE "Product" DROP COLUMN "category";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
