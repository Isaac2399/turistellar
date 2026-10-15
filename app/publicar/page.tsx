import type { Metadata } from "next";
import { FormularioPublicar } from "@/components/zona/FormularioPublicar";
import { ZonaShell } from "@/components/zona/ZonaShell";

export const metadata: Metadata = {
  title: "Publicar · Turistellar",
  description: "Publica una oferta de cama, guía o comida en la Zona Sur.",
};

export default function PublicarPage() {
  return (
    <ZonaShell>
      <FormularioPublicar />
    </ZonaShell>
  );
}
