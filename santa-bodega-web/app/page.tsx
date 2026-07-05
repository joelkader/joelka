import Link from "next/link";
import { getUnits } from "@/lib/api";
import { Mascot, Wordmark } from "@/components/Logo";

const SIZE_LABEL: Record<string, string> = {
  QUARTER: "1/4 de contenedor",
  HALF: "1/2 contenedor",
  FULL: "Contenedor completo",
};

export default async function HomePage() {
  const units = await getUnits();
  const available = units.filter((u) => u.status === "AVAILABLE");

  return (
    <main>
      <section className="corrugation bg-signal text-white px-6 py-20 text-center">
        <Mascot className="w-28 h-28 mx-auto mb-6" />
        <Wordmark className="text-white mb-6" />
        <p className="max-w-xl mx-auto text-white/90 md:text-lg">
          Bodegas de contenedor listas para tus cosas en Santa Teresa. Reserva en línea,
          paga con SINPE Móvil o tarjeta, y recibe tu código de acceso por WhatsApp.
        </p>
      </section>

      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="font-display font-bold text-2xl uppercase text-ink mb-8">
          Disponibilidad
        </h2>
        {available.length === 0 ? (
          <p className="text-ink-soft">
            No hay unidades disponibles en este momento. Escríbenos para entrar en la lista
            de espera.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((unit) => (
              <Link
                key={unit.id}
                href={`/book?unit=${unit.id}`}
                className="block border border-ink/10 bg-white rounded-xl p-5 hover:border-signal hover:shadow-md transition-all"
              >
                <p className="font-display font-bold text-signal text-3xl mb-1">#{unit.code}</p>
                <p className="text-ink">{SIZE_LABEL[unit.size]}</p>
                <p className="text-ink-soft text-sm mb-4">
                  {unit.hasElectricity ? "Con electricidad" : "Sin electricidad"}
                </p>
                <p className="font-display font-semibold text-lg text-ink">
                  ₡{unit.monthlyRate.toLocaleString("es-CR")}/mes
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
