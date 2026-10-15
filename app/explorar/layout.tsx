import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explorar · Turistellar",
  description:
    "Fincas, guías y comedores de la Zona Sur, con el historial de lo que ya cumplieron.",
};

export default function ExplorarLayout({
  children,
}: LayoutProps<"/explorar">) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">{children}</section>
  );
}
