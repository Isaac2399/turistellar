import { redirect } from "next/navigation";
import { requireComerciante } from "@/lib/auth/session";

export default async function DashboardComerciantePage() {
  await requireComerciante("/dashboard/merchant");
  redirect("/dashboard/merchant");
}
