import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { z } from "zod";
import { generateRandomCode } from "@/lib/discount";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const codes = await prisma.discountCode.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ discountCodes: codes });
}

const createSchema = z.object({
  code: z.string().min(3).max(20).optional(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().int().positive(),
  active: z.boolean().optional(),
  maxUses: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().nullable().optional(), // ISO date
  minOrderAmount: z.number().int().min(0).nullable().optional(),
});

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid" }, { status: 400 });

  const { code, type, value, active, maxUses, expiresAt, minOrderAmount } = parsed.data;

  if (type === "PERCENTAGE" && (value < 1 || value > 100)) {
    return NextResponse.json({ error: "Percentage must be 1-100" }, { status: 400 });
  }

  let finalCode = code?.trim().toUpperCase();
  if (!finalCode) finalCode = generateRandomCode(8);
  else finalCode = finalCode.replace(/[^A-Z0-9]/g, "");
  if (finalCode.length < 3) return NextResponse.json({ error: "Code too short" }, { status: 400 });

  try {
    const created = await prisma.discountCode.create({
      data: {
        code: finalCode,
        type,
        value,
        active: active ?? true,
        maxUses: maxUses ?? null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        minOrderAmount: minOrderAmount ?? null,
      },
    });
    return NextResponse.json({ discountCode: created });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("Unique constraint")) return NextResponse.json({ error: "Code already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
