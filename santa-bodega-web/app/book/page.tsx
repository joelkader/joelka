"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createLease, createPayment } from "@/lib/api";

export default function BookPage() {
  return (
    <Suspense>
      <BookForm />
    </Suspense>
  );
}

function BookForm() {
  const params = useSearchParams();
  const unitId = params.get("unit") ?? "";
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { leaseId } = await createLease({ unitId, language: "es", ...form });
      const { paymentUrl } = await createPayment(leaseId);
      window.location.href = paymentUrl;
    } catch {
      setError("No se pudo procesar la reserva. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl uppercase text-ink mb-2">Reservar bodega</h1>
      <p className="text-ink-soft mb-8">Unidad #{unitId || "—"}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Nombre completo"
          className="w-full border border-ink/20 rounded px-4 py-3"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          type="email"
          placeholder="Correo electrónico"
          className="w-full border border-ink/20 rounded px-4 py-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          required
          type="tel"
          placeholder="WhatsApp (+506...)"
          className="w-full border border-ink/20 rounded px-4 py-3"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading || !unitId}
          className="w-full bg-signal text-white font-display uppercase tracking-wide py-3 rounded hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Procesando..." : "Continuar al pago"}
        </button>
      </form>
    </main>
  );
}
