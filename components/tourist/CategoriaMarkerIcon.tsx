import { BedDouble, Compass, Package, ShoppingBasket } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoriaOferta } from "@/types/tourist";

const ICONS: Record<CategoriaOferta, typeof BedDouble> = {
  alojamiento: BedDouble,
  tour: Compass,
  producto: ShoppingBasket,
  paquete: Package,
};

const TONES: Record<CategoriaOferta, string> = {
  alojamiento: "bg-emerald-700 text-white",
  tour: "bg-sky-700 text-white",
  producto: "bg-amber-600 text-white",
  paquete: "bg-violet-700 text-white",
};

export function CategoriaMarkerIcon({
  categoria,
  className,
}: {
  categoria: CategoriaOferta;
  className?: string;
}) {
  const Icon = ICONS[categoria];
  return <Icon className={className} aria-hidden />;
}

export function MapMarkerBadge({
  categoria,
  className,
}: {
  categoria: CategoriaOferta;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full shadow-md ring-2 ring-white",
        TONES[categoria],
        className,
      )}
    >
      <CategoriaMarkerIcon categoria={categoria} className="h-4 w-4" />
    </span>
  );
}
