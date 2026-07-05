"use client";

import { useState } from "react";

interface Payment {
  id: string;
  amount: number;
  type: string;
  status: string;
  paidDate: string | null;
  dueDate: string | null;
}

interface LeaseData {
  id: string;
  status: string;
  monthlyRate: number;
  depositAmount: number;
  depositStatus: string;
  startDate: string;
  unit: {
    unitNumber: string;
    size: string;
    hasElectricity: boolean;
    container: { locationOnSite: string };
  };
  payments: Payment[];
}

interface TenantData {
  name: string;
  email: string;
  phone: string;
  leases: LeaseData[];
}

export default function PortalPage() {
  const [email, setEmail] = useState("");
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch(`/api/tenants?email=${encodeURIComponent(email)}`);
      if (!resp.ok) {
        setError(resp.status === 404 ? "No account found with that email." : "Something went wrong.");
        setTenant(null);
      } else {
        setTenant(await resp.json());
      }
    } catch {
      setError("Network error.");
    }

    setLoading(false);
  };

  const statusColor: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    NOTICE: "bg-orange-100 text-orange-700",
    ENDED: "bg-gray-100 text-gray-500",
    PAID: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Tenant Portal</h1>
      <p className="text-gray-500 mb-8">View your lease details and payment history.</p>

      {!tenant && (
        <form onSubmit={lookup} className="flex gap-3 max-w-md">
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit" disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "..." : "Look Up"}
          </button>
        </form>
      )}

      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

      {tenant && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-lg font-semibold">{tenant.name}</div>
              <div className="text-sm text-gray-500">{tenant.email}</div>
            </div>
            <button
              onClick={() => { setTenant(null); setEmail(""); }}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Sign out
            </button>
          </div>

          {tenant.leases.map((lease) => (
            <div key={lease.id} className="border rounded-lg mb-6">
              {/* Lease header */}
              <div className="bg-gray-50 p-4 rounded-t-lg flex justify-between items-center">
                <div>
                  <span className="font-mono font-bold text-lg">{lease.unit.unitNumber}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    {lease.unit.size.toLowerCase()} • {lease.unit.container.locationOnSite}
                  </span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${statusColor[lease.status] ?? "bg-gray-100"}`}>
                  {lease.status}
                </span>
              </div>

              {/* Lease details */}
              <div className="p-4 grid grid-cols-2 gap-3 text-sm border-b">
                <div><span className="text-gray-500">Monthly rate:</span> <strong>${lease.monthlyRate}</strong></div>
                <div><span className="text-gray-500">Deposit:</span> ${lease.depositAmount} ({lease.depositStatus})</div>
                <div><span className="text-gray-500">Start:</span> {new Date(lease.startDate).toLocaleDateString()}</div>
                <div>
                  {lease.unit.hasElectricity && <span className="text-amber-600">⚡ Electricity included</span>}
                </div>
              </div>

              {/* Payment history */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Payments</h3>
                {lease.payments.length === 0 ? (
                  <p className="text-sm text-gray-400">No payments yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="pb-2">Type</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lease.payments.map((p) => (
                        <tr key={p.id} className="border-b last:border-0">
                          <td className="py-2 capitalize">{p.type.toLowerCase().replace("_", " ")}</td>
                          <td className="py-2">${p.amount}</td>
                          <td className="py-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${statusColor[p.status] ?? ""}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-2 text-gray-500">
                            {p.paidDate ? new Date(p.paidDate).toLocaleDateString() : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
