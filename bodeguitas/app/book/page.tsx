"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

interface UnitData {
  id: string;
  unitNumber: string;
  size: string;
  monthlyRate: number;
  premiumAmount: number;
  hasElectricity: boolean;
  container: { locationOnSite: string };
}

function BookingForm() {
  const searchParams = useSearchParams();
  const unitId = searchParams.get("unit");
  const cancelled = searchParams.get("cancelled");

  const [unit, setUnit] = useState<UnitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    nationality: "",
    idDocument: "",
    preferredStartDate: "",
    notes: "",
  });

  useEffect(() => {
    if (!unitId) return;
    fetch(`/api/units?status=RESERVED&includeId=${unitId}`)
      .then(() =>
        // Fetch the specific unit directly
        fetch(`/api/units`)
          .then((r) => r.json())
          .then((data) => {
            const found = data.units?.find((u: any) => u.id === unitId);
            setUnit(found ?? null);
            setLoading(false);
          })
      )
      .catch(() => setLoading(false));
  }, [unitId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitId) return;

    setSubmitting(true);
    setError(null);

    try {
      const resp = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, unitId }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data.error ?? "Something went wrong");
        setSubmitting(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  if (!unitId) {
    return <p className="text-center py-20 text-gray-500">No unit selected. Go back and choose a unit.</p>;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Reserve Your Unit</h1>

      {cancelled && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 mb-6 text-sm">
          Payment was cancelled. You can try again below.
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading unit info...</p>
      ) : !unit ? (
        <p className="text-red-600">Unit not found or no longer available.</p>
      ) : (
        <>
          {/* Unit summary */}
          <div className="bg-gray-50 border rounded-lg p-4 mb-8">
            <div className="flex justify-between">
              <div>
                <span className="font-mono font-bold text-lg">{unit.unitNumber}</span>
                <span className="ml-2 text-sm text-gray-500">{unit.size.toLowerCase()} unit</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${unit.monthlyRate + unit.premiumAmount}/mo</div>
                <div className="text-xs text-gray-500">+ ${unit.monthlyRate + unit.premiumAmount} deposit</div>
              </div>
            </div>
            {unit.hasElectricity && (
              <div className="text-xs text-amber-600 mt-2">⚡ Includes electricity</div>
            )}
          </div>

          {/* Booking form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text" required value={form.name} onChange={set("name")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email" required value={form.email} onChange={set("email")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel" value={form.phone} onChange={set("phone")}
                  placeholder="+506 8888-8888"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input
                  type="tel" value={form.whatsapp} onChange={set("whatsapp")}
                  placeholder="+506 8888-8888"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <input
                  type="text" value={form.nationality} onChange={set("nationality")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID / Passport #</label>
                <input
                  type="text" value={form.idDocument} onChange={set("idDocument")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Start Date *</label>
              <input
                type="date" required value={form.preferredStartDate} onChange={set("preferredStartDate")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={form.notes} onChange={set("notes")} rows={3}
                placeholder="Anything we should know? (e.g., storing surfboards, need access on a specific date)"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{error}</div>
            )}

            <button
              type="submit" disabled={submitting}
              className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Processing..." : `Pay $${unit ? (unit.monthlyRate + unit.premiumAmount) * 2 : "..."} — Deposit + First Month`}
            </button>

            <p className="text-xs text-gray-400 text-center">
              You&apos;ll be redirected to Stripe for secure payment. Deposit is refundable per our lease terms.
            </p>
          </form>
        </>
      )}
    </main>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<p className="text-center py-20 text-gray-500">Loading...</p>}>
      <BookingForm />
    </Suspense>
  );
}
