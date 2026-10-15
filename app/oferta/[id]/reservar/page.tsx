import { FormularioReserva } from "@/components/zona/FormularioReserva";
import { ZonaShell } from "@/components/zona/ZonaShell";

export default async function ReservarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ZonaShell>
      <FormularioReserva ofertaId={id} />
    </ZonaShell>
  );
}
