const RUNTIME_KEYS = [
  "DATABASE_URL",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "ADMIN_EMAIL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
] as const;

function unwrapQuoted(value: string): string {
  const trimmed = value.trim();
  const quote = trimmed[0];
  if (
    trimmed.length >= 2 &&
    (quote === "'" || quote === '"') &&
    trimmed.endsWith(quote)
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function databaseUrl(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw?.trim()) {
    throw new Error("DATABASE_URL is not set");
  }
  return unwrapQuoted(raw);
}

export function databaseUrlOrDummy(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw?.trim()) {
    return "postgresql://postgres:postgres@127.0.0.1:5432/arah_indonesia?schema=public";
  }
  return unwrapQuoted(raw);
}

/** Hostinger injects KEY='value' literally; pg then resolves host to "base". */
export function sanitizeRuntimeEnv(): void {
  for (const key of RUNTIME_KEYS) {
    const current = process.env[key];
    if (typeof current === "string" && current.length > 0) {
      process.env[key] = unwrapQuoted(current);
    }
  }
}
