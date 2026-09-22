import type { RolUsuario } from "@/types";

export const AUTH_COOKIE = "hub_rural_session";

export type AuthSession = {
  id: string;
  email: string;
  nombre: string;
  rol: RolUsuario;
};
