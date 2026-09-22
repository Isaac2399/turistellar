import { BookingsList } from "@/components/merchant/BookingsList";
import { requireComerciante } from "@/lib/auth/session";

export default async function MerchantReservasPage() {
  await requireComerciante("/dashboard/merchant/reservas");
  return <BookingsList />;
}
