import { ProductsManager } from "@/components/merchant/ProductsManager";
import { requireComerciante } from "@/lib/auth/session";

export default async function MerchantProductosPage() {
  await requireComerciante("/dashboard/merchant/productos");
  return <ProductsManager />;
}
