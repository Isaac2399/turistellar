import { AvailabilityCalendar } from "@/components/merchant/AvailabilityCalendar";
import { requireComerciante } from "@/lib/auth/session";

export default async function MerchantCalendarioPage() {
  await requireComerciante("/dashboard/merchant/calendario");
  return <AvailabilityCalendar />;
}
