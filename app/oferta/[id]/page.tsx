import { FichaOferta } from "@/components/zona/FichaOferta";
import { ZonaShell } from "@/components/zona/ZonaShell";

export default async function OfertaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <ZonaShell>
      <FichaOferta id={id} />
    </ZonaShell>
  );
}
