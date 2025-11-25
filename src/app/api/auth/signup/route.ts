import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signJWT } from "@/lib/jwt";

// Force Node.js runtime (required for Prisma)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, mobile, password } = body;

    console.log("[SIGNUP] Received request:", {
      name,
      mobile,
      passwordLength: password?.length,
    });
    console.log("[SIGNUP] DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log(
      "[SIGNUP] DATABASE_URL starts with:",
      process.env.DATABASE_URL?.substring(0, 20),
    );

    if (!name || !mobile || !password) {
      console.log("[SIGNUP] Missing fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Test database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("[SIGNUP] Database connection successful");
    } catch (dbError) {
      console.error("[SIGNUP] Database connection failed:", dbError);
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: dbError instanceof Error ? dbError.message : "Unknown error",
        },
        { status: 500 },
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { mobile },
    });

    if (existingUser) {
      console.log("[SIGNUP] User already exists:", mobile);
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    // Create new user
    // Note: In a real app, you should hash the password using bcrypt
    const user = await prisma.user.create({
      data: {
        name,
        mobile,
        password, // Storing plain text as per current implementation (should be improved)
      },
    });

    console.log("[SIGNUP] User created successfully:", user.id);

    // Generate JWT
    const token = await signJWT({
      id: user.id,
      role: user.role.toLowerCase(),
      name: user.name,
    });

    // Set Cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      role: user.role.toLowerCase(), // Normalize to lowercase for frontend
    });
  } catch (error) {
    console.error("[SIGNUP] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
