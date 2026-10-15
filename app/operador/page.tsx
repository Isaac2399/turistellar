import type { Metadata } from "next";
import { PanelOperador } from "@/components/zona/PanelOperador";
import { ZonaShell } from "@/components/zona/ZonaShell";

export const metadata: Metadata = {
  title: "Operador · Turistellar",
  description: "El operador marca que el servicio se prestó.",
};

export default function OperadorPage() {
  return (
    <ZonaShell>
      <PanelOperador />
    </ZonaShell>
  );
}
