import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { z } from "zod";

const patchSchema = z.object({
  code: z.string().min(3).max(20).optional(),
  type: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  value: z.number().int().positive().optional(),
  active: z.boolean().optional(),
  maxUses: z.number().int().positive().nullable().optional(),
  usedCount: z.number().int().min(0).optional(),
  expiresAt: z.string().nullable().optional(),
  minOrderAmount: z.number().int().min(0).nullable().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const data: Record<string, unknown> = { ...parsed.data };
  if (typeof data.code === "string") data.code = (data.code as string).trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (data.type === "PERCENTAGE" && typeof data.value === "number" && ((data.value as number) < 1 || (data.value as number) > 100)) {
    return NextResponse.json({ error: "Percentage must be 1-100" }, { status: 400 });
  }
  if (data.expiresAt !== undefined) {
    data.expiresAt = data.expiresAt ? new Date(data.expiresAt as string) : null;
  }

  try {
    const updated = await prisma.discountCode.update({ where: { id: params.id }, data });
    return NextResponse.json({ discountCode: updated });
  } catch {
    return NextResponse.json({ error: "Not found or duplicate code" }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await prisma.discountCode.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
