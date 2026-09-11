import { prisma } from "@/lib/prisma";

export type DiscountValidationResult =
  | { valid: true; discountCode: { id: string; code: string; type: "PERCENTAGE" | "FIXED"; value: number }; discountAmount: number }
  | { valid: false; error: string };

export async function validateDiscountCode(code: string, subtotal: number): Promise<DiscountValidationResult> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { valid: false, error: "Enter a code" };

  const dc = await prisma.discountCode.findUnique({ where: { code: normalized } });
  if (!dc) return { valid: false, error: "Invalid code" };
  if (!dc.active) return { valid: false, error: "Code is inactive" };
  if (dc.expiresAt && dc.expiresAt < new Date()) return { valid: false, error: "Code has expired" };
  if (dc.maxUses !== null && dc.usedCount >= dc.maxUses) return { valid: false, error: "Code usage limit reached" };
  if (dc.minOrderAmount !== null && subtotal < dc.minOrderAmount) {
    return { valid: false, error: `Minimum order ${dc.minOrderAmount / 100} EGP required` };
  }

  let discountAmount = 0;
  if (dc.type === "PERCENTAGE") {
    discountAmount = Math.floor((subtotal * dc.value) / 100);
  } else {
    discountAmount = Math.min(dc.value, subtotal);
  }
  if (discountAmount <= 0) return { valid: false, error: "Code gives no discount" };

  return {
    valid: true,
    discountCode: { id: dc.id, code: dc.code, type: dc.type as "PERCENTAGE" | "FIXED", value: dc.value },
    discountAmount,
  };
}

export function generateRandomCode(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
