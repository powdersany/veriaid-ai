/**
 * Server-side auth helpers.
 * - JWT (HS256) tokens via `jose`
 * - bcryptjs for password hashing
 * - `getUserFromRequest()` returns user from Authorization header
 */
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { prisma } from "./db";

const JWT_SECRET_RAW =
  process.env.JWT_SECRET ?? "veriaid-dev-secret-change-me-in-production-please";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_RAW);
const JWT_ALG = "HS256";
const JWT_TTL = "7d";
const COOKIE_NAME = "veriaid_session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(JWT_TTL)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { algorithms: [JWT_ALG] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Read the current user from the request.
 * Checks Authorization header first, then falls back to the session cookie.
 */
export async function getUserFromRequest(): Promise<{
  id: string;
  email: string;
  name: string;
  role: string;
  organization: string | null;
} | null> {
  const hdrs = await headers();
  const cookieStore = await cookies();

  // Try Authorization header
  const auth = hdrs.get("authorization");
  let token: string | null = null;
  if (auth?.toLowerCase().startsWith("bearer ")) {
    token = auth.slice(7).trim();
  }
  // Fall back to cookie
  if (!token) {
    token = cookieStore.get(COOKIE_NAME)?.value ?? null;
  }
  if (!token) return null;

  const session = await verifyToken(token);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      organization: true,
    },
  });
  return user;
}

export const SESSION_COOKIE = COOKIE_NAME;
