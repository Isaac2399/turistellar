import type { Metadata } from "next";
import { MerchantShell } from "@/components/merchant/MerchantShell";
import { requireComerciante } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Panel comerciante · Hub Rural",
  description:
    "Gestiona perfil, tours, alojamiento, productos, calendario, anticipos USDC y notificaciones operativas.",
};

export default async function MerchantLayout({
  children,
}: LayoutProps<"/dashboard/merchant">) {
  const session = await requireComerciante("/dashboard/merchant");
  return <MerchantShell merchantId={session.id}>{children}</MerchantShell>;
}
