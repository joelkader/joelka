const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type Unit = {
  id: string;
  code: string;
  size: "QUARTER" | "HALF" | "FULL";
  monthlyRate: number;
  premiumAmount: number;
  hasElectricity: boolean;
  status: "AVAILABLE" | "RESERVED" | "OCCUPIED" | "MAINTENANCE";
};

// Demo data so the landing page has something to render before kph-backend
// (or NEXT_PUBLIC_API_URL) is wired up.
const DEMO_UNITS: Unit[] = [
  { id: "demo-1", code: "A1", size: "QUARTER", monthlyRate: 45000, premiumAmount: 0, hasElectricity: false, status: "AVAILABLE" },
  { id: "demo-2", code: "A2", size: "HALF", monthlyRate: 75000, premiumAmount: 0, hasElectricity: true, status: "AVAILABLE" },
  { id: "demo-3", code: "B1", size: "FULL", monthlyRate: 130000, premiumAmount: 15000, hasElectricity: true, status: "AVAILABLE" },
];

export async function getUnits(): Promise<Unit[]> {
  try {
    const res = await fetch(`${API_URL}/api/units`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(`units fetch failed: ${res.status}`);
    return res.json();
  } catch {
    return DEMO_UNITS;
  }
}

export type CreateLeaseInput = {
  unitId: string;
  name: string;
  email: string;
  phone: string;
  language: "es" | "en";
};

export async function createLease(input: CreateLeaseInput): Promise<{ leaseId: string }> {
  const res = await fetch("/api/leases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("No se pudo crear la reserva");
  return res.json();
}

export async function createPayment(leaseId: string): Promise<{ paymentUrl: string; orderId: string }> {
  const res = await fetch(`${API_URL}/api/payments/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "storage_lease", leaseId }),
  });
  if (!res.ok) throw new Error("No se pudo iniciar el pago");
  return res.json();
}

export type PaymentStatus = "PENDING" | "CONFIRMING" | "ACTIVE" | "FAILED";

export async function getPaymentStatus(order: string): Promise<PaymentStatus> {
  const res = await fetch(`/api/payments/status?order=${encodeURIComponent(order)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("status fetch failed");
  const data = await res.json();
  return data.status;
}
