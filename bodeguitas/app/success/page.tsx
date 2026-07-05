import Link from "next/link";
import { db } from "@/lib/db";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ lease?: string }>;
}) {
  const { lease: leaseId } = await searchParams;

  let lease = null;
  if (leaseId) {
    lease = await db.lease.findUnique({
      where: { id: leaseId },
      include: {
        unit: true,
        tenant: { select: { name: true, email: true } },
      },
    });
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-3xl font-bold mb-2">You&apos;re All Set!</h1>

      {lease ? (
        <div className="text-left bg-gray-50 border rounded-lg p-6 mt-8 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Unit</span>
            <span className="font-mono font-bold">{lease.unit.unitNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Monthly Rate</span>
            <span className="font-bold">${lease.monthlyRate}/mo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Deposit</span>
            <span>${lease.depositAmount} (paid)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Start Date</span>
            <span>{new Date(lease.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded">
              {lease.status}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 mt-4">
          Your payment was processed. We&apos;ll send you a confirmation via WhatsApp and email shortly.
        </p>
      )}

      <div className="mt-8 space-y-3">
        <p className="text-sm text-gray-500">
          You&apos;ll receive your access code via WhatsApp before your move-in date.
        </p>
        <Link
          href="/"
          className="inline-block bg-gray-100 text-gray-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
