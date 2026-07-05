"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPaymentStatus, type PaymentStatus } from "@/lib/api";

const POLL_MS = 3000;
const MAX_ATTEMPTS = 20;

export default function PaymentResultPage() {
  return (
    <Suspense>
      <PaymentResult />
    </Suspense>
  );
}

function PaymentResult() {
  const params = useSearchParams();
  const order = params.get("order") ?? "";
  const [status, setStatus] = useState<PaymentStatus>("CONFIRMING");

  useEffect(() => {
    if (!order) return;
    let attempts = 0;
    let cancelled = false;

    async function poll() {
      try {
        const result = await getPaymentStatus(order);
        if (cancelled) return;
        setStatus(result);
        if (result === "ACTIVE" || result === "FAILED") return;
      } catch {
        // Transient network error — keep polling rather than flipping to failed.
      }
      attempts += 1;
      if (attempts < MAX_ATTEMPTS && !cancelled) {
        setTimeout(poll, POLL_MS);
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [order]);

  return (
    <main className="max-w-md mx-auto px-6 py-24 text-center">
      {status === "ACTIVE" && (
        <>
          <h1 className="font-display text-3xl text-signal uppercase mb-4">¡Listo!</h1>
          <p className="text-ink-soft">
            Tu bodega está confirmada. Te enviamos el código de acceso por WhatsApp.
          </p>
        </>
      )}
      {status === "FAILED" && (
        <>
          <h1 className="font-display text-3xl text-red-600 uppercase mb-4">
            Pago no completado
          </h1>
          <p className="text-ink-soft">
            Algo falló con el pago. Puedes intentar de nuevo o escribirnos por WhatsApp.
          </p>
        </>
      )}
      {status !== "ACTIVE" && status !== "FAILED" && (
        <>
          <h1 className="font-display text-3xl text-signal uppercase mb-4">Confirmando...</h1>
          <p className="text-ink-soft">
            Estamos confirmando tu pago. Esto puede tardar unos segundos, no cierres esta
            página.
          </p>
        </>
      )}
    </main>
  );
}
