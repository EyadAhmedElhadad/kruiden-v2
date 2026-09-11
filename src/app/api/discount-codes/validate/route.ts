import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateDiscountCode } from "@/lib/discount";

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().int().min(0),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ valid: false, error: "Invalid request" }, { status: 400 });

  const { code, subtotal } = parsed.data;
  const result = await validateDiscountCode(code, subtotal);
  if (!result.valid) return NextResponse.json({ valid: false, error: result.error }, { status: 200 });
  return NextResponse.json({
    valid: true,
    code: result.discountCode.code,
    type: result.discountCode.type,
    value: result.discountCode.value,
    discountAmount: result.discountAmount,
  });
}
