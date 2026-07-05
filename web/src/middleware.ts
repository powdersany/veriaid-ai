import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "veriaid_session";
const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ?? "veriaid-dev-secret-change-me-in-production-please",
);

const protectedPrefixes = ["/dashboard", "/admin"];

async function getRole(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET, { algorithms: ["HS256"] });
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  if (!needsAuth) return NextResponse.next();

  const role = await getRole(request);
  if (!role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
