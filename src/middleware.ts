import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Paths that require authentication
    const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

    // If not a protected path, continue
    if (!isAdminPath) {
        return NextResponse.next();
    }

    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        // For API routes, return 401 instead of redirect
        if (pathname.startsWith("/api")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = await verifyJWT(token);

    if (!payload) {
        // Invalid token
        if (pathname.startsWith("/api")) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check Admin Role
    if (isAdminPath && payload.role !== "admin") {
        if (pathname.startsWith("/api")) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/admin/:path*",
    ],
};
