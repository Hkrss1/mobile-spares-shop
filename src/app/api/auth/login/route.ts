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
    const { mobile, password } = body;

    console.log("[LOGIN] Received request:", {
      mobile,
      passwordLength: password?.length,
    });

    if (!mobile || !password) {
      console.log("[LOGIN] Missing credentials");
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 },
      );
    }

    let authenticatedUser = null;

    // Hardcoded Admin Check (for backward compatibility)
    if (mobile === "9999999999" && password === "admin123") {
      console.log("[LOGIN] Admin login successful");
      authenticatedUser = {
        id: "admin-id",
        name: "Admin",
        mobile: "9999999999",
        role: "admin",
      };
    } else {
      // Find user in database
      const user = await prisma.user.findUnique({
        where: { mobile },
      });

      console.log("[LOGIN] User found:", user ? "Yes" : "No");
      if (user && user.password === password) {
        authenticatedUser = {
          id: user.id,
          name: user.name,
          mobile: user.mobile,
          role: user.role.toLowerCase(),
        };
      }
    }

    if (!authenticatedUser) {
      console.log("[LOGIN] Authentication failed");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    console.log("[LOGIN] Login successful:", authenticatedUser.id);

    // Generate JWT
    const token = await signJWT({
      id: authenticatedUser.id,
      role: authenticatedUser.role,
      name: authenticatedUser.name,
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

    return NextResponse.json(authenticatedUser);
  } catch (error) {
    console.error("[LOGIN] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
