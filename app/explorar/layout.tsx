import type { Metadata } from "next";
import { TripSteps } from "@/components/tourist/TripSteps";

export const metadata: Metadata = {
  title: "Explorar · Hub Rural",
  description:
    "Arma el viaje con alojamiento, tours y productos locales, y fíjale horarios.",
};

export default function ExplorarLayout({
  children,
}: LayoutProps<"/explorar">) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <TripSteps />
      {children}
    </section>
  );
}
