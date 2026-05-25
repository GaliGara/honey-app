import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDeleteCookieOptions } from "@/lib/admin/auth";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(getDeleteCookieOptions());
  return NextResponse.json({ ok: true });
}
