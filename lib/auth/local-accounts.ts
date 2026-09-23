import { randomUUID } from "crypto";
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import type { RolUsuario } from "@/types";
import { authenticateDemoUser, isDemoEmail } from "./demo-users";
import { hashPassword, hashesMatch } from "./password";
import type { AuthSession } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const ACCOUNTS_FILE = path.join(DATA_DIR, "accounts.json");

type LocalAccount = AuthSession & { passwordHash: string };

export type RegisterAccountInput = {
  nombre?: unknown;
  email?: unknown;
  password?: unknown;
  rol?: unknown;
};

export type RegisterAccountResult =
  | { ok: true; user: AuthSession }
  | { ok: false; status: number; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let writeQueue: Promise<void> = Promise.resolve();

function withAccountsLock<T>(task: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(task, task);
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function isStoredAccount(value: unknown): value is LocalAccount {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<LocalAccount>;
  return (
    typeof item.id === "string" &&
    typeof item.email === "string" &&
    typeof item.nombre === "string" &&
    (item.rol === "turista" || item.rol === "comerciante") &&
    typeof item.passwordHash === "string"
  );
}

async function readAccounts(): Promise<LocalAccount[]> {
  let raw: string;
  try {
    raw = await readFile(ACCOUNTS_FILE, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed) || !parsed.every(isStoredAccount)) {
    throw new Error("El archivo de cuentas locales no es válido.");
  }
  return parsed;
}

async function writeAccounts(accounts: LocalAccount[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const tempFile = path.join(DATA_DIR, `accounts.${process.pid}.tmp`);
  await writeFile(tempFile, `${JSON.stringify(accounts, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  await rename(tempFile, ACCOUNTS_FILE);
}

function toSession(account: LocalAccount): AuthSession {
  return {
    id: account.id,
    email: account.email,
    nombre: account.nombre,
    rol: account.rol,
  };
}

function authenticateAgainst(accounts: LocalAccount[], email: string, password: string): AuthSession | null {
  const normalized = email.trim().toLowerCase();
  const account = accounts.find((item) => item.email === normalized);
  if (!account) return null;
  if (!hashesMatch(account.passwordHash, hashPassword(password))) return null;
  return toSession(account);
}

export async function authenticateUser(email: string, password: string): Promise<AuthSession | null> {
  const demo = authenticateDemoUser(email, password);
  if (demo) return demo;
  if (isDemoEmail(email)) return null;
  const accounts = await readAccounts();
  return authenticateAgainst(accounts, email, password);
}

function invalid(error: string, status = 400): RegisterAccountResult {
  return { ok: false, status, error };
}

function parseRegisterableRole(value: unknown): Extract<RolUsuario, "turista" | "comerciante"> | null {
  if (value === "turista" || value === "comerciante") return value;
  return null;
}

export async function registerLocalAccount(input: RegisterAccountInput): Promise<RegisterAccountResult> {
  const nombre = typeof input.nombre === "string" ? input.nombre.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";
  const rol = parseRegisterableRole(input.rol);

  if (nombre.length < 2 || nombre.length > 80) {
    return invalid("Escribe un nombre de al menos 2 caracteres.");
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 120) {
    return invalid("Escribe un correo válido.");
  }
  if (password.length < 8 || password.length > 128) {
    return invalid("La contraseña debe tener al menos 8 caracteres.");
  }
  if (!rol) {
    return invalid("Elige el rol de turista o comerciante.");
  }
  if (isDemoEmail(email)) {
    return invalid("Ese correo ya está registrado.", 409);
  }

  return withAccountsLock(async () => {
    const accounts = await readAccounts();
    if (accounts.some((item) => item.email === email)) {
      return invalid("Ese correo ya está registrado.", 409);
    }

    const account: LocalAccount = {
      id: `usr_${randomUUID()}`,
      email,
      nombre,
      rol,
      passwordHash: hashPassword(password),
    };
    accounts.push(account);
    await writeAccounts(accounts);
    return { ok: true, user: toSession(account) };
  });
}
