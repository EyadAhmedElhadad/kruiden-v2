import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import DiscountsEditor from "@/components/admin/DiscountsEditor";
import { prisma } from "@/lib/prisma";

export default async function AdminDiscountsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  let codes: Awaited<ReturnType<typeof prisma.discountCode.findMany>> = [];
  try {
    codes = await prisma.discountCode.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    codes = [];
  }

  return (
    <AdminShell>
      <p className="text-[12px] uppercase tracking-widest text-[#a9d389]">Commerce</p>
      <h1 className="font-display mt-1 text-3xl font-bold text-[#f4f7ef]">Discount Codes</h1>
      <p className="mt-1 text-sm text-[#b9c2ab]">Generate and manage coupon codes for checkout.</p>
      <div className="mt-6">
        <DiscountsEditor codes={codes as any} />
      </div>
    </AdminShell>
  );
}
