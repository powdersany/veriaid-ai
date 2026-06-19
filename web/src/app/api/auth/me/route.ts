// /api/auth/me — GET current user from JWT
import { getUserFromRequest } from "@/lib/server-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ user: null }, { status: 200 });
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organization: user.organization,
    },
  });
}
