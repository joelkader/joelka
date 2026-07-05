import Link from "next/link";
import { getUnits } from "@/lib/api";

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
      <section className="corrugation bg-marine text-sand-light px-6 py-24 text-center">
        <p className="font-display text-signal uppercase tracking-widest text-sm mb-4">
          Santa Teresa, Costa Rica
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase mb-4">Santa Bodega</h1>
        <p className="max-w-xl mx-auto text-marine-faded md:text-lg">
          Bodegas de contenedor listas para tus cosas. Reserva en línea, paga con SINPE
          Móvil o tarjeta, recibe tu código de acceso por WhatsApp.
        </p>
      </section>

      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="font-display text-2xl uppercase text-steel-dark mb-8">Disponibilidad</h2>
        {available.length === 0 ? (
          <p className="text-steel">
            No hay unidades disponibles en este momento. Escríbenos para entrar en la lista
            de espera.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((unit) => (
              <Link
                key={unit.id}
                href={`/book?unit=${unit.id}`}
                className="block border border-steel/20 bg-white rounded-lg p-5 hover:border-signal transition-colors"
              >
                <p className="font-display text-signal text-3xl mb-1">#{unit.code}</p>
                <p className="text-steel-dark">{SIZE_LABEL[unit.size]}</p>
                <p className="text-steel text-sm mb-4">
                  {unit.hasElectricity ? "Con electricidad" : "Sin electricidad"}
                </p>
                <p className="font-display text-lg text-steel-dark">
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
