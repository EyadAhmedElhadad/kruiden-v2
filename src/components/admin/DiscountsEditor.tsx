"use client";

import { useState } from "react";
import { Icon } from "@/components/admin/Icon";
import { formatPrice } from "@/lib/utils";

type DiscountCode = {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  active: boolean;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  minOrderAmount: number | null;
  createdAt: string;
};

export default function DiscountsEditor({ codes: initial }: { codes: DiscountCode[] }) {
  const [codes, setCodes] = useState(initial);
  const [form, setForm] = useState({
    code: "",
    type: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    valueMajor: "",
    maxUses: "",
    expiresAt: "",
    minOrderMajor: "",
    active: true,
  });
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  function generateRandom() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
    setForm((f) => ({ ...f, code: out }));
  }

  async function create() {
    setMsg(null);
    if (!form.valueMajor) {
      setMsg({ type: "err", text: "Enter discount value" });
      return;
    }
    const value =
      form.type === "PERCENTAGE" ? parseInt(form.valueMajor, 10) : Math.round(parseFloat(form.valueMajor) * 100);
    if (!value || value <= 0) {
      setMsg({ type: "err", text: "Invalid value" });
      return;
    }
    if (form.type === "PERCENTAGE" && (value < 1 || value > 100)) {
      setMsg({ type: "err", text: "Percentage must be 1-100" });
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        type: form.type,
        value,
        active: form.active,
        maxUses: form.maxUses ? parseInt(form.maxUses, 10) : null,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        minOrderAmount: form.minOrderMajor ? Math.round(parseFloat(form.minOrderMajor) * 100) : null,
      };
      if (form.code.trim()) payload.code = form.code.trim().toUpperCase();

      const res = await fetch("/api/discount-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setCodes((c) => [data.discountCode, ...c]);
      setForm({ code: "", type: "PERCENTAGE", valueMajor: "", maxUses: "", expiresAt: "", minOrderMajor: "", active: true });
      setMsg({ type: "ok", text: `Code ${data.discountCode.code} created` });
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Failed" });
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(c: DiscountCode) {
    const res = await fetch(`/api/discount-codes/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    if (res.ok) {
      const data = await res.json();
      setCodes((arr) => arr.map((x) => (x.id === c.id ? data.discountCode : x)));
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this code?")) return;
    const res = await fetch(`/api/discount-codes/${id}`, { method: "DELETE" });
    if (res.ok) setCodes((arr) => arr.filter((x) => x.id !== id));
  }

  function copy(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-6">
      <div className="labs-card p-5">
        <h3 className="text-sm font-semibold text-[#f4f7ef]">Generate Discount Code</h3>
        <p className="mt-1 text-xs text-[#b9c2ab]">Admin-only: create percentage or fixed-amount codes for checkout.</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-[#b9c2ab]">Code (leave blank to auto-generate)</label>
            <div className="flex gap-2">
              <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. WELCOME10" className="labs-input flex-1 uppercase" />
              <button type="button" onClick={generateRandom} className="labs-btn whitespace-nowrap px-3 text-xs">Generate</button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-[#b9c2ab]">Type</label>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "PERCENTAGE" | "FIXED" }))} className="labs-input">
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed amount (EGP)</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-[#b9c2ab]">{form.type === "PERCENTAGE" ? "Percent (1-100)" : "Amount (EGP)"}</label>
            <input type="number" step={form.type === "PERCENTAGE" ? "1" : "0.01"} value={form.valueMajor} onChange={(e) => setForm((f) => ({ ...f, valueMajor: e.target.value }))} placeholder={form.type === "PERCENTAGE" ? "10" : "50.00"} className="labs-input" />
          </div>

          <div>
            <label className="mb-1 block text-xs text-[#b9c2ab]">Max uses (blank = unlimited)</label>
            <input type="number" min="1" value={form.maxUses} onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))} placeholder="e.g. 100" className="labs-input" />
          </div>

          <div>
            <label className="mb-1 block text-xs text-[#b9c2ab]">Expires at</label>
            <input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))} className="labs-input" />
          </div>

          <div>
            <label className="mb-1 block text-xs text-[#b9c2ab]">Min order amount (EGP)</label>
            <input type="number" step="0.01" value={form.minOrderMajor} onChange={(e) => setForm((f) => ({ ...f, minOrderMajor: e.target.value }))} placeholder="e.g. 500" className="labs-input" />
          </div>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-[#b9c2ab]">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="h-4 w-4 accent-[#a9d389]" />
          Active
        </label>

        {msg && <p className={`mt-3 text-sm ${msg.type === "ok" ? "text-[#a9d389]" : "text-[#d97a7a]"}`}>{msg.text}</p>}

        <button onClick={create} disabled={saving} className="labs-btn mt-4">
          {saving ? "Creating…" : "Create Code"}
        </button>
      </div>

      <div className="labs-card overflow-hidden">
        <div className="border-b border-[rgba(169,211,137,0.12)] px-4 py-3">
          <h3 className="text-sm font-semibold text-[#f4f7ef]">Existing Codes ({codes.length})</h3>
        </div>
        <div className="divide-y divide-[rgba(169,211,137,0.08)]">
          {codes.map((c) => (
            <div key={c.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#a9d389]">{c.code}</span>
                  <button onClick={() => copy(c.code)} className="text-[#b9c2ab] hover:text-[#f4f7ef]" title="Copy">
                    <Icon name={copied === c.code ? "check" : "content_copy"} size={16} />
                  </button>
                  <span className={`ml-2 rounded px-2 py-0.5 text-xs ${c.active ? "bg-[#a9d389]/20 text-[#a9d389]" : "bg-[#d97a7a]/20 text-[#d97a7a]"}`}>{c.active ? "Active" : "Inactive"}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-3 text-xs text-[#b9c2ab]">
                  <span>{c.type === "PERCENTAGE" ? `${c.value}%` : formatPrice(c.value)}</span>
                  <span>Used {c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}</span>
                  {c.minOrderAmount ? <span>Min {formatPrice(c.minOrderAmount)}</span> : null}
                  {c.expiresAt ? <span>Expires {new Date(c.expiresAt).toLocaleDateString()}</span> : <span>No expiry</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 text-xs text-[#b9c2ab]">
                  <input type="checkbox" checked={c.active} onChange={() => toggleActive(c)} className="h-3 w-3 accent-[#a9d389]" /> active
                </label>
                <button onClick={() => remove(c.id)} className="text-[#d97a7a] hover:text-[#f4f7ef]"><Icon name="delete" size={18} /></button>
              </div>
            </div>
          ))}
          {codes.length === 0 && <p className="px-4 py-6 text-center text-sm text-[#b9c2ab]">No discount codes yet.</p>}
        </div>
      </div>
    </div>
  );
}
