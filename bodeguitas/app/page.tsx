import Link from "next/link";
import { db } from "@/lib/db";
import { UnitStatus } from "@prisma/client";

const SIZE_LABELS = { QUARTER: "Quarter (≈80 sq ft)", HALF: "Half (≈160 sq ft)", FULL: "Full (≈320 sq ft)" };
const SIZE_ORDER = { QUARTER: 0, HALF: 1, FULL: 2 };

export default async function HomePage() {
  const units = await db.unit.findMany({
    include: { container: { select: { locationOnSite: true } } },
    orderBy: { unitNumber: "asc" },
  });

  const available = units.filter((u) => u.status === UnitStatus.AVAILABLE);
  const totalUnits = units.length;
  const availableCount = available.length;

  // Group available units by size
  const bySize = available.reduce(
    (acc, u) => {
      acc[u.size] = acc[u.size] || [];
      acc[u.size].push(u);
      return acc;
    },
    {} as Record<string, typeof available>
  );

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Bodeguitas</h1>
        <p className="text-lg text-gray-600">
          Secure container storage in Santa Teresa, Costa Rica.
        </p>
      </div>

      {/* Availability summary */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-700">{availableCount}</div>
          <div className="text-sm text-green-600">Available</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-gray-700">{totalUnits - availableCount}</div>
          <div className="text-sm text-gray-500">Occupied / Reserved</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-700">{totalUnits}</div>
          <div className="text-sm text-blue-600">Total Units</div>
        </div>
      </div>

      {/* Unit cards */}
      {Object.entries(bySize)
        .sort(([a], [b]) => (SIZE_ORDER[a as keyof typeof SIZE_ORDER] ?? 0) - (SIZE_ORDER[b as keyof typeof SIZE_ORDER] ?? 0))
        .map(([size, sizeUnits]) => (
          <div key={size} className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {SIZE_LABELS[size as keyof typeof SIZE_LABELS] ?? size}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {sizeUnits.map((unit) => (
                <div
                  key={unit.id}
                  className="border border-gray-200 rounded-lg p-5 hover:border-blue-400 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-lg font-mono font-bold">{unit.unitNumber}</span>
                      <span className="ml-2 text-xs text-gray-400">{unit.container.locationOnSite}</span>
                    </div>
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                      Available
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    ${unit.monthlyRate + unit.premiumAmount}
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </div>

                  {unit.hasElectricity && (
                    <div className="text-xs text-amber-600 mb-3">⚡ Electricity included (+${unit.premiumAmount})</div>
                  )}

                  <Link
                    href={`/book?unit=${unit.id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Reserve This Unit
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}

      {availableCount === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600 mb-4">All units are currently occupied.</p>
          <Link
            href="/waitlist"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700"
          >
            Join the Waitlist
          </Link>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200 text-sm text-gray-500">
        <p>Bodeguitas — A KPH Holdings company</p>
        <p>Santa Teresa, Cobano, Puntarenas, Costa Rica</p>
      </footer>
    </main>
  );
}
