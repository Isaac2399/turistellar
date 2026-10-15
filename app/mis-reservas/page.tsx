import type { Metadata } from "next";
import { PanelTurista } from "@/components/zona/PanelTurista";
import { ZonaShell } from "@/components/zona/ZonaShell";

export const metadata: Metadata = {
  title: "Mis reservas · Turistellar",
  description: "El visitante confirma que el servicio ocurrió.",
};

export default function MisReservasPage() {
  return (
    <ZonaShell>
      <PanelTurista />
    </ZonaShell>
  );
}
