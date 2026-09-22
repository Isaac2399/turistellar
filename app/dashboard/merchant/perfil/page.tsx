import { ProfileForm } from "@/components/merchant/ProfileForm";
import { requireComerciante } from "@/lib/auth/session";

export default async function MerchantPerfilPage() {
  await requireComerciante("/dashboard/merchant/perfil");
  return <ProfileForm />;
}
