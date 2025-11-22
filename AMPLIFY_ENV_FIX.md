# Amplify Environment Variables Fix

## Critical Issue

DATABASE_URL is `undefined` in Amplify Lambda functions even though it's set in Amplify Console.

## Root Cause

Next.js doesn't automatically expose environment variables to the server runtime in Amplify's Lambda@Edge deployment. You need to explicitly configure them in `next.config.ts`.

## The Fix

### 1. Updated `next.config.ts`

Added explicit environment variable configuration:

```typescript
env: {
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
}
```

This tells Next.js to include these variables in the server bundle.

### 2. Added Validation in `prisma.ts`

Added logging to help diagnose env var issues:

```typescript
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not defined!");
  console.error(
    "Available env vars:",
    Object.keys(process.env).filter((k) => k.includes("DATABASE")),
  );
}
```

## Deployment Steps

### 1. Commit and Push Changes

```bash
git add .
git commit -m "fix: Configure environment variables for Amplify Lambda runtime"
git push
```

### 2. Verify in Amplify Console

After deployment completes:

1. Go to CloudWatch Logs
2. Look for the new log messages
3. Should see DATABASE_URL being used correctly

### 3. Test the Application

- Homepage: Should load products
- Login: Should work with admin credentials
- Signup: Should allow new users

## Why This Happens

### Amplify's Lambda@Edge Deployment

When Amplify deploys Next.js:

1. **Build Phase**: Environment variables are available
2. **Runtime Phase**: Only explicitly configured env vars are passed to Lambda

### The Problem

```
Amplify Env Vars → Build ✅ → Lambda Runtime ❌
```

### The Solution

```
Amplify Env Vars → next.config.ts → Build ✅ → Lambda Runtime ✅
```

## Alternative Approaches

If this doesn't work, you can also try:

### Option 1: Use `.env.production`

Create `.env.production` file (NOT committed to git):

```
DATABASE_URL=your-connection-string
DIRECT_URL=your-direct-connection-string
```

Then in Amplify build settings, add to preBuild:

```yaml
- echo "DATABASE_URL=$DATABASE_URL" >> .env.production
- echo "DIRECT_URL=$DIRECT_URL" >> .env.production
```

### Option 2: Use Amplify's SSR Secrets

For Next.js 13+ on Amplify, use SSR Secrets:

1. Go to Amplify Console → App Settings → Environment variables
2. Click "Manage variables"
3. Add variables with "SSR Secret" type

## Verification

After deployment, check CloudWatch logs for:

```
✅ Should NOT see: "DATABASE_URL is not defined"
✅ Should see: Successful Prisma queries
✅ Should NOT see: PrismaClientConstructorValidationError
```

## Expected Timeline

- Commit & Push: 1 minute
- Amplify Build: 5-7 minutes
- Testing: 2 minutes

**Total**: ~10 minutes

---

> [!IMPORTANT]
> Make sure to push these changes and wait for Amplify to rebuild. The environment variables are already set in Amplify Console - we just needed to tell Next.js to use them.
