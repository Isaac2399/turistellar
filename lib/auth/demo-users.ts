import { hashPassword, hashesMatch } from "./password";
import type { AuthSession } from "./types";

type DemoUser = AuthSession & { passwordHash: string };

const DEMO_USERS: DemoUser[] = [
  {
    id: "usr_comercio_roble",
    email: "comercio@hubrural.local",
    nombre: "Finca El Roble",
    rol: "comerciante",
    passwordHash: hashPassword("Comercio1234!"),
  },
  {
    id: "usr_comercio_valle",
    email: "artesania@hubrural.local",
    nombre: "Artesanías Valle Verde",
    rol: "comerciante",
    passwordHash: hashPassword("Artesania1234!"),
  },
  {
    id: "usr_turista_ana",
    email: "turista@hubrural.local",
    nombre: "Ana Turista",
    rol: "turista",
    passwordHash: hashPassword("Turista1234!"),
  },
];

export function isDemoEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return DEMO_USERS.some((item) => item.email === normalized);
}

export function authenticateDemoUser(email: string, password: string): AuthSession | null {
  const normalized = email.trim().toLowerCase();
  const user = DEMO_USERS.find((item) => item.email === normalized);
  if (!user) return null;
  if (!hashesMatch(user.passwordHash, hashPassword(password))) return null;
  return {
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    rol: user.rol,
  };
}
