import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // Hardcoded Admin Check (for backward compatibility)
    if (mobile === "9999999999" && password === "admin123") {
      console.log("[LOGIN] Admin login successful");
      return NextResponse.json({
        id: "admin-id",
        name: "Admin",
        mobile: "9999999999",
        role: "admin",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { mobile },
    });

    console.log("[LOGIN] User found:", user ? "Yes" : "No");
    if (user) {
      console.log("[LOGIN] Password match:", user.password === password);
    }

    if (!user || user.password !== password) {
      console.log("[LOGIN] Authentication failed");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    console.log("[LOGIN] Login successful:", user.id);

    return NextResponse.json({
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      role: user.role,
    });
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
